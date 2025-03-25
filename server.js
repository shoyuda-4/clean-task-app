import { serve } from "@hono/node-server";
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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
    const { data1, error } = await supabase
  .from('tasks')
  .insert([
    {
      task_name: '掃除機かけ',
      last_cleaned: '2023-03-10T12:00:00Z',
      next_clean: '2023-03-17T12:00:00Z',
      cleaning_interval: 7,
    },
  ]);
  console.log(data1);
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

app.post('/signup', async (c) => {
  const body = await c.req.json();
  //メールアドレスのバリデーション
  if (!body.email || !body.email.includes("@")) {
    return c.json({ error: "Invalid email format" }, 400);
  }

  //パスワードのバリデーション（最低8文字）
  if (!body.password || body.password.length < 8) {
    return c.json({ error: "Password must be at least 8 characters long" }, 400);
  }



  try{
    const { data: checkData, checkerror } = await supabase
      .from('users')
      .select('*')
      .eq('email', body.email);
    if (checkerror) {
      console.error('Error checking user:', checkerror);
      return c.json({ error: 'Internal Server Error' }, 500); // HTTP 500 Internal Server Error
    }
    if (checkData.length > 0) {
      // ユーザーが既に存在している
      return c.json({ error: 'このメールアドレスは既に使われています' }, 400);
    }
    const {data, error} = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });
    if (error) {
      console.error('Error signing up:', error);
      return c.json({ error: error.message }, 400); // HTTP 400 Bad Request を返す
    }

    const { user } = data;

    const { dberror } = await supabase
      .from('users')
      .insert([
        { id: user.id, email: user.email },
      ]);
    if (dberror) {
      console.error('Error inserting user:', dberror);
      return c.json({ error: 'Internal Server Error' }, 500); // HTTP 500 Internal Server Error
    }

    console.log('User signed up:', data.user);
    return c.json({user: data.user});
  }catch(error) {
    console.error('Unexpected error signing up:', error);
    return c.json({ error: 'User Saving Error' }, 500); // HTTP 500 Internal Server Error
  } 
    
});

app.post('/signin', async (c) => {
  const body = await c.req.json();
  try {
    const {data, error} = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (error || !data.user) {
      console.error('Error signing in:', error);
      return c.json({ error: error.message }, 400); // HTTP 400 Bad Request を返す
    }
    console.log('User signed in:', data.user);
    return c.json({
      user: data.user,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token // トークンを返す
    });
  }
  catch(error) {
      console.error('Unexpected error signing in:', error);
      return c.json({ error: 'Internal Server Error' }, 500); // HTTP 500 Internal Server Error
  }
});

app.post('/tasks/create', async (c) => {  
    const body = await c.req.json();

    if(!body.task_name || !body.last_cleaned || !body.cleaning_interval) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    const lastcleanDate = new Date(body.last_cleaned);
    lastcleanDate.setDate(lastcleanDate.getDate() + Number(body.cleaning_interval));
    const nextcleanDate = lastcleanDate.toISOString().split('T')[0];
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            task_name: body.task_name,
            last_cleaned: body.last_cleaned,
            next_clean: nextcleanDate,
            cleaning_interval: body.cleaning_interval,
            user_id: body.user_id,
          },
        ])
        .select();
      if (error) {
        console.error('Error inserting task:', error);
        return c.json({ error: 'Internal Server Error' }, 500);
      }

      if (!data || data.length === 0) {
        return c.json({ error: 'No data returned from insert' }, 500);
      }
      console.log('Task created:', data);
      return c.json({ task: data[0] });
    } catch (error) {
      console.error('Unexpected error creating task:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
});

app.get('/tasks', async (c) => {
  try {
    const data = await getTasks();
    return c.json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.get('/tasks/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId);
    if (error) {
      console.error('Error fetching task:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
    if (!data || data.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json(data[0]);
  } catch (error) {
    console.error('Unexpected error fetching task:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.put('/tasks/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  const body = await c.req.json();
  if (!body.task_name || !body.cleaning_interval || !body.last_cleaned) {
    return c.json({ error: 'Missing required fields' }, 400);
  }
  const lastcleanDate = new Date(body.last_cleaned);
  lastcleanDate.setDate(lastcleanDate.getDate() + Number(body.cleaning_interval));
  const nextcleanDate = lastcleanDate.toISOString().split('T')[0];
  const currentDate = new Date();
  console.log(body.last_cleaned);
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        task_name: body.task_name,
        cleaning_interval: body.cleaning_interval,
        last_cleaned: body.last_cleaned,
        next_clean: nextcleanDate,
        updated_at: currentDate,
      })
      .eq('id', taskId)
      .select();
    if (error) {
      console.error('Error updating task:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
    if (!data || data.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }
    console.log('Task updated:', data);
    return c.json(data[0]);
  } catch (error) {
    console.error('Unexpected error updating task:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.delete('/tasks/:taskId', async (c) => {
  const taskId = c.req.param('taskId');
  try {
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .select();
    if (error) {
      console.error('Error deleting task:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
    if (!data || data.length === 0) {
      return c.json({ error: 'Task not found' }, 404);
    }
    console.log('Task deleted:', data);
    return c.json(data[0]);
  } catch (error) {
    console.error('Unexpected error deleting task:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.get('/:userId', async (c) => {
  const userId = c.req.param('userId');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);
    if (error) {
      console.error('Error fetching user:', error);
      return c.json({ error: 'Internal Server Error' }, 500);
    }
    if (!data || data.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(data[0]);
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

app.delete('/:userId', async (c) => {
  const userId = c.req.param('userId');
  const { error } = await supabase.rpc('delete_user_and_tasks', { uid: userId });

  if (error) {
    console.error('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  } else {
    console.log('User deleted successfully');
    return c.json({ message: 'User deleted successfully' }, 200);
  }
});

serve({
    fetch: app.fetch,
    port: 3000,
  });
