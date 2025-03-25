import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('http://localhost:3000/tasks');
      const data = await response.json();
      const modifiedData = data.map(task => ({
        ...task,
        last_cleaned: task.last_cleaned.split('T')[0],
        next_clean: task.next_clean.split('T')[0], 
      }));
      setTasks(modifiedData);
    }
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Your Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task_name} - {task.last_cleaned} - {task.next_clean}
            <br />
            Cleaning Interval: {task.cleaning_interval} days
            <br />
            <button onClick={() => navigate(`/tasks/edit/${task.id}`)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskPage;
