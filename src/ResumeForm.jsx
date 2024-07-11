// ResumeForm.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

const API_KEY = "Your_GPT_API";

function ResumeForm() {
  // стан для збереження даних форми
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    skills: ''
  });

  // стан для збереження тексту резюме
  const [resume, setResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const textareaRefs = useRef({
    experience: null,
    education: null,
    skills: null,
    resume: null
  });

  // встановлюємо фокус на textarea, якщо резюме вже згенеровано
  useEffect(() => {
    if (resume && isEditing) {
      textareaRefs.current.resume.focus();
    }
  }, [resume, isEditing]);

  // автоматично змінюємо розмір textarea при зміні резюме
  useEffect(() => {
    Object.values(textareaRefs.current).forEach(autoResizeTextarea);
  }, [resume]);

  // функція для автоматичного зміни розміру textarea
  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // обробник зміни полів форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (textareaRefs.current[name]) {
      autoResizeTextarea(textareaRefs.current[name]);
    }
  };

  // обробник зміни тексту резюме
  const handleResumeChange = (e) => {
    setResume(e.target.value);
    autoResizeTextarea(textareaRefs.current.resume);
  };

  // обробник відправки форми для генерації резюме
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "Generate a professional resume based on the following information." },
        { "role": "user", "content": JSON.stringify(formData) }
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
    .then((response) => response.json())
    .then((data) => {
      const generatedResume = data.choices[0].message.content;
      setResume(generatedResume);
      setIsLoading(false);
      setIsEditing(true);
    });
  };

  // обробник збереження резюме
  const handleSave = () => {
    const savedResumes = JSON.parse(localStorage.getItem('resumes')) || [];
    const newResume = { id: Date.now(), resume };
    savedResumes.push(newResume);
    localStorage.setItem('resumes', JSON.stringify(savedResumes));
    navigate(`/resumes#resume-${newResume.id}`);
  };

  // обробник регенерації резюме
  const handleRegenerate = async () => {
    setIsLoading(true);
    setResume('');
    setIsEditing(false);

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "Generate a professional resume based on the following information." },
        { "role": "user", "content": JSON.stringify(formData) }
      ]
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
    .then((response) => response.json())
    .then((data) => {
      const generatedResume = data.choices[0].message.content;
      setResume(generatedResume);
      setIsLoading(false);
    });
  };

  // обробник видалення резюме
  const handleDelete = () => {
    setResume('');
    setIsLoading(false);
    setIsEditing(true);
  };

  return (
    <div className="App ResumeForm">
      {!resume || !isEditing ? (
        <form className="resume-form" onSubmit={handleSubmit}>
          <div className='resume-title'>
            <h1 className="ResumeForm-title">Resume Generator</h1>
            <button onClick={() => navigate('/resumes')} className="ResumeForm-link-button">View Saved Resumes</button>
          </div>
          <div className='resume-labels'>
            <label className="ResumeForm-label">
              First Name:
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </label>
            <label className="ResumeForm-label">
              Last Name:
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </label>
            <label className="ResumeForm-label">
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
            <label className="ResumeForm-label">
              Phone:
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </label>
            <label className="ResumeForm-label">
              Experience:
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                ref={(el) => (textareaRefs.current.experience = el)}
                required
              ></textarea>
            </label>
            <label className="ResumeForm-label">
              Education:
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                ref={(el) => (textareaRefs.current.education = el)}
                required
              ></textarea>
            </label>
            <label className="ResumeForm-label">
              Skills:
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                ref={(el) => (textareaRefs.current.skills = el)}
                required
              ></textarea>
            </label>
          </div>
          <button type="submit" className="ResumeForm-button">Generate Resume</button>
        </form>
      ) : (
        <div className="resume-output">
          <h2 className="ResumeForm-subtitle">Generated Resume:</h2>
          <textarea
            ref={(el) => (textareaRefs.current.resume = el)}
            id="editable-resume"
            name="resume"
            value={resume}
            onChange={handleResumeChange}
            readOnly={!isEditing}
            required
            autoFocus={isEditing}
          ></textarea>
          <div className="resume-actions">
            <button onClick={handleSave} className="ResumeForm-button">Save</button>
            <button onClick={handleRegenerate} className="ResumeForm-button">Regenerate</button>
            <button onClick={handleDelete} className="ResumeForm-button">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeForm;
