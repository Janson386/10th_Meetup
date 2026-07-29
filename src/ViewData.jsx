import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbx02fgz845sd63keuF3lemNOnk6YlTRqdLaFW__1k2X_XbF4uSUq5BMOuRU3gzwcb4gZA/exec';
        
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
  }, []);

  return (
    <div className="view-data-page" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text-main)', padding: '40px 20px' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '28px' }}>Registration Data</h1>
          <button className="btn" style={{ border: '1px solid var(--color-text-muted)' }} onClick={() => navigate('/home')}>Back to Home</button>
        </div>

        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && data.length === 0 && <p>No registrations found.</p>}

        {!loading && !error && data.length > 0 && (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-primary)', color: 'var(--color-secondary)' }}>
                  {Object.keys(data[0]).map((key, i) => (
                    <th key={i} style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{val?.toString()}</td>
                    ))}
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
