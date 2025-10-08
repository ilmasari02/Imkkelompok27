import React, { useState, useMemo } from 'react';
import { User, Chat, Announcement, ConsultationCategory, Role } from '../types';
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
                        <span className="text-sm text-text-secondary">{item.value} konsultasi</span>
                    </div>
                    <div className="w-full bg-input-bg rounded-full h-4">
                        <div 
                            className="bg-unsri-yellow h-4 rounded-full" 
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
                {/* Admin can only view chats, not participate */}
                <ChatWindow
                    chat={selectedChat}
                    currentUser={user} // Pass server admin user
                    onBack={() => setSelectedChat(null)}
                    allUsers={allUsers}
                    onUpdateChat={() => {}} // No-op function for read-only
                />
            </div>
        );
    }
    
    const renderContent = () => {
        switch (activeMenu) {
            case 'Dashboard Utama':
                const totalMessages = allChats.reduce((sum, chat) => sum + chat.messages.length, 0);
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard Utama & Analitik</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                             <div className="bg-input-bg p-6 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Pengguna</h3>
                                <p className="text-4xl font-bold text-text-primary">{allUsers.length}</p>
                            </div>
                            <div className="bg-input-bg p-6 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Percakapan</h3>
                                <p className="text-4xl font-bold text-text-primary">{allChats.length}</p>
                            </div>
                            <div className="bg-input-bg p-6 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Pesan Terkirim</h3>
                                <p className="text-4xl font-bold text-text-primary">{totalMessages}</p>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-4">Distribusi Topik Konsultasi</h3>
                        <ConsultationChart chats={allChats} />
                    </div>
                );
            case 'Manajemen Pengguna':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Manajemen Pengguna</h2>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-2">Nama</th>
                                    <th className="p-2">NIM/NIP</th>
                                    <th className="p-2">Peran</th>
                                    <th className="p-2">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(u => (
                                    <tr key={u.id} className="border-b border-border hover:bg-input-bg/50">
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
            case 'Monitor Percakapan':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Semua Percakapan</h2>
                        <ul className="space-y-2">
                           {allChats.map(chat => {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                const isGroup = chat.type === 'group';
                                const chatName = isGroup ? chat.name : chat.participants.map(p => p.name).join(' & ');
                               return (
                                <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                    <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-text-primary truncate">{chatName}</h3>
                                            <p className="text-xs text-text-secondary">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">{lastMessage?.text || `[File] ${lastMessage?.file?.name}`}</p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Kelola Pengumuman':
                 return (
                     <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Buat & Kelola Pengumuman</h2>
                        <form className="space-y-4" onSubmit={handlePublishAnnouncement}>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Judul</label>
                                <input type="text" value={newAnnTitle} onChange={e => setNewAnnTitle(e.target.value)} className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-input-bg text-text-primary focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Kategori</label>
                                <input type="text" value={newAnnCategory} onChange={e => setNewAnnCategory(e.target.value)} placeholder="Contoh: Akademik, Beasiswa" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-input-bg text-text-primary focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Konten</label>
                                <textarea value={newAnnContent} onChange={e => setNewAnnContent(e.target.value)} className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-input-bg text-text-primary focus:ring-unsri-yellow focus:border-unsri-yellow" rows={4}></textarea>
                            </div>
                            <button type="submit" className="bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500">Publikasikan</button>
                        </form>
                        <div className="mt-8 border-t border-border pt-6">
                             <h3 className="text-xl font-bold text-text-primary mb-4">Pengumuman Terkirim</h3>
                             <div className="space-y-4">
                                {allAnnouncements.map(ann => (
                                <div key={ann.id} className="border-l-4 border-unsri-yellow bg-unsri-yellow/10 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-text-primary">{ann.title}</h3>
                                     <p className="text-xs text-text-secondary">Oleh: {ann.author} - {ann.date}</p>
                                    <p className="text-sm text-text-secondary mt-1">{ann.content}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )
            default:
                return <div>Pilih menu di samping.</div>;
        }
    }


    return (
        <div className="h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Server Administration Panel</h1>
                <p className="text-text-secondary">Selamat datang, {user.name}.</p>
            </header>
            <div className="h-[calc(100%-6rem)]">
                {renderContent()}
            </div>
        </div>
    );
};

export default ServerDashboard;