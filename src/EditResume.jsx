// EditResume.jsx

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function EditResume() {
  // отримуємо ID резюме з параметрів URL
  const { id } = useParams();
  const navigate = useNavigate();
  // стан для збереження тексту резюме
  const [resume, setResume] = useState('');
  // референс для textarea
  const textareaRef = useRef(null);

  // завантажуємо резюме з локального сховища при завантаженні компонента
  useEffect(() => {
    const savedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
    const resumeToEdit = savedResumes.find((resume) => resume.id === parseInt(id));
    if (resumeToEdit) {
      setResume(resumeToEdit.resume);
    }
  }, [id]);

  // автоматично змінюємо розмір textarea при зміні резюме
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [resume]);

  // функція для автоматичного зміни розміру textarea
  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // обробник зміни тексту резюме
  const handleChange = (e) => {
    setResume(e.target.value);
    autoResizeTextarea(textareaRef.current);
  };

  // обробник збереження змін
  const handleSubmit = (e) => {
    e.preventDefault();
    const savedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
    const updatedResumes = savedResumes.map((r) =>
      r.id === parseInt(id) ? { ...r, resume } : r
    );
    localStorage.setItem('resumes', JSON.stringify(updatedResumes));
    navigate(`/resumes#resume-${id}`);
  };

  // обробник скасування редагування
  const handleCancel = () => {
    navigate('/resumes');
  };

  return (
    <div className="App EditResume">
      <form className="edit-resume-form" onSubmit={handleSubmit}>
        <h1 className="EditResume-title">Edit Resume</h1>
        <textarea
          ref={textareaRef}
          name="resume"
          value={resume}
          onChange={handleChange}
          required
        ></textarea>
        <div className="edit-resume-formButton">
          <button type="submit" className="EditResume-button">Save Changes</button>
          <button type="button" onClick={handleCancel} className="EditResume-button">Cancel Editing</button>
        </div>
      </form>
    </div>
  );
}

export default EditResume;
