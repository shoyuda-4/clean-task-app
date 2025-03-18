import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TaskPage from './components/TaskPage';
import TaskEditPage from './components/TaskEditPage';
import UserProfilePage from './components/UserProfilePage';
import TaskCreatePage from './components/TaskCreatePage';
import TopPage from './components/TopPage';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/tasks" element={<TaskPage />} />
        <Route path="/tasks/edit/:taskId" element={<TaskEditPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/tasks/create" element={<TaskCreatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
