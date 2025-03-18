import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // タスクデータを取得（仮のデータ）
    const fetchedTasks = [
      { id: 1, taskName: '掃除機かけ', status: '未完了' },
      { id: 2, taskName: '皿洗い', status: '完了' },
    ];
    setTasks(fetchedTasks);
  }, []);

  const handleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: '完了' } : task
      )
    );
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <div>
      <h1>Your Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.taskName} - {task.status}
            <button onClick={() => handleComplete(task.id)}>Complete</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
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
