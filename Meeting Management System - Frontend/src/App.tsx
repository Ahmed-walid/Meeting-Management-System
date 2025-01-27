import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodayMeetings from './pages/TodayMeetings';
import ScheduledMeetings from './pages/ScheduledMeetings';
import CompletedMeetings from './pages/CompletedMeetings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100" dir="rtl">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="/" element={<TodayMeetings />} />
            <Route path="/scheduled" element={<ScheduledMeetings />} />
            <Route path="/completed" element={<CompletedMeetings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;