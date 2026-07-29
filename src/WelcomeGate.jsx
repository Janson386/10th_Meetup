import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from './AppContext';

const WelcomeGate = () => {
  const { formData, updateFormData, t, language, setLanguage } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.gender || !formData.phone) {
      setError(t('fillAllDetails'));
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError(t('invalidPhone'));
      return;
    }

    setError('');
    navigate('/home');
  };

  return (
    <div className="welcome-gate animate-fade-in">
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="form-control"
          style={{ padding: '8px 12px', width: 'auto' }}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="ml">മലയാളം (Malayalam)</option>
        </select>
      </div>
      <div className="welcome-card">
        <h1 style={{ marginBottom: '16px', fontSize: '32px' }}>
          <Link to="/view-data" style={{ color: 'inherit', textDecoration: 'none' }}>10</Link>
          {t('welcomeHeading').substring(2)}
        </h1>
        <p style={{ marginBottom: '32px', color: 'var(--color-text-muted)' }}>
          {t('welcomeSubheading')}
        </p>

        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">{t('fullName')}</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder={t('enterName')}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('gender')}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={(e) => updateFormData({ gender: e.target.value })} /> {t('male')}
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={(e) => updateFormData({ gender: e.target.value })} /> {t('female')}
              </label>
              <label className="radio-label">
                <input type="radio" name="gender" value="Prefer not to say" checked={formData.gender === 'Prefer not to say'} onChange={(e) => updateFormData({ gender: e.target.value })} /> {t('preferNotToSay')}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('phoneNumber')}</label>
            <input 
              type="tel" 
              className="form-control"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder={t('enterPhone')}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            {t('continueToReunion')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeGate;
