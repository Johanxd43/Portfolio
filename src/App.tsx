import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot/ChatBot';
import Home from './pages/Home';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Resume from './pages/Resume';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <div className="relative z-50">
          <ChatBot />
        </div>
      </div>
    </Router>
  );
}

export default App;