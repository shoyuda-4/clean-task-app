import { serve } from "@hono/node-server";
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' });
});

app.post('/api/data', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

serve({
    fetch: app.fetch,
    port: 3000,
  });
