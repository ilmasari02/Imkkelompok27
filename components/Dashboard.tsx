import React, { useState } from 'react';
import { User, Role, Announcement, Chat } from '../types';
import { Theme } from '../App';
import StudentDashboard from './StudentDashboard';
import LecturerDashboard from './LecturerDashboard';
import StaffDashboard from './StaffDashboard';
import AlumniDashboard from './AlumniDashboard';
import ServerDashboard from './ServerDashboard';
import ProfileSettings from './ProfileSettings';
import { MessageCircleIcon, TargetIcon, MegaphoneIcon, HistoryIcon, LogOutIcon, InboxIcon, BookUserIcon, FileTextIcon, BarChart3Icon, UsersIcon, SettingsIcon } from './icons';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  theme: Theme;
  onSetTheme: (theme: Theme) => void;
  users: User[];
  chats: Chat[];
  announcements: Announcement[];
  onUpdateChats: (updatedChats: Chat[]) => void;
  onCreateAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'author'>) => void;
}

const getMenuItems = (role: Role) => {
    let menu;
    switch (role) {
        case Role.STUDENT:
            menu = [
                { name: 'Chat Pribadi', icon: MessageCircleIcon },
                { name: 'Grup Chat', icon: UsersIcon },
                { name: 'Konsultasi Kampus', icon: TargetIcon },
                { name: 'Info & Pengumuman', icon: MegaphoneIcon },
                { name: 'Riwayat Chat', icon: HistoryIcon },
            ];
            break;
        case Role.LECTURER:
            menu = [
                { name: 'Pesan Masuk', icon: InboxIcon },
                { name: 'Bimbingan & Konsultasi', icon: BookUserIcon },
                { name: 'Grup Chat', icon: UsersIcon },
                { name: 'Riwayat Chat', icon: HistoryIcon },
                { name: 'Informasi Kampus', icon: MegaphoneIcon },
            ];
            break;
        case Role.STAFF:
            menu = [
                { name: 'Kotak Masuk', icon: InboxIcon },
                { name: 'Grup Chat', icon: UsersIcon },
                { name: 'Riwayat Chat', icon: HistoryIcon },
                { name: 'Data Konsultasi', icon: FileTextIcon },
                { name: 'Pengumuman Kampus', icon: MegaphoneIcon },
                { name: 'Laporan Aktivitas', icon: BarChart3Icon },
            ];
            break;
        case Role.ALUMNI:
            menu = [
                { name: 'Forum Angkatan', icon: UsersIcon },
                { name: 'Info Karir & Lowongan', icon: FileTextIcon },
                { name: 'Jejaring Alumni', icon: BookUserIcon },
                { name: 'Riwayat Chat', icon: HistoryIcon },
                { name: 'Event Kampus', icon: MegaphoneIcon },
            ];
            break;
        case Role.SERVER_ADMIN:
            menu = [
                { name: 'Dashboard Utama', icon: BarChart3Icon },
                { name: 'Manajemen Pengguna', icon: UsersIcon },
                { name: 'Monitor Percakapan', icon: MessageCircleIcon },
                { name: 'Kelola Pengumuman', icon: MegaphoneIcon },
            ]
            break;
        default:
            menu = [];
    }
    menu.push({ name: 'Pengaturan Akun', icon: SettingsIcon });
    return menu;
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user, onLogout, onUpdateUser, theme, onSetTheme, users, chats, announcements, onUpdateChats, onCreateAnnouncement } = props;
  const menuItems = getMenuItems(user.role);
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.name || '');

  const renderDashboardContent = () => {
    switch (activeMenu) {
        case 'Pengaturan Akun':
            return <ProfileSettings user={user} onUpdate={onUpdateUser} />;
        default:
            switch (user.role) {
                case Role.STUDENT:
                    return <StudentDashboard user={user} activeMenu={activeMenu} announcements={announcements} chats={chats} users={users} onUpdateChats={onUpdateChats} />;
                case Role.LECTURER:
                    return <LecturerDashboard user={user} activeMenu={activeMenu} announcements={announcements} chats={chats} users={users} onUpdateChats={onUpdateChats} />;
                case Role.STAFF:
                    return <StaffDashboard user={user} activeMenu={activeMenu} announcements={announcements} chats={chats} users={users} onUpdateChats={onUpdateChats} onCreateAnnouncement={onCreateAnnouncement} />;
                case Role.ALUMNI:
                    return <AlumniDashboard user={user} activeMenu={activeMenu} announcements={announcements} chats={chats} users={users} onUpdateChats={onUpdateChats} />;
                case Role.SERVER_ADMIN:
                    return <ServerDashboard user={user} activeMenu={activeMenu} allAnnouncements={announcements} allChats={chats} allUsers={users} onUpdateChats={onUpdateChats} onCreateAnnouncement={onCreateAnnouncement} />;
                default:
                    return <div>Peran tidak dikenal.</div>;
            }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card p-6 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-text-primary">UNSRI <span className="text-unsri-yellow">TALK</span></h1>
          </div>
          
          <div 
            className="text-center mb-10 cursor-pointer group"
            onClick={() => setActiveMenu('Pengaturan Akun')}
            aria-label="Buka pengaturan akun"
          >
              <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/100/100`} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover group-hover:ring-4 group-hover:ring-unsri-yellow/30 transition-all"/>
              <h2 className="font-semibold text-text-primary group-hover:text-unsri-yellow">{user.name}</h2>
              <p className="text-sm text-text-secondary">{user.role}{user.staffRole ? ` (${user.staffRole})` : ''}</p>
          </div>
          
          <nav>
            <ul>
              {menuItems.map(item => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveMenu(item.name); }}
                    className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                      activeMenu === item.name 
                        ? 'bg-unsri-yellow-light text-unsri-yellow font-semibold' 
                        : 'text-text-secondary hover:bg-input-bg'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div>
            <div className="mb-4">
                <p className="text-xs text-text-secondary mb-2 px-3">Tema</p>
                <div className="flex justify-around bg-input-bg p-1 rounded-full">
                    <button aria-label="Light theme" onClick={() => onSetTheme('light')} className={`w-8 h-8 rounded-full bg-white border-2 transition-colors ${theme === 'light' ? 'border-unsri-yellow' : 'border-transparent'}`}></button>
                    <button aria-label="Navy theme" onClick={() => onSetTheme('navy')} className={`w-8 h-8 rounded-full bg-[#0F172A] border-2 transition-colors ${theme === 'navy' ? 'border-unsri-yellow' : 'border-transparent'}`}></button>
                    <button aria-label="Dark theme" onClick={() => onSetTheme('dark')} className={`w-8 h-8 rounded-full bg-black border-2 transition-colors ${theme === 'dark' ? 'border-unsri-yellow' : 'border-transparent'}`}></button>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="flex items-center space-x-3 p-3 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors w-full"
                >
                <LogOutIcon className="w-5 h-5" />
                <span>Keluar</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-8 overflow-y-auto ${user.role === Role.SERVER_ADMIN ? 'server-admin-dashboard' : ''}`} style={{ height: '100vh' }}>
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;