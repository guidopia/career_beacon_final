import React, { useState } from 'react';
import { API_BASE_URL } from '../api/index.js';

function AdminPrepaid() {
  const [adminKey, setAdminKey] = useState('');
  const [file, setFile] = useState(null);
  const [moduleFilter, setModuleFilter] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    
    if (!file) {
      setMessage('Please choose a CSV file first.');
      return;
    }
    if (!adminKey) {
      setMessage('Please enter the Admin Key.');
      return;
    }
    
    setBusy(true);
    setMessage('Uploading CSV...');
    setResult(null);
    
    try {
      const form = new FormData();
      form.append('file', file);
      
      const uploadUrl = `${API_BASE_URL}/api/admin/prepaid/upload`;
      
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'x-admin-key': adminKey },
        body: form
      });
      
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || 'Upload failed');
      setResult(data);
      setMessage('CSV uploaded successfully.');
    } catch (e) {
      console.error('Upload error:', e);
      setMessage(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const handleRedeem = async () => {
    if (!adminKey) {
      setMessage('Please enter the Admin Key.');
      return;
    }
    setBusy(true);
    setMessage('Redeeming prepaid entries...');
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/prepaid/redeem-now`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: moduleFilter ? JSON.stringify({ module: moduleFilter }) : '{}'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Redeem failed');
      setResult(data);
      setMessage('Redeem completed.');
    } catch (e) {
      setMessage(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };


  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    outline: 'none',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const labelStyle = {
    fontWeight: '600',
    marginBottom: '8px',
    color: '#374151',
    fontSize: '14px',
    display: 'block'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: busy ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    boxShadow: busy ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)',
    cursor: busy ? 'not-allowed' : 'pointer'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#f8fafc',
    color: '#475569',
    border: '2px solid #e2e8f0',
  };

  const successButtonStyle = {
    ...buttonStyle,
    background: busy ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    boxShadow: busy ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
    cursor: busy ? 'not-allowed' : 'pointer'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white'
            }}>
              📊
            </div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              margin: '0 0 8px 0',
              color: '#1e293b',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Prepaid CSV Management
            </h1>
            <p style={{
              color: '#64748b',
              fontSize: '16px',
              margin: 0,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              Upload and manage prepaid user entries
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '1fr 1fr' }}>
          
          {/* Upload Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 24px 0',
              color: '#1e293b',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              📤 Upload CSV File
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Admin Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter your admin key"
                  style={{
                    ...inputStyle,
                    borderColor: adminKey ? '#10b981' : '#e5e7eb'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = adminKey ? '#10b981' : '#e5e7eb'}
                />
              </div>

              <div>
                <label style={labelStyle}>CSV File</label>
                <div style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  background: file ? '#f0fdf4' : '#fafafa',
                  borderColor: file ? '#10b981' : '#d1d5db'
                }}>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                    }}
                    style={{ display: 'none' }}
                    id="csvFile"
                  />
                  <label htmlFor="csvFile" style={{
                    cursor: 'pointer',
                    display: 'block'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      {file ? '✅' : '📁'}
                    </div>
                    <div style={{
                      fontWeight: '600',
                      color: file ? '#059669' : '#374151',
                      marginBottom: '4px'
                    }}>
                      {file ? file.name : 'Choose CSV file'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Required: email | Optional: phone, module, expiresAt, note
                      <br />
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                        Defaults: module='all-modules', expiresAt=1 year, note=auto-generated
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => {
                    handleUpload();
                  }}
                  disabled={busy}
                  style={primaryButtonStyle}
                  onMouseEnter={(e) => {
                    if (!busy) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!busy) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                >
                  {busy ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '8px'
                      }}></div>
                      Uploading...
                    </>
                  ) : (
                    '📤 Upload CSV'
                  )}
                </button>

                <button
                  onClick={() => window.open('https://raw.githubusercontent.com/csvformat/csv-schema/master/csv.md', '_blank')}
                  type="button"
                  style={secondaryButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  📋 Help
                </button>
              </div>
            </div>
          </div>

          {/* Redeem Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 24px 0',
              color: '#1e293b',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              🎫 Redeem Entries
            </h2>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Module Filter (Optional)</label>
                <select
                  value={moduleFilter}
                  onChange={(e) => setModuleFilter(e.target.value)}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">🎯 All modules in CSV</option>
                  <option value="all-modules">🌟 all-modules</option>
                  <option value="sanskriti">🏛️ sanskriti</option>
                  <option value="upskilling">📚 upskilling</option>
                  <option value="career-assessment">💼 career-assessment</option>
                  <option value="school-assessment">🏫 school-assessment</option>
                </select>
              </div>

              <button
                onClick={handleRedeem}
                disabled={busy}
                style={successButtonStyle}
                onMouseEnter={(e) => {
                  if (!busy) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!busy) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {busy ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    Processing...
                  </>
                ) : (
                  '🎫 Redeem Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {message && (
          <div style={{
            marginTop: '24px',
            padding: '16px 20px',
            background: message.includes('Error') ? '#fef2f2' : 
                       message.includes('successfully') ? '#f0fdf4' : '#fefce8',
            border: `2px solid ${message.includes('Error') ? '#fecaca' : 
                                 message.includes('successfully') ? '#bbf7d0' : '#fef3c7'}`,
            borderRadius: '12px',
            color: message.includes('Error') ? '#dc2626' : 
                   message.includes('successfully') ? '#059669' : '#d97706',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '8px', fontSize: '16px' }}>
              {message.includes('Error') ? '❌' : 
               message.includes('successfully') ? '✅' : 'ℹ️'}
            </span>
            {message}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{
            marginTop: '24px',
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#1e293b',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              📊 Response Data
            </h3>
            <pre style={{
              padding: '20px',
              background: '#0f172a',
              color: '#e2e8f0',
              borderRadius: '12px',
              overflowX: 'auto',
              fontSize: '13px',
              lineHeight: '1.5',
              fontFamily: 'Monaco, Consolas, monospace',
              border: '1px solid #334155'
            }}>
{JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#64748b',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '12px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          🔗 Backend: <code style={{ 
            background: '#f1f5f9', 
            padding: '2px 6px', 
            borderRadius: '4px',
            fontSize: '12px'
          }}>{API_BASE_URL}</code>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminPrepaid;