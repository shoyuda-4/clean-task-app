import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskEditPage() {
  const { taskId } = useParams();
  const [taskName, setTaskName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 実際にはAPIからタスクを取得する必要があります
    const fetchedTask = { id: taskId, taskName: '掃除機かけ' }; // 仮データ
    setTaskName(fetchedTask.taskName);
  }, [taskId]);

  const handleSave = () => {
    console.log('Saving task:', taskName);
    // タスク保存後、タスクページに戻る
    navigate('/tasks');
  };

  return (
    <div>
      <h1>Edit Task</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default TaskEditPage;
