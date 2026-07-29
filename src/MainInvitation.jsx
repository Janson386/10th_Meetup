import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { t, language, setLanguage } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container d-flex justify-between align-center">
        <h2 style={{ fontSize: '22px', margin: 0, fontWeight: '700', color: 'var(--color-primary)' }}>10th Batch Reunion</h2>
        <div className="d-flex align-center gap-2">
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><a href="#hero" onClick={() => setMenuOpen(false)}>{t('navHome')}</a></li>
            <li><a href="#guests" onClick={() => setMenuOpen(false)}>{t('navGuests')}</a></li>
            <li><a href="#schedule" onClick={() => setMenuOpen(false)}>{t('navSchedule')}</a></li>
            <li><a href="#food" onClick={() => setMenuOpen(false)}>{t('navFood')}</a></li>
            <li><a href="#register" onClick={() => setMenuOpen(false)}>{t('navRegister')}</a></li>
          </ul>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="form-control"
            style={{ padding: '6px 10px', width: 'auto', minWidth: '80px', height: '36px', marginLeft: '16px' }}
          >
            <option value="en">EN</option>
            <option value="ta">TA</option>
            <option value="ml">ML</option>
          </select>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { formData, t } = useAppContext();
  
  const calculateTimeLeft = () => {
    const targetDate = new Date('2026-08-27T08:30:00').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="hero-section text-center onam-pattern">
      <div className="container">
        <h1 className="animate-fade-in" style={{ fontSize: '48px', marginBottom: '24px' }}>{t('dear')} {formData.name || t('friend')},</h1>
        <p className="animate-fade-in delay-100" style={{ fontSize: '24px', maxWidth: '800px', margin: '0 auto 24px', fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)' }}>
          {t('heroGreeting1')}
        </p>
        <p className="animate-fade-in delay-200" style={{ fontSize: '18px', maxWidth: '800px', margin: '0 auto 40px', color: 'var(--color-text-muted)' }}>
          {t('heroGreeting2')}
        </p>
        <div className="animate-fade-in delay-200" style={{ marginBottom: '40px' }}>
          <p style={{ margin: '8px 0', fontSize: '18px' }}><strong>{t('date')}:</strong> {t('comingSoon')}</p>
          <p style={{ margin: '8px 0', fontSize: '18px' }}><strong>{t('time')}:</strong> 8:30 AM {t('onwards')}</p>
          <p style={{ margin: '8px 0', fontSize: '18px' }}><strong>{t('venue')}:</strong> {t('toBeAnnounced')}</p>
        </div>
        <div className="animate-fade-in delay-300 d-flex gap-3 justify-center" style={{ marginBottom: '40px' }}>
          <div className="card" style={{ padding: '16px 24px' }}>
            <h3 style={{ fontSize: '32px', margin: 0 }}>{timeLeft.days}</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>{t('days')}</p>
          </div>
          <div className="card" style={{ padding: '16px 24px' }}>
            <h3 style={{ fontSize: '32px', margin: 0 }}>{timeLeft.hours}</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>{t('hours')}</p>
          </div>
          <div className="card" style={{ padding: '16px 24px' }}>
            <h3 style={{ fontSize: '32px', margin: 0 }}>{timeLeft.minutes}</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>{t('mins')}</p>
          </div>
        </div>
        <a href="#register" className="btn btn-primary animate-fade-in delay-400" style={{ fontSize: '20px', padding: '16px 40px' }}>
          {t('joinReunion')}
        </a>
      </div>
    </section>
  );
};

