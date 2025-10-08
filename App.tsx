import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import Dashboard from './components/Dashboard';
import { Role, User, Chat, Announcement } from './types';
import { MOCK_USERS, MOCK_CHATS, MOCK_ANNOUNCEMENTS } from './constants';

type Page = 'landing' | 'login' | 'register' | 'dashboard';
export type Theme = 'light' | 'navy' | 'dark';

interface AppDb {
  users: { [key: string]: User };
  chats: Chat[];
  announcements: Announcement[];
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('navy');

  // Centralized state for all app data
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [chats, setChats] = useState<Chat[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Effect to load data from localStorage or initialize it
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem('unsri-talk-theme') || 'navy';
    handleSetTheme(savedTheme as Theme);

    // Load main database
    const dbString = localStorage.getItem('unsri-talk-db');
    if (dbString) {
      const db: AppDb = JSON.parse(dbString);
      setUsers(db.users);
      setChats(db.chats);
      setAnnouncements(db.announcements);
    } else {
      // Initialize DB from mock data if it doesn't exist
      const initialDb: AppDb = {
        users: MOCK_USERS,
        chats: MOCK_CHATS,
        announcements: MOCK_ANNOUNCEMENTS,
      };
      localStorage.setItem('unsri-talk-db', JSON.stringify(initialDb));
      setUsers(initialDb.users);
      setChats(initialDb.chats);
      setAnnouncements(initialDb.announcements);
    }

    // Check for a logged-in user
    const currentUserString = localStorage.getItem('unsri-talk-currentUser');
    if (currentUserString) {
      const loggedInUser: User = JSON.parse(currentUserString);
      setCurrentUser(loggedInUser);
      setPage('dashboard');
    }
    
    setIsDataLoaded(true);

  }, []);

  // Effect to save data to localStorage whenever it changes
  useEffect(() => {
    if (!isDataLoaded) return; // Don't save until initial load is complete
    
    const db: AppDb = { users, chats, announcements };
    localStorage.setItem('unsri-talk-db', JSON.stringify(db));
  }, [users, chats, announcements, isDataLoaded]);


  const handleSetTheme = (newTheme: Theme) => {
      setTheme(newTheme);
      localStorage.setItem('unsri-talk-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleProceed = (role: Role, mode: 'login' | 'register') => {
    setSelectedRole(role);
    setPage(mode);
  };

  const handleLogin = (nim_nip: string, password: string) => {
    const user = Object.values(users).find(u => u.nim_nip === nim_nip);

    if (user && user.password === password) {
      console.log('Logging in existing user:', user.name);
      setCurrentUser(user);
      localStorage.setItem('unsri-talk-currentUser', JSON.stringify(user));
      setPage('dashboard');
    } else {
      alert('NIM/NIP atau kata sandi salah.');
    }
  };

  const handleRegister = (name: string, nim_nip: string, password: string) => {
    if (!selectedRole) return;

    const userExists = Object.values(users).some(u => u.nim_nip === nim_nip);
    if (userExists) {
        alert('NIM/NIP sudah terdaftar. Silakan masuk.');
        return;
    }
    
    console.log('Registering new user:', name);
    const newUserId = `u${Date.now()}`;
    const newUser: User = {
        id: newUserId,
        name,
        nim_nip,
        password,
        role: selectedRole,
        email: `${name.split(' ')[0].toLowerCase()}@example.com`,
    };
    
    setUsers(prevUsers => ({ ...prevUsers, [newUserId]: newUser }));
    alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
    setPage('login');
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    localStorage.removeItem('unsri-talk-currentUser');
    setPage('landing');
  };
  
  const handleBackToLanding = () => {
    setSelectedRole(null);
    setPage('landing');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('unsri-talk-currentUser', JSON.stringify(updatedUser));
    setUsers(prev => ({...prev, [updatedUser.id]: updatedUser}));
  };

  const handleUpdateChats = (updatedChats: Chat[]) => {
    setChats(updatedChats);
  }

  const handleCreateAnnouncement = (newAnnouncementData: Omit<Announcement, 'id' | 'date' | 'author'>) => {
      if (!currentUser) return;
      const newAnnouncement: Announcement = {
          id: `ann${Date.now()}`,
          ...newAnnouncementData,
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          author: currentUser.name,
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
  };


  const renderPage = () => {
    if (!isDataLoaded) {
      return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-primary">Loading...</p></div>;
    }

    switch (page) {
      case 'landing':
        return <LandingPage onProceed={handleProceed} />;
      case 'login':
        if (selectedRole) {
          return <LoginPage role={selectedRole} onLogin={handleLogin} onBack={handleBackToLanding}/>;
        }
        break;
      case 'register':
        if (selectedRole) {
            return <RegistrationPage role={selectedRole} onRegister={handleRegister} onBack={handleBackToLanding}/>;
        }
        break;
      case 'dashboard':
        if (currentUser) {
          return (
            <Dashboard 
              user={currentUser} 
              onLogout={handleLogout} 
              onUpdateUser={handleUpdateUser} 
              theme={theme} 
              onSetTheme={handleSetTheme}
              users={Object.values(users)}
              chats={chats}
              announcements={announcements}
              onUpdateChats={handleUpdateChats}
              onCreateAnnouncement={handleCreateAnnouncement}
            />
          );
        }
        break;
      default:
        // Fallback to landing if role or user is not selected
        setPage('landing');
        return <LandingPage onProceed={handleProceed} />;
    }
    // Fallback for login/register if role gets unset
    setPage('landing');
    return <LandingPage onProceed={handleProceed} />;
  };

  return <div className="antialiased bg-background text-text-primary">{renderPage()}</div>;
};

export default App;