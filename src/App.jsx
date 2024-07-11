// App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResumeForm from './ResumeForm';
import ResumeList from './ResumeList';
import EditResume from './EditResume';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ResumeForm />} />
        <Route path="/resumes" element={<ResumeList />} />
        <Route path="/edit/:id" element={<EditResume />} />
      </Routes>
    </Router>
  );
}

export default App;
