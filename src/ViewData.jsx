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
  const [processingId, setProcessingId] = useState(null);
  
  // Filters
  const [filterFood, setFilterFood] = useState('All');
  const [filterPhotoFrame, setFilterPhotoFrame] = useState('All');
  const [filterFamily, setFilterFamily] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [selectedRow, setSelectedRow] = useState(null);

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
    
    setProcessingId('delete-' + timestamp);
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
      setProcessingId(null);
    }
  };

  const handleUpdatePayment = async (timestamp) => {
    if (!window.confirm('Are you sure you want to mark this payment as Received?')) return;
    
    setProcessingId('payment-' + timestamp);
    try {
      const res = await fetch(`${scriptURL}?action=updatePayment&timestamp=${encodeURIComponent(timestamp)}`);
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      
      if (json.success) {
        const newData = data.map(row => {
          if (row.Timestamp === timestamp) {
            return { ...row, 'Payment Status': 'Received' };
          }
          return row;
        });
        setData(newData);
        localStorage.setItem('reunionData', JSON.stringify(newData));
      } else {
        alert('Failed to update payment: ' + (json.error || 'Unknown error'));
      }
    } catch (e) {
      console.error('Error updating payment:', e);
      alert('Error connecting to the server to update payment.');
    } finally {
      setProcessingId(null);
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

  // Apply filters
  const filteredData = data.filter(row => {
    if (filterFood !== 'All' && row['Food Preference'] !== filterFood) return false;
    if (filterPhotoFrame !== 'All' && row['Photo Frame'] !== filterPhotoFrame) return false;
    if (filterPayment !== 'All' && row['Payment Status'] !== filterPayment) return false;
    
    if (filterFamily === 'With Family') {
      const adults = parseInt(row.Adults) || 0;
      const children = parseInt(row.Children) || 0;
      if (adults === 0 && children === 0) return false;
    } else if (filterFamily === 'Without Family') {
      const adults = parseInt(row.Adults) || 0;
      const children = parseInt(row.Children) || 0;
      if (adults > 0 || children > 0) return false;
    }
    
    return true;
  });

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
      <div className="container" style={{ maxWidth: '1400px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '28px', margin: 0 }}>Registration Data</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ padding: '8px 16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '14px' }}>
              Role: <strong>{role === 'admin' ? 'Admin' : 'Viewer'}</strong>
            </span>
            <button className="btn" style={{ border: '1px solid var(--color-text-muted)', padding: '8px 16px' }} onClick={() => { localStorage.removeItem('userRole'); setRole(null); }}>Logout</button>
            <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => navigate('/home')}>Back to Home</button>
          </div>
        </div>
        
        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', backgroundColor: 'var(--color-surface)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Food Preference</label>
            <select className="form-control" value={filterFood} onChange={e => setFilterFood(e.target.value)}>
              <option value="All">All</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Photo Frame</label>
            <select className="form-control" value={filterPhotoFrame} onChange={e => setFilterPhotoFrame(e.target.value)}>
              <option value="All">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Family Status</label>
            <select className="form-control" value={filterFamily} onChange={e => setFilterFamily(e.target.value)}>
              <option value="All">All</option>
              <option value="With Family">With Family</option>
              <option value="Without Family">Without Family</option>
            </select>
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Payment Status</label>
            <select className="form-control" value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Received">Received</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="spinner"></div>
            <span style={{ marginLeft: '12px' }}>Fetching latest data...</span>
          </div>
        )}
        
        {/* If we have cached data but are also loading the fresh data in background */}
        {!loading && data.length > 0 && <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: '-15px' }}>Live updating...</p>}
        
        {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        
        {!loading && !error && filteredData.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: '8px' }}>
            <p>No registrations found matching your filters.</p>
          </div>
        )}

        {filteredData.length > 0 && (
          <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-primary)', color: 'var(--color-secondary)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  {Object.keys(filteredData[0]).map((key, i) => (
                    <th key={i} style={{ padding: '16px 12px', whiteSpace: 'nowrap' }}>{key === 'Timestamp' ? 'Sl. No.' : key}</th>
                  ))}
                  {role === 'admin' && <th style={{ padding: '16px 12px', whiteSpace: 'nowrap', textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, i) => (
                  <tr 
                    key={i} 
                    onClick={() => setSelectedRow(i)}
                    style={{ 
                      borderBottom: '1px solid rgba(255,255,255,0.05)', 
                      backgroundColor: selectedRow === i ? 'rgba(255, 255, 255, 0.1)' : (i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'),
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    {Object.entries(row).map(([key, val], j) => (
                      <td key={j} style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        {key === 'Timestamp' ? (
                          i + 1
                        ) : key === 'Payment Status' ? (
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            backgroundColor: val === 'Received' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(241, 196, 15, 0.2)',
                            color: val === 'Received' ? '#2ecc71' : '#f1c40f'
                          }}>
                            {val}
                          </span>
                        ) : (
                          val?.toString()
                        )}
                      </td>
                    ))}
                    {role === 'admin' && (
                      <td style={{ padding: '12px', whiteSpace: 'nowrap', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {row['Payment Status'] === 'Pending' && (
                            <button 
                              onClick={() => handleUpdatePayment(row.Timestamp)}
                              disabled={processingId === 'payment-' + row.Timestamp}
                              style={{ 
                                padding: '6px 12px', 
                                backgroundColor: '#2ecc71', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: processingId === 'payment-' + row.Timestamp ? 'not-allowed' : 'pointer',
                                opacity: processingId === 'payment-' + row.Timestamp ? 0.5 : 1,
                                fontWeight: '600',
                                fontSize: '12px'
                              }}
                            >
                              {processingId === 'payment-' + row.Timestamp ? '...' : 'Mark Paid'}
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(row.Timestamp)}
                            disabled={processingId === 'delete-' + row.Timestamp}
                            style={{ 
                              padding: '6px 12px', 
                              backgroundColor: '#e74c3c', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '4px', 
                              cursor: processingId === 'delete-' + row.Timestamp ? 'not-allowed' : 'pointer',
                              opacity: processingId === 'delete-' + row.Timestamp ? 0.5 : 1,
                              fontWeight: '600',
                              fontSize: '12px'
                            }}
                          >
                            {processingId === 'delete-' + row.Timestamp ? '...' : 'Delete'}
                          </button>
                        </div>
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
