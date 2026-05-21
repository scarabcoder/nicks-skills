const port = Number(process.env.PORT || 3000);
const handler = (await import('./dist/server/server.js')).default;

Bun.serve({
  port,
  async fetch(request) {
    try {
      return await handler.fetch(request);
    } catch (error) {
      console.error(error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
});

console.log(`Server listening on http://localhost:${port}`);

