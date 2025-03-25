import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskEditPage() {
  const { taskId } = useParams();
  const [taskName, setTaskName] = useState('');
  const [lastClean, setLastClean] = useState('');
  const [cleaningInterval, setCleaningInterval] = useState(0);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!taskId) {
      console.warn("taskId が undefined なので API を呼びません");
      return;
    }
    async function fetchTask() {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
      const data = await response.json();
      const lastCleanDate = new Date(data.last_cleaned);
      const lastCleanDateStr = lastCleanDate.toISOString().split('T')[0];
      setTaskName(data.task_name);
      setCleaningInterval(data.cleaning_interval);
      setLastClean(lastCleanDateStr);
    }
    fetchTask();
  }, [taskId]);

  const handleSave = async () => {
    console.log('Saving task:', taskName, cleaningInterval);
    // タスク保存後、タスクページに戻る
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_name: taskName,
        cleaning_interval: cleaningInterval,
        last_cleaned: lastClean,
      }),
    });
    const data = await response.json();
    console.log('Task saved:', data);
    if(response.ok){
      console.log('Task saved:', data);
      navigate('/tasks');
    }
    else {
      console.error('Error saving task:', data.error);
    }

  };

  return (
    <div>
      <h1>Edit Task</h1>
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
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default TaskEditPage;
