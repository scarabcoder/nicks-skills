#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const templateRoot = join(root, 'assets', 'bootstrap-template');

function usage() {
  console.log(`Usage:
  node scripts/bootstrap-tanstack-orpc-app.mjs --target <dir> [--config app.json] [--dry-run] [--force]

Config JSON fields:
  appName, packageName, baseUrl, enableWorkspaces, enableEmail, enableMcp, enableAi, enableAudit
`);
}

function parseArgs(argv) {
  const args = { dryRun: false, force: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--target') args.target = argv[++i];
    else if (arg === '--config') args.config = argv[++i];
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function loadConfig(path) {
  if (!path) return {};
  return JSON.parse(readFileSync(path, 'utf8'));
}

function slugifyPackageName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._/-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tanstack-orpc-app';
}

function replacements(config) {
  const appName = config.appName || 'TanStack oRPC App';
  const packageName = slugifyPackageName(config.packageName || appName);
  const baseUrl = config.baseUrl || 'http://localhost:3000';
  return {
    APP_NAME: appName,
    PACKAGE_NAME: packageName,
    BASE_URL: baseUrl,
    ENABLE_WORKSPACES: String(Boolean(config.enableWorkspaces)),
    ENABLE_EMAIL: String(Boolean(config.enableEmail)),
    ENABLE_MCP: String(Boolean(config.enableMcp)),
    ENABLE_AI: String(Boolean(config.enableAi)),
    ENABLE_AUDIT: String(Boolean(config.enableAudit)),
  };
}

function render(content, vars) {
  return content.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Missing template value: ${key}`);
    return vars[key];
  });
}

function walk(dir) {
  const entries = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) entries.push(...walk(path));
    else entries.push(path);
  }
  return entries;
}

function outputPathFor(templatePath, target) {
  const rel = relative(templateRoot, templatePath);
  return join(target, rel.replace(/\.tpl$/, ''));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }
  if (!args.target) {
    usage();
    process.exitCode = 1;
    return;
  }

  const config = loadConfig(args.config);
  const vars = replacements(config);
  const files = walk(templateRoot);
  const planned = files.map((file) => ({
    from: relative(templateRoot, file),
    to: outputPathFor(file, args.target),
  }));

  if (args.dryRun) {
    for (const file of planned) console.log(file.to);
    return;
  }

  for (const file of files) {
    const out = outputPathFor(file, args.target);
    if (existsSync(out) && !args.force) {
      throw new Error(`Refusing to overwrite existing file without --force: ${out}`);
    }
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, render(readFileSync(file, 'utf8'), vars));
  }

  console.log(`Created ${files.length} files in ${args.target}`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

