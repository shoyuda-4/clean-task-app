import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TaskCreatePage() {
  const [taskName, setTaskName] = useState('');
  const [cleaningInterval, setCleaningInterval] = useState(7);
  const [nextClean, setNextClean] = useState('');
  const navigate = useNavigate();

  const handleCreateTask = () => {
    // 実際のデータベースにタスクを追加する処理を行います。
    // 仮にコンソールに出力しています。
    console.log('Creating task:', { taskName, cleaningInterval, nextClean });
    // タスク作成後、タスクページにリダイレクト
    navigate('/tasks');
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
        />
      </div>
      <div>
        <label>Cleaning Interval (days):</label>
        <input
          type="number"
          value={cleaningInterval}
          onChange={(e) => setCleaningInterval(e.target.value)}
        />
      </div>
      <div>
        <label>Next Cleaning Date:</label>
        <input
          type="date"
          value={nextClean}
          onChange={(e) => setNextClean(e.target.value)}
        />
      </div>
      <button onClick={handleCreateTask}>Create Task</button>
    </div>
  );
}

export default TaskCreatePage;
