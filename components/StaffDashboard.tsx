
import React, { useState, useMemo } from 'react';
import { User, Chat, ChatMessage, Announcement, ConsultationCategory, Role } from '../types';
import ChatWindow from './ChatWindow';
import CreateGroup from './CreateGroup';
import { PlusCircleIcon } from './icons';

interface StaffDashboardProps {
  user: User;
  activeMenu: string;
  announcements: Announcement[];
  chats: Chat[];
  users: User[];
  onUpdateChats: (updatedChats: Chat[]) => void;
  onCreateAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'author'>) => void;
}

const ConsultationChart: React.FC<{ chats: Chat[] }> = ({ chats }) => {
    const data = useMemo(() => {
        // FIX: Provide an explicit type for the initial value of reduce to fix type inference.
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


const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, activeMenu, announcements, chats, users, onUpdateChats, onCreateAnnouncement }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [newAnnTitle, setNewAnnTitle] = useState('');
    const [newAnnCategory, setNewAnnCategory] = useState('');
    const [newAnnContent, setNewAnnContent] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);


    const userChats = chats.filter(chat => chat.participants.some(p => p.id === user.id));

    const handleUpdateChat = (updatedChat: Chat) => {
        const updatedChats = chats.map(c => c.id === updatedChat.id ? updatedChat : c);
        onUpdateChats(updatedChats);
        setSelectedChat(updatedChat);
    };
    
    const handleCreateGroup = (newGroup: Chat) => {
        onUpdateChats([...chats, newGroup]);
        setSelectedChat(newGroup);
        setIsCreatingGroup(false);
    };

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

    if (isCreatingGroup) {
        return (
            <CreateGroup
                currentUser={user}
                allUsers={users}
                onBack={() => setIsCreatingGroup(false)}
                onCreateGroup={handleCreateGroup}
            />
        );
    }

     if (selectedChat) {
        return (
            <div className="h-full">
                <ChatWindow
                    chat={selectedChat}
                    currentUser={user}
                    onBack={() => setSelectedChat(null)}
                    allUsers={users}
                    onUpdateChat={handleUpdateChat}
                />
            </div>
        );
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'Kotak Masuk':
                 return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">{activeMenu}</h2>
                        <ul className="space-y-2">
                           {userChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id);
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               const isGroup = chat.type === 'group';
                               return (
                                <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                    <img src={isGroup ? chat.avatarUrl : otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-text-primary truncate">{isGroup ? chat.name : otherUser?.name}</h3>
                                            <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">{lastMessage?.text || `[File] ${lastMessage?.file?.name}`}</p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Riwayat Chat':
                const allUserChats = [...userChats].sort((a, b) => {
                    if (a.messages.length === 0) return 1;
                    if (b.messages.length === 0) return -1;
                    const lastMsgA = a.messages[a.messages.length - 1].timestamp;
                    const lastMsgB = b.messages[b.messages.length - 1].timestamp;
                    return lastMsgB.localeCompare(lastMsgA);
                });
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-text-primary">{activeMenu}</h2>
                            <button
                                onClick={() => setIsCreatingGroup(true)}
                                className="flex items-center gap-2 bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Buat Grup Baru
                            </button>
                        </div>
                        <ul className="space-y-2">
                           {allUserChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id);
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               const isGroup = chat.type === 'group';
                               const sender = users.find(u => u.id === lastMessage?.senderId);
                               return (
                                <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                    {isGroup ? (
                                         <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 flex-shrink-0 object-cover"/>
                                    ) : (
                                        <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 flex-shrink-0 object-cover"/>
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-text-primary truncate">{isGroup ? chat.name : otherUser?.name}</h3>
                                            <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary truncate">
                                           {isGroup ? `${sender?.id === user.id ? 'Anda' : sender?.name?.split(' ')[0]}: ` : ''}{lastMessage?.text || `[File] ${lastMessage?.file?.name}`}
                                        </p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Grup Chat':
                const groupChats = userChats.filter(chat => chat.type === 'group');
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-text-primary">{activeMenu}</h2>
                            <button
                                onClick={() => setIsCreatingGroup(true)}
                                className="flex items-center gap-2 bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Buat Grup Baru
                            </button>
                        </div>
                        {groupChats.length > 0 ? (
                            <ul className="space-y-2">
                            {groupChats.map(chat => {
                                    const lastMessage = chat.messages[chat.messages.length - 1];
                                    const sender = users.find(u => u.id === lastMessage?.senderId);
                                    return (
                                    <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                        <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between">
                                                <h3 className="font-semibold text-text-primary truncate">{chat.name}</h3>
                                                <p className="text-xs text-text-secondary flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                                            </div>
                                            <p className="text-sm text-text-secondary truncate">
                                                <span className="font-medium">{sender?.id === user.id ? 'Anda' : sender?.name?.split(' ')[0]}:</span> {lastMessage?.text || `[File] ${lastMessage?.file?.name}`}
                                            </p>
                                        </div>
                                    </li>
                                )
                            })}
                            </ul>
                        ) : (
                            <p className="text-text-secondary mt-4">Tidak ada grup chat.</p>
                        )}
                    </div>
                );
            case 'Data Konsultasi':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Data Konsultasi</h2>
                        <ConsultationChart chats={chats} />
                    </div>
                );
            case 'Pengumuman Kampus':
                return (
                     <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Buat & Sebarkan Pengumuman</h2>
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
                                {announcements.map(ann => (
                                <div key={ann.id} className="border-l-4 border-unsri-yellow bg-unsri-yellow/10 p-4 rounded-r-lg">
                                    <h3 className="font-bold text-text-primary">{ann.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{ann.content}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                )
            case 'Laporan Aktivitas':
                 const totalMessages = chats.reduce((sum, chat) => sum + chat.messages.length, 0);
                 return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Laporan Aktivitas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div className="bg-input-bg p-4 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Pengguna</h3>
                                <p className="text-3xl font-bold text-text-primary">{users.length}</p>
                            </div>
                            <div className="bg-input-bg p-4 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Percakapan</h3>
                                <p className="text-3xl font-bold text-text-primary">{chats.length}</p>
                            </div>
                            <div className="bg-input-bg p-4 rounded-xl">
                                <h3 className="font-semibold text-text-secondary">Total Pesan Terkirim</h3>
                                <p className="text-3xl font-bold text-text-primary">{totalMessages}</p>
                            </div>
                        </div>
                    </div>
                 );
            default:
                return <div>Pilih menu di samping.</div>;
        }
    }
    
    return (
        <div className="h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Selamat datang, {user.name} 👋</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card p-4 rounded-xl shadow">
                        <h3 className="font-semibold text-text-secondary">Jumlah Konsultasi Hari Ini</h3>
                        <p className="text-3xl font-bold text-text-primary">12</p>
                    </div>
                    <div className="bg-card p-4 rounded-xl shadow">
                        <h3 className="font-semibold text-text-secondary">Pesan Belum Dibalas</h3>
                        <p className="text-3xl font-bold text-text-primary">3</p>
                    </div>
                </div>
            </header>
            <div className="h-[calc(100%-10rem)]">
                {renderContent()}
            </div>
        </div>
    );
};

export default StaffDashboard;