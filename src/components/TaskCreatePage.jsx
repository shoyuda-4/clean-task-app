import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskCreatePage({user}) {
  const [taskName, setTaskName] = useState('');
  const [cleaningInterval, setCleaningInterval] = useState(7);
  const [lastClean, setLastClean] = useState('');
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

  const handleCreateTask = async (e) => {
    e.preventDefault();
  
    const response = await fetch('http://localhost:3000/tasks/create', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_name: taskName,
        last_cleaned: lastClean,
        cleaning_interval: cleaningInterval,
        user_id: user.id,
      }),
    });

    const data = await response.json();

    // タスク作成後、タスクページにリダイレクト
    if (response.ok) {
      console.log('Task created:', data.task);
      
      navigate('/tasks');
    } else {
      console.error('Error creating task:', data.error);
    }
  };

  return (
    <div>
      <h1>Create New Task</h1>
      <div>
        <label>Task Name:</label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          required
        />
      </div>
      <div>
        <label>Cleaning Interval (days):</label>
        <input
          type="number"
          value={cleaningInterval}
          onChange={(e) => setCleaningInterval(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Last Cleaning Date:</label>
        <input
          type="date"
          value={lastClean}
          onChange={(e) => setLastClean(e.target.value)}
          required
          max={currentDate}
        />
      </div>
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
}

export default TaskCreatePage;
