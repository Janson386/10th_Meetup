import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const [role, setRole] = useState(() => localStorage.getItem('userRole') || null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem('reunionData');
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(!localStorage.getItem('reunionData'));
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const scriptURL = 'https://script.google.com/macros/s/AKfycbx02fgz845sd63keuF3lemNOnk6YlTRqdLaFW__1k2X_XbF4uSUq5BMOuRU3gzwcb4gZA/exec';

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'user123') { 
      setRole('user');
      localStorage.setItem('userRole', 'user');
    } else if (password === '254800') {
      setRole('admin');
      localStorage.setItem('userRole', 'admin');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handleDelete = async (timestamp) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    
    setDeletingId(timestamp);
    try {
      const res = await fetch(`${scriptURL}?action=delete&timestamp=${encodeURIComponent(timestamp)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      
      if (json.success) {
        const newData = data.filter(row => row.Timestamp !== timestamp);
        setData(newData);
        localStorage.setItem('reunionData', JSON.stringify(newData));
      } else {
        alert('Failed to delete row: ' + (json.error || 'Unknown error'));
      }
    } catch (e) {
      console.error('Error deleting data:', e);
      alert('Error connecting to the server to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!role) return;
    
    const fetchData = async () => {
      try {
        if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
          setError('Please update your Google Apps Script URL to fetch data.');
          setLoading(false);
          return;
        }

        const res = await fetch(`${scriptURL}?action=getData`);
        if (!res.ok) throw new Error('Network response was not ok');
        const json = await res.json();
        
        if (Array.isArray(json)) {
          setData(json);
          localStorage.setItem('reunionData', JSON.stringify(json));
        } else {
          throw new Error('Data format error');
        }
      } catch (e) {
        console.error('Error fetching data:', e);
        setError('Failed to fetch data. Ensure your Apps Script is updated to handle action=getData.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [role]);

  if (!role) {
    return (
      <div className="view-data-page" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '32px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', maxWidth: '400px', width: '100%' }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '24px', textAlign: 'center' }}>Access Data</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter Password"
              style={{ marginBottom: '16px', width: '100%' }}
            />
            {passwordError && <p style={{ color: '#ff6b6b', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>{passwordError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
            <button type="button" className="btn" style={{ width: '100%', marginTop: '12px', border: '1px solid var(--color-text-muted)' }} onClick={() => navigate('/home')}>Back to Home</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="view-data-page" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '28px' }}>Registration Data</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '14px' }}>
              Role: <strong>{role === 'admin' ? 'Admin' : 'Viewer'}</strong>
            </span>
            <button className="btn" style={{ border: '1px solid var(--color-text-muted)' }} onClick={() => navigate('/home')}>Back to Home</button>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <span style={{ marginLeft: '12px' }}>Fetching latest data...</span>
          </div>
        )}
        
        {/* If we have cached data but are also loading the fresh data in background */}
        {!loading && data.length > 0 && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '-15px' }}>Live updating...</p>}
        
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        
        {!loading && !error && data.length === 0 && <p>No registrations found.</p>}

        {!loading && !error && data.length > 0 && (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-primary)', color: 'var(--color-secondary)' }}>
                  {Object.keys(data[0]).map((key, i) => (
                    <th key={i} style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{key}</th>
                  ))}
                  {role === 'admin' && <th style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{val?.toString()}</td>
                    ))}
                    {role === 'admin' && (
                      <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>
                        <button 
                          onClick={() => handleDelete(row.Timestamp)}
                          disabled={deletingId === row.Timestamp}
                          style={{ 
                            padding: '4px 8px', 
                            backgroundColor: '#ff4d4f', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: deletingId === row.Timestamp ? 'not-allowed' : 'pointer',
                            opacity: deletingId === row.Timestamp ? 0.5 : 1
                          }}
                        >
                          {deletingId === row.Timestamp ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewData;
