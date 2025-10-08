import React, { useState, useMemo } from 'react';
import { User, Chat, Announcement, ConsultationCategory, Role, ServerAdminPermission } from '../types';
import ChatWindow from './ChatWindow';

interface ServerDashboardProps {
  user: User;
  activeMenu: string;
  allAnnouncements: Announcement[];
  allChats: Chat[];
  allUsers: User[];
  onUpdateChats: (updatedChats: Chat[]) => void;
  onCreateAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'author'>) => void;
}

const ConsultationChart: React.FC<{ chats: Chat[] }> = ({ chats }) => {
    const data = useMemo(() => {
        const counts = chats.reduce((acc, chat) => {
            if (chat.topic) {
                acc[chat.topic] = (acc[chat.topic] || 0) + 1;
            }
            return acc;
        }, {} as Record<ConsultationCategory, number>);
        
        const validCounts = Object.values(counts).filter(c => c > 0);
        if (validCounts.length === 0) return [];

        const maxCount = Math.max(...validCounts);
        
        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            percentage: maxCount > 0 ? (value / maxCount) * 100 : 0,
        }));
    }, [chats]);
    
    if (data.length === 0) {
        return <p className="text-text-secondary">Belum ada data konsultasi yang tercatat.</p>;
    }


    return (
        <div className="space-y-4">
            {data.map(item => (
                <div key={item.name}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-text-primary">{item.name}</span>
                        <span className="text-sm text-admin-text-secondary">{item.value} konsultasi</span>
                    </div>
                    <div className="w-full bg-admin-border rounded-full h-4">
                        <div 
                            className="admin-accent-bg h-4 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                            title={`${item.value} konsultasi`}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const ServerDashboard: React.FC<ServerDashboardProps> = ({ user, activeMenu, allAnnouncements, allChats, allUsers, onUpdateChats, onCreateAnnouncement }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [newAnnTitle, setNewAnnTitle] = useState('');
    const [newAnnCategory, setNewAnnCategory] = useState('');
    const [newAnnContent, setNewAnnContent] = useState('');

    const handlePublishAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAnnTitle || !newAnnCategory || !newAnnContent) {
            alert('Harap isi semua kolom pengumuman.');
            return;
        }
        onCreateAnnouncement({
            title: newAnnTitle,
            category: newAnnCategory,
            content: newAnnContent,
        });
        setNewAnnTitle('');
        setNewAnnCategory('');
        setNewAnnContent('');
    };

    if (selectedChat) {
        return (
            <div className="h-full">
                <ChatWindow
                    chat={selectedChat}
                    currentUser={user} 
                    onBack={() => setSelectedChat(null)}
                    allUsers={allUsers}
                    onUpdateChat={() => {}} 
                />
            </div>
        );
    }
    
    const renderMainDashboard = () => {
        const totalMessages = allChats.reduce((sum, chat) => sum + chat.messages.length, 0);
        return (
            <div className="admin-card rounded-2xl shadow-lg p-6 h-full">
                <h2 className="text-2xl font-bold text-text-primary mb-6 admin-header">SYSTEM ANALYTICS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                     <div className="bg-admin-border p-6 rounded-xl">
                        <h3 className="font-semibold text-admin-text-secondary">TOTAL USERS</h3>
                        <p className="text-4xl font-bold text-text-primary">{allUsers.length}</p>
                    </div>
                    <div className="bg-admin-border p-6 rounded-xl">
                        <h3 className="font-semibold text-admin-text-secondary">ACTIVE CHATS</h3>
                        <p className="text-4xl font-bold text-text-primary">{allChats.length}</p>
                    </div>
                    <div className="bg-admin-border p-6 rounded-xl">
                        <h3 className="font-semibold text-admin-text-secondary">MESSAGES SENT</h3>
                        <p className="text-4xl font-bold text-text-primary">{totalMessages}</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 admin-header">CONSULTATION TOPICS DISTRIBUTION</h3>
                <ConsultationChart chats={allChats} />
            </div>
        );
    };

    const renderUserManagement = () => (
        <div className="admin-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 admin-header">USER MANAGEMENT</h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-admin-border">
                        <th className="p-2 text-admin-text-secondary">Nama</th>
                        <th className="p-2 text-admin-text-secondary">NIM/NIP</th>
                        <th className="p-2 text-admin-text-secondary">Peran</th>
                        <th className="p-2 text-admin-text-secondary">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map(u => (
                        <tr key={u.id} className="border-b border-admin-border hover:bg-admin-border/50">
                            <td className="p-2 flex items-center">
                                <img src={u.avatarUrl || `https://picsum.photos/seed/${u.id}/32/32`} alt={u.name} className="w-8 h-8 rounded-full mr-3 object-cover"/>
                                {u.name}
                            </td>
                            <td className="p-2">{u.nim_nip}</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2">{u.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderChatMonitoring = () => (
         <div className="admin-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 admin-header">CHAT MONITORING</h2>
            <ul className="space-y-2">
               {allChats.map(chat => {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    const isGroup = chat.type === 'group';
                    const chatName = isGroup ? chat.name : chat.participants.map(p => p.name).join(' & ');
                   return (
                    <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-admin-border/50 rounded-lg cursor-pointer">
                        <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                        <div className="flex-1 overflow-hidden">
                            <div className="flex justify-between">
                                <h3 className="font-semibold text-text-primary truncate">{chatName}</h3>
                                <p className="text-xs text-admin-text-secondary">{lastMessage?.timestamp}</p>
                            </div>
                            <p className="text-sm text-admin-text-secondary truncate">{lastMessage?.text || `[File] ${lastMessage?.file?.name}`}</p>
                        </div>
                    </li>
                   )
               })}
            </ul>
        </div>
    );

    const renderAnnouncementManagement = () => (
         <div className="admin-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-6 admin-header">BROADCAST ANNOUNCEMENT</h2>
            <form className="space-y-4" onSubmit={handlePublishAnnouncement}>
                <div>
                    <label className="block text-sm font-medium text-admin-text-secondary">Judul</label>
                    <input type="text" value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} className="mt-1 block w-full border border-admin-border rounded-md shadow-sm p-2 bg-admin-card text-text-primary focus:ring-admin-accent focus:border-admin-accent" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-admin-text-secondary">Kategori</label>
                    <input type="text" value={newAnnCategory} onChange={e => setNewAnnCategory(e.target.value)} placeholder="Contoh: Akademik, Beasiswa" className="mt-1 block w-full border border-admin-border rounded-md shadow-sm p-2 bg-admin-card text-text-primary focus:ring-admin-accent focus:border-admin-accent" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-admin-text-secondary">Konten</label>
                    <textarea value={newAnnContent} onChange={e => setNewAnnContent(e.target.value)} className="mt-1 block w-full border border-admin-border rounded-md shadow-sm p-2 bg-admin-card text-text-primary focus:ring-admin-accent focus:border-admin-accent" rows={4}></textarea>
                </div>
                <button type="submit" className="admin-accent-bg text-slate-900 font-semibold py-2 px-4 rounded-lg hover:opacity-90">Publikasikan</button>
            </form>
            <div className="mt-8 border-t border-admin-border pt-6">
                 <h3 className="text-xl font-bold text-text-primary mb-4 admin-header">PUBLISHED ANNOUNCEMENTS</h3>
                 <div className="space-y-4">
                    {allAnnouncements.map(ann => (
                    <div key={ann.id} className="border-l-4 border-admin-accent bg-admin-accent/10 p-4 rounded-r-lg">
                        <h3 className="font-bold text-text-primary">{ann.title}</h3>
                         <p className="text-xs text-admin-text-secondary">Oleh: {ann.author} - {ann.date}</p>
                        <p className="text-sm text-text-secondary mt-1">{ann.content}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
    
    const renderContent = () => {
        const hasPermission = (permission: ServerAdminPermission) => user.permissions?.includes(permission);

        switch (activeMenu) {
            case 'Dashboard Utama':
                return renderMainDashboard();
            case 'Manajemen Pengguna':
                return hasPermission(ServerAdminPermission.MANAGE_USERS) ? renderUserManagement() : null;
            case 'Monitor Percakapan':
                return hasPermission(ServerAdminPermission.MONITOR_CHATS) ? renderChatMonitoring() : null;
            case 'Kelola Pengumuman':
                 return hasPermission(ServerAdminPermission.MANAGE_ANNOUNCEMENTS) ? renderAnnouncementManagement() : null;
            default:
                return renderMainDashboard();
        }
    }


    return (
        <div className="h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary admin-header">
                    <span className="admin-accent-text">&gt;</span> Server Administration Panel
                </h1>
                <p className="text-admin-text-secondary">Welcome, {user.name}. System status: <span className="admin-accent-text">OK</span></p>
            </header>
            <div className="h-[calc(100%-6rem)]">
                {renderContent()}
            </div>
        </div>
    );
};

export default ServerDashboard;