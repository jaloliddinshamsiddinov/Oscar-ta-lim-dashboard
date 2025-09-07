// src/App.jsx
import { useEffect, useState } from 'react';
// import './index.css'; // Bu fayl bo'sh bo'lishi mumkin, stillarni to'g'ridan-to'g'ri yozamiz

// ====================================================================
// YORDAMCHI KOMPONENTLAR
// ====================================================================

const LoadingSpinner = () => (
    <div style={{
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid #fff',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite'
    }}></div>
);

const AccordionItem = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer', background: isOpen ? '#004a8c' : 'transparent' }}>
        <td style={{ padding: '16px', whiteSpace: 'nowrap', fontWeight: '500' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '12px', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
            {user.name}
          </div>
        </td>
        <td style={{ padding: '16px', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {user.totalListens} marta
        </td>
        <td style={{ padding: '16px', whiteSpace: 'nowrap', textAlign: 'center' }}>
          {user.lessons.length} ta
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="3" style={{ padding: '16px 24px', background: 'rgba(0, 0, 0, 0.1)' }}>
            <div style={{ paddingLeft: '28px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '12px', color: '#ccc' }}>Batafsil statistika:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {user.lessons.map((lesson, index) => (
                  <li key={index}>
                    <p style={{ fontSize: '14px', color: '#fff', margin: 0 }}>{lesson.title}</p>
                    <p style={{ fontSize: '12px', color: '#aaa', margin: '4px 0 0 0' }}>
                      <strong>{lesson.count}</strong> marta tinglangan (oxirgisi: {lesson.lastDate || 'N/A'})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};


// ====================================================================
// ASOSIY KOMPONENT
// ====================================================================

function App() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) throw new Error("API_URL topilmadi.");
        
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Server xatosi: ${response.status}`);
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#003a70', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#003a70', color: '#f87171', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px', textAlign: 'center' }}>
        <div>
          <p style={{ fontWeight: '700', fontSize: '1.125rem', marginBottom: '8px' }}>Xatolik yuz berdi!</p>
          <p style={{ fontSize: '14px' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#003a70', color: '#e5e7eb', padding: '32px' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        tr:hover { background: #0059a9 !important; }
      `}</style>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '700', color: 'white' }}>O'quvchilar Statistikasi</h1>
        </div>
        
        <div style={{ background: '#0053a0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(0, 58, 112, 0.5)' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>O'quvchi</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Umumiy Tinglashlar</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '500', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Turli Darslar Soni</th>
              </tr>
            </thead>
            <tbody style={{ borderTop: '1px solid rgba(51, 117, 179, 0.3)' }}>
              {stats.length > 0 ? (
                stats.map((user, index) => <AccordionItem key={index} user={user} />)
              ) : (
                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>Hozircha statistika mavjud emas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;