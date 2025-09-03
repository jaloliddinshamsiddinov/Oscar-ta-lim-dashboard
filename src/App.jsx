// src/App.jsx

import { useEffect, useState } from 'react';
import './index.css'; // Tailwind CSS stillarini import qilish

// ====================================================================
// YORDAMCHI KOMPONENTLAR
// ====================================================================

const LoadingSpinner = () => (
    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const AccordionItem = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <tr onClick={() => setIsOpen(!isOpen)} className="hover:bg-gray-700/50 cursor-pointer">
        <td className="px-6 py-4 whitespace-nowrap font-medium">
          <div className="flex items-center">
            <span className={`mr-2 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
            {user.name}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{user.lessonsStarted} ta</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-full bg-gray-600 rounded-full h-2.5 mr-2">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${user.averageProgress}%` }}></div>
            </div>
            <span className="font-semibold">{user.averageProgress}%</span>
          </div>
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan="3" className="px-6 py-4 bg-gray-800/50">
            <div className="pl-8">
              <h4 className="font-semibold text-gray-300 mb-2">Tinglangan darslar:</h4>
              <ul className="space-y-3">
                {user.lessons.map((lesson, index) => (
                  <li key={index}>
                    <p className="text-sm text-gray-200 truncate">{lesson.title}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-600 rounded-full h-1.5 mr-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${lesson.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{lesson.progress}%</span>
                    </div>
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
        if (!apiUrl) {
          throw new Error("API URL manzili .env faylda ko'rsatilmagan!");
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server xatosi: ${response.status} ${response.statusText}. Batafsil: ${errorText}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Ma'lumotlarni olishda xatolik:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-red-500 p-8">
        <div className="text-center">
          <p className="font-bold text-lg">Xatolik yuz berdi</p>
          <p className="text-sm mt-2 font-mono bg-gray-800 p-4 rounded-md">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">O'quvchilar Statistikasi</h1>
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">O'quvchi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Boshlangan darslar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">O'rtacha o'zlashtirish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stats.length > 0 ? (
                stats.map((user, index) => <AccordionItem key={index} user={user} />)
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    Hozircha statistika mavjud emas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;