import { serve } from "@hono/node-server";
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const app = new Hono();

app.use('*', cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
  if (error) console.error('Error fetching tasks:', error);
  return data;
}

app.get('/api/hello', async (c) => {
  /*resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'shoyu930l@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  });*/
  try {
    // `await`を使って非同期処理の完了を待つ
    const data = await getTasks();
    console.log(data);  // データが正しく出力されることを確認

    // リクエストのレスポンスを返す
    return c.json({ message: 'Hello from Hono!', tasks: data });
  } catch (error) {
    console.error('Error in /api/hello route:', error);
    return c.json({ message: 'Something went wrong.' });
  }
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
