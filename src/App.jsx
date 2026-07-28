import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';
import WelcomeGate from './WelcomeGate';
import MainInvitation from './MainInvitation';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomeGate />} />
          <Route path="/home" element={<MainInvitation />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
