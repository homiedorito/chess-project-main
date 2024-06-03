import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Main from './Main'; // Import your Main component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} /> {/* Define the route for Main */}
      </Routes>
    </Router>
  );
}

export default App;
