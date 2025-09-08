import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CandidateForm from './components/CandidateForm';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <Router>
      <div style={{fontFamily: 'system-ui, sans-serif', padding: 20, background: '#f3f4f6', minHeight: '100vh'}}>
        <div style={{maxWidth: 1100, margin: '0 auto'}}>
          <Routes>
            <Route path='/' element={<CandidateForm />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/admin/panel' element={<AdminPanel />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
