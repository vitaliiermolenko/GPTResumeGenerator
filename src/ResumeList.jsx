// ResumeList.jsx

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

function ResumeList() {
  // стан для збереження списку резюме
  const [resumes, setResumes] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  // завантажуємо збережені резюме з локального сховища при завантаженні компонента
  useEffect(() => {
    const savedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
    setResumes(savedResumes);

    // якщо є якір у URL, скролимо до нього
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // обробник видалення резюме
  const handleDelete = (id) => {
    const updatedResumes = resumes.filter((resume) => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
  };

  // перемикання стану згортання/розгортання резюме
  const toggleCollapse = (id) => {
    const element = document.getElementById(`resume-${id}`);
    if (collapsed[id]) {
      expandElement(element);
    } else {
      collapseElement(element);
    }
    setCollapsed((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // функція для згортання елемента
  const collapseElement = (element) => {
    const sectionHeight = element.scrollHeight;
    const elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(() => {
      element.style.height = `${sectionHeight}px`;
      element.style.transition = elementTransition;
      requestAnimationFrame(() => {
        element.style.height = '150px';
      });
    });
  };

  // функція для розгортання елемента
  const expandElement = (element) => {
    const sectionHeight = element.scrollHeight;
    element.style.height = `${sectionHeight}px`;
    element.addEventListener('transitionend', function handler() {
      element.removeEventListener('transitionend', handler);
      element.style.height = null;
    });
  };

  // обробник редагування резюме
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="ResumeList">
      <div className='resumeGeneral-list'>
        <div className='resume-title'>
          <h1 className="ResumeList-title">Saved Resumes</h1>
          <button onClick={() => navigate('/')} className="ResumeList-link-button">Back to Resume Generator</button>
        </div>
        {resumes.length === 0 ? (
          <p>No resumes saved yet.</p>
        ) : (
          <div className="resume-list">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-item" id={`resume-${resume.id}`}>
              <pre className="ResumeList-pre">{resume.resume}</pre>
              <div className="resume-actions">
                <button onClick={() => toggleCollapse(resume.id)} className="ResumeList-button">
                  {collapsed[resume.id] ? 'Expand' : 'Collapse'}
                </button>
                <button onClick={() => handleEdit(resume.id)} className="ResumeList-button">Edit</button>
                <button onClick={() => handleDelete(resume.id)} className="ResumeListDelete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

export default ResumeList;
