#!/usr/bin/env node
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const templateRoot = join(root, 'assets', 'bootstrap-template');

const presets = {
  'blank-local': {
    enableWorkspaces: false,
    enableEmail: false,
    enableMcp: false,
    enableAi: false,
    enableAudit: false,
    databaseProfile: 'pglite',
  },
  'workspace-local': {
    enableWorkspaces: true,
    enableEmail: false,
    enableMcp: false,
    enableAi: false,
    enableAudit: true,
    databaseProfile: 'pglite',
  },
  'platform-full': {
    enableWorkspaces: true,
    enableEmail: true,
    enableMcp: true,
    enableAi: true,
    enableAudit: true,
    databaseProfile: 'pglite',
  },
};

function usage() {
  console.log(`Usage:
  node scripts/bootstrap-tanstack-orpc-app.mjs --target <dir> [options]

Options:
  --preset <name>          blank-local | workspace-local | platform-full
  --config <file.json>     Optional config file; flags override file values
  --app-name <name>        Application display name
  --package-name <name>    package.json name
  --base-url <url>         Default: http://localhost:3000
  --dev-port <value>       auto or a port number. Default: 3000
  --workspaces             Enable workspace tenancy
  --email                  Enable email module
  --mcp                    Enable MCP module
  --ai                     Enable AI tools module
  --audit                  Enable audit logging
  --install                Run bun install after writing files
  --verify                 Run generated project checks after install/write
  --dry-run                Print planned files and next commands
  --json                   Emit machine-readable dry-run/output
  --force                  Overwrite existing files
`);
}

function parseArgs(argv) {
  const args = {
    dryRun: false,
    force: false,
    install: false,
    verify: false,
    json: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg === '--install') args.install = true;
    else if (arg === '--verify') args.verify = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--target') args.target = argv[++i];
    else if (arg === '--config') args.config = argv[++i];
    else if (arg === '--preset') args.preset = argv[++i];
    else if (arg === '--app-name') args.appName = argv[++i];
    else if (arg === '--package-name') args.packageName = argv[++i];
    else if (arg === '--base-url') args.baseUrl = argv[++i];
    else if (arg === '--dev-port') args.devPort = argv[++i];
    else if (arg === '--workspaces') args.enableWorkspaces = true;
    else if (arg === '--email') args.enableEmail = true;
    else if (arg === '--mcp') args.enableMcp = true;
    else if (arg === '--ai') args.enableAi = true;
    else if (arg === '--audit') args.enableAudit = true;
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
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._/-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'tanstack-orpc-app'
  );
}

function resolveConfig(args) {
  const presetName = args.preset || 'blank-local';
  const preset = presets[presetName];
  if (!preset) {
    throw new Error(
      `Unknown preset "${presetName}". Expected one of: ${Object.keys(presets).join(', ')}`,
    );
  }

  const fileConfig = loadConfig(args.config);
  const flagConfig = {
    appName: args.appName,
    packageName: args.packageName,
    baseUrl: args.baseUrl,
    devPort: args.devPort,
    enableWorkspaces: args.enableWorkspaces,
    enableEmail: args.enableEmail,
    enableMcp: args.enableMcp,
    enableAi: args.enableAi,
    enableAudit: args.enableAudit,
  };

  const config = { ...preset, ...fileConfig, ...definedOnly(flagConfig) };
  config.preset = presetName;
  config.appName = config.appName || 'Blank App';
  config.packageName = slugifyPackageName(config.packageName || config.appName);
  config.baseUrl = config.baseUrl || 'http://localhost:3000';
  config.devPort = String(config.devPort || '3000');

  return config;
}

function definedOnly(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );
}

function replacements(config) {
  return {
    APP_NAME: config.appName,
    PACKAGE_NAME: config.packageName,
    BASE_URL: config.baseUrl,
    DEV_PORT: config.devPort,
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

function planFiles(target) {
  return walk(templateRoot).map((file) => {
    const to = outputPathFor(file, target);
    return {
      from: relative(templateRoot, file),
      to,
      exists: existsSync(to),
    };
  });
}

function dependencyProfile(config) {
  const enabled = ['tanstack-start', 'orpc', 'drizzle', 'zod', 'pglite'];
  if (config.enableWorkspaces) enabled.push('workspace-tenancy');
  if (config.enableEmail) enabled.push('react-email', 'sendgrid');
  if (config.enableMcp) enabled.push('mcp');
  if (config.enableAi) enabled.push('ai-tools');
  if (config.enableAudit) enabled.push('audit-logging');
  return enabled;
}

function nextCommands({ install, verify }) {
  const commands = [];
  if (!install) commands.push('bun install');
  commands.push('bun run routes:generate');
  commands.push('bun run type-check');
  commands.push('bun run lint');
  commands.push('bun test');
  commands.push('bun run build');
  commands.push('bun run drizzle:generate');
  commands.push('bun run drizzle:migrate');
  if (verify) commands.unshift(install ? 'bun install' : '(install skipped)');
  return commands;
}

function dryRunReport({ config, planned, install, verify, json }) {
  const report = {
    config,
    dependencyProfile: dependencyProfile(config),
    files: planned,
    overwrites: planned.filter((file) => file.exists),
    nextCommands: nextCommands({ install, verify }),
  };

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log('Resolved config:');
  for (const [key, value] of Object.entries(config)) {
    console.log(`  ${key}: ${String(value)}`);
  }

  console.log('\nDependency profile:');
  for (const dep of report.dependencyProfile) console.log(`  - ${dep}`);

  console.log('\nFiles to write:');
  for (const file of planned) {
    console.log(`  ${file.exists ? 'overwrite' : 'create'} ${file.to}`);
  }

  console.log('\nFiles that would be overwritten:');
  if (report.overwrites.length === 0) console.log('  none');
  for (const file of report.overwrites) console.log(`  ${file.to}`);

  console.log('\nNext commands:');
  for (const command of report.nextCommands) console.log(`  ${command}`);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function runVerification({ target }) {
  run('bun', ['run', 'routes:generate'], target);
  run('bun', ['run', 'type-check'], target);
  run('bun', ['run', 'lint'], target);
  run('bun', ['test'], target);
  run('bun', ['run', 'build'], target);
  run('bun', ['run', 'drizzle:generate'], target);
  run('bun', ['run', 'drizzle:migrate'], target);
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

  const config = resolveConfig(args);
  config.target = args.target;
  const planned = planFiles(args.target);

  if (args.dryRun) {
    dryRunReport({
      config,
      planned,
      install: args.install,
      verify: args.verify,
      json: args.json,
    });
    return;
  }

  for (const file of planned) {
    if (file.exists && !args.force) {
      throw new Error(`Refusing to overwrite existing file without --force: ${file.to}`);
    }
  }

  const vars = replacements(config);
  for (const file of walk(templateRoot)) {
    const out = outputPathFor(file, args.target);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, render(readFileSync(file, 'utf8'), vars));
  }

  if (args.install) {
    run('bun', ['install'], args.target);
  }

  if (args.verify) {
    runVerification({ target: args.target });
  }

  const result = {
    createdFiles: planned.length,
    target: args.target,
    config,
    nextCommands: nextCommands({ install: args.install, verify: args.verify }),
  };

  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`Created ${planned.length} files in ${args.target}`);
  if (!args.verify) {
    console.log('Next commands:');
    for (const command of result.nextCommands) console.log(`  ${command}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