const Guests = () => {
  const { t } = useAppContext();
  return (
    <section id="guests" className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <h2>{t('specialGuests')}</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{t('specialGuestsSub')}</p>
        </div>
        <div className="d-flex gap-4 flex-wrap justify-center">
          {[1, 2, 3].map((id) => (
            <div key={id} className="card text-center" style={{ width: '280px' }}>
              <div style={{ 
                width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eee', 
                margin: '0 auto 16px', border: '4px solid var(--color-primary)',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '64px', height: '64px', color: '#ccc' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h4>{t('teacherName')}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Schedule = () => {
  const { t } = useAppContext();
  return (
    <section id="schedule" className="section onam-pattern">
      <div className="container">
        <h2 className="text-center" style={{ marginBottom: '48px' }}>{t('eventSchedule')}</h2>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>8:30 AM</h4>
              <h3>📝 {t('welcomeReg')}</h3>
              <p>{t('welcomeRegDesc')}</p>
            </div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>9:00 AM</h4>
              <h3>🎤 {t('welcomeSpeech')}</h3>
              <p>{t('welcomeSpeechDesc')}</p>
            </div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>9:30 AM</h4>
              <h3>📸 {t('groupPhoto')}</h3>
              <p>{t('groupPhotoDesc')}</p>
            </div>
          </div>
          
          <div className="timeline-item full-width" style={{ width: '100%', left: 0, textAlign: 'center' }}>
            <div style={{ position: 'relative', zIndex: 2, backgroundColor: 'var(--color-background)', display: 'inline-block', padding: '0 16px' }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>9:45 AM - 🎭 {t('parallelActivities')}</h4>
            </div>
            <div className="parallel-events">
              <div className="timeline-content" style={{ borderTop: '4px solid var(--color-secondary)' }}>
                <h3>🎶 {t('teacherGirlsActivities')}</h3>
                <p>{t('teacherGirlsActivitiesDesc')}</p>
              </div>
              <div className="timeline-content" style={{ borderTop: '4px solid var(--color-accent)' }}>
                <h3>🎈 {t('kidsActivities')}</h3>
                <p>{t('kidsActivitiesDesc')}</p>
              </div>
            </div>
          </div>
          
          <div className="timeline-item right">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>12:30 PM</h4>
              <h3>🍽️ {t('lunch')}</h3>
              <p>{t('lunchDesc')}</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>2:00 PM</h4>
              <h3>🎯 {t('boysFamilyActivities')}</h3>
              <p>{t('boysFamilyActivitiesDesc')}</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>3:00 PM</h4>
              <h3>🎁 {t('giftDistribution')}</h3>
              <p>{t('giftDistributionDesc')}</p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-content">
              <h4 style={{ color: 'var(--color-primary)' }}>3:30 PM</h4>
              <h3>☕ {t('highTea')}</h3>
              <p>{t('highTeaDesc')}</p>
            </div>
          </div>
        </div>
        <p className="text-center" style={{ marginTop: '40px', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
          {t('tentative')}
        </p>
      </div>
    </section>
  );
};

const Registration = () => {
  const { formData, updateFormData, t } = useAppContext();
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const baseFee = 300; // Only main person is charged
  const totalFee = baseFee; // Photo frame amount will be decided later

  const handleAdults = (val) => {
    const newVal = formData.adults + val;
    if (newVal >= 0) updateFormData({ adults: newVal });
  };

  const handleChildren = (val) => {
    const newVal = formData.children + val;
    if (newVal >= 0) updateFormData({ children: newVal });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.foodPreference) {
      alert(t('pleaseSelectFood'));
      return;
    }
    setShowSummary(true);
  };

  const confirmAndSubmit = async () => {
    const registeredPhones = JSON.parse(localStorage.getItem('registeredPhones') || '[]');
    if (registeredPhones.includes(formData.phone)) {
      alert(t('alreadyRegistered'));
      setShowSummary(false);
      return;
    }

    setShowSummary(false);
    setSubmitting(true);
    
    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      totalAttendees: formData.adults + formData.children,
      registrationFee: totalFee,
      paymentStatus: 'Pending',
      registrationStatus: 'Confirmed'
    };

    try {
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwYE85dDqB4NLYJ074OWTdsdVqjGnsVVckx2ui9VvR3StmphJDgsRe71SEUAO2RcX4j/exec';
      
      if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        setTimeout(() => {
          registeredPhones.push(formData.phone);
          localStorage.setItem('registeredPhones', JSON.stringify(registeredPhones));
          setSubmitting(false);
          setShowSuccess(true);
        }, 1500);
      } else {
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          }
        });
        
        // When using 'no-cors', the response is opaque so we can't read response.json().
        // If the fetch doesn't throw a network error, we assume it was sent successfully.
        registeredPhones.push(formData.phone);
        localStorage.setItem('registeredPhones', JSON.stringify(registeredPhones));
        setSubmitting(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
      alert('There was an error submitting your registration. Please try again.');
    }
  };

  const handleCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//10th Batch Reunion//EN
BEGIN:VEVENT
UID:reunion-10th-batch
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20260827T030000Z
DTEND:20260827T113000Z
SUMMARY:10th Batch Reunion
DESCRIPTION:Let's come together and celebrate!
LOCATION:St. Francis Xavier's High School, Parisakkal
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Reminder: 10th Batch Reunion in 1 hour!
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '10th_Batch_Reunion.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="register" className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h2 className="text-center" style={{ marginBottom: '16px' }}>{t('bookSlot')}</h2>
        <p className="text-center" style={{ marginBottom: '40px', color: 'var(--color-text-muted)' }}>
          {t('bookSlotDesc')}
        </p>

        <form onSubmit={submitForm} className="card">
          
          <div className="form-group" id="food">
            <label className="form-label">{t('foodPrefLabel')}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" checked={formData.foodPreference === 'Vegetarian'} onChange={() => updateFormData({ foodPreference: 'Vegetarian' })} /> {t('veg')}
              </label>
              <label className="radio-label">
                <input type="radio" checked={formData.foodPreference === 'Non-Vegetarian'} onChange={() => updateFormData({ foodPreference: 'Non-Vegetarian' })} /> {t('nonVeg')}
              </label>
            </div>
            {formData.foodPreference && (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--color-background)', borderRadius: '8px', border: '1px solid var(--color-surface)' }}>
                <p style={{ margin: '0 0 8px', fontWeight: '600', color: 'var(--color-secondary)' }}>
                  Menu ({formData.foodPreference}):
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--color-text-main)' }}>
                  {formData.foodPreference === 'Vegetarian' ? (
                    <>
                      <li>Vegetable Biriyani</li>
                      <li>Cauliflower Fry</li>
                      <li>Raitha</li>
                    </>
                  ) : (
                    <>
                      <li>Chicken Biriyani</li>
                      <li>Chicken Gravy</li>
                      <li>Raitha</li>
                    </>
                  )}
                </ul>
              </div>
            )}
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>{t('onamSpecialNote')}</p>
          </div>

          <div className="form-group">
            <label className="form-label">{t('photoFrameLabel')}</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" checked={formData.photoFrame === 'Yes'} onChange={() => updateFormData({ photoFrame: 'Yes' })} /> {t('yesFrame')}
              </label>
              <label className="radio-label">
                <input type="radio" checked={formData.photoFrame === 'No'} onChange={() => updateFormData({ photoFrame: 'No' })} /> {t('noFrame')}
              </label>
            </div>
          </div>

          {formData.photoFrame === 'Yes' && (
            <div style={{ padding: '16px', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
              <div className="form-group">
                <label className="form-label">{t('nameForFrame')}</label>
                <input type="text" className="form-control" required value={formData.photoFrameName} onChange={(e) => updateFormData({ photoFrameName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('phoneNumber')}</label>
                <input type="tel" className="form-control" required value={formData.photoFramePhone} onChange={(e) => updateFormData({ photoFramePhone: e.target.value })} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('address')}</label>
                <textarea className="form-control" required value={formData.photoFrameAddress} onChange={(e) => updateFormData({ photoFrameAddress: e.target.value })} rows="3"></textarea>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">{t('whoComingWith')}</label>
            <div className="d-flex justify-between align-center" style={{ marginBottom: '16px' }}>
              <span>{t('adults')}</span>
              <div className="counter-input">
                <button type="button" className="counter-btn" onClick={() => handleAdults(-1)}>-</button>
                <span className="counter-value">{formData.adults}</span>
                <button type="button" className="counter-btn" onClick={() => handleAdults(1)}>+</button>
              </div>
            </div>
            <div className="d-flex justify-between align-center">
              <span>{t('children')}</span>
              <div className="counter-input">
                <button type="button" className="counter-btn" onClick={() => handleChildren(-1)}>-</button>
                <span className="counter-value">{formData.children}</span>
                <button type="button" className="counter-btn" onClick={() => handleChildren(1)}>+</button>
              </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '15px', color: 'var(--color-secondary)', fontWeight: 500, backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ opacity: 0.8 }}>Person:</span>
                <span style={{ color: 'var(--color-primary)' }}>{formData.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ opacity: 0.8 }}>{t('summaryJoining')}:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '16px', borderLeft: '2px solid rgba(255, 255, 255, 0.1)', marginLeft: '8px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100px' }}>
                    <span style={{ opacity: 0.8 }}>Adult:</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formData.adults}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100px' }}>
                    <span style={{ opacity: 0.8 }}>Child:</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formData.children}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ padding: '20px', border: '2px dashed var(--color-primary)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '8px' }}>{t('paymentSection')}</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '8px' }}>{t('total')}{totalFee}</p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              {t('passInfo')}
            </p>
            <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', textAlign: 'left' }}>
              <p style={{ margin: '0 0 8px', fontWeight: '600' }}>{t('paymentDetails')}</p>
              <p style={{ margin: '0 0 4px' }}><strong>{t('paymentPhone')}</strong></p>
              <p style={{ margin: '0 0 8px' }}><strong>{t('paymentUpi')}</strong></p>
              <p style={{ margin: '0', fontSize: '13px', color: 'var(--color-primary)' }}>{t('shareScreenshot')}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="radio-label">
              <input type="checkbox" required />
              <span>{t('confirmInfo')}</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '18px' }} disabled={submitting}>
            {submitting ? t('processing') : t('confirmSlot')}
          </button>
        </form>
      </div>

      {showSuccess && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card text-center animate-fade-in" style={{ maxWidth: '500px', width: '90%', padding: '40px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>🎉 {t('youAreIn')}, {formData.name}!</h2>
            <p style={{ marginBottom: '24px' }}>
              {t('successMsg1')}
            </p>
            <p style={{ fontWeight: 'bold', color: 'var(--color-secondary)', marginBottom: '32px' }}>
              {t('withLove')},<br/>{t('reunionTeam')}
            </p>
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-primary" onClick={handleCalendar}>{t('addToCalendar')}</button>
              <button className="btn btn-secondary" onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: '10th Batch Reunion', url: window.location.href });
                } else {
                  alert('Share feature not supported on this browser.');
                }
              }}>{t('shareWithFriends')}</button>
              <button className="btn" style={{ border: '1px solid var(--color-text-muted)' }} onClick={() => setShowSuccess(false)}>{t('backToHome')}</button>
            </div>
          </div>
        </div>
      )}

      {showSummary && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card text-center animate-fade-in" style={{ maxWidth: '500px', width: '90%', padding: '40px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '24px', color: 'var(--color-primary)' }}>{t('summaryTitle')}</h2>
            
            <div style={{ textAlign: 'left', marginBottom: '32px', padding: '20px', backgroundColor: 'var(--color-background)', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 12px' }}><strong>{t('summaryFood')}:</strong> {formData.foodPreference === 'Vegetarian' ? t('veg') : t('nonVeg')}</p>
              <p style={{ margin: '0 0 12px' }}><strong>{t('summaryFrame')}:</strong> {formData.photoFrame === 'Yes' ? t('yes') : t('no')}</p>
              <p style={{ margin: '0' }}><strong>{t('summaryJoining')}:</strong> {formData.adults} {t('summaryAdults')}{formData.children > 0 ? `, ${formData.children} ${t('summaryChildren')}` : ''}</p>
            </div>

            <div className="d-flex flex-column gap-2">
              <button className="btn btn-primary" onClick={confirmAndSubmit}>{t('proceed')}</button>
              <button className="btn" style={{ border: '1px solid var(--color-text-muted)' }} onClick={() => setShowSummary(false)}>{t('editDetails')}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const Footer = () => {
  const { t } = useAppContext();
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-main)', padding: '60px 0 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '8px' }}>10th Batch Reunion</h2>
        <p style={{ fontStyle: 'italic', marginBottom: '32px', opacity: 0.8 }}>{t('foreverConnected')}</p>
        <p style={{ fontSize: '14px', opacity: 0.6 }}>© 2026 {t('allRightsReserved')}</p>
      </div>
    </footer>
  );
};

const MainInvitation = () => {
  const { formData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!formData.name) {
      navigate('/');
    }
  }, [formData.name, navigate]);

  if (!formData.name) return null;

  return (
    <div>
      <Navbar />
      <Hero />
      <Guests />
      <Schedule />
      <Registration />
      <Footer />
    </div>
  );
};

export default MainInvitation;
