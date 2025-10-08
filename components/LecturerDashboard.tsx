
import React, { useState } from 'react';
import { User, Chat, ChatMessage, Announcement, ConsultationCategory } from '../types';
import ChatWindow from './ChatWindow';
import CreateGroup from './CreateGroup';
import { PlusCircleIcon } from './icons';

interface LecturerDashboardProps {
  user: User;
  activeMenu: string;
  announcements: Announcement[];
  chats: Chat[];
  users: User[];
  onUpdateChats: (updatedChats: Chat[]) => void;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ user, activeMenu, announcements, chats, users, onUpdateChats }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

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
    
    const getFilteredChats = () => {
        const allUserChats = chats.filter(chat => chat.participants.some(p => p.id === user.id));
        switch (activeMenu) {
            case 'Pesan Masuk':
                // Prioritize chats where the last message is not from the current user
                return [...allUserChats].sort((a, b) => {
                    if (a.messages.length === 0) return 1;
                    if (b.messages.length === 0) return -1;
                    const lastMsgAFromOther = a.messages[a.messages.length - 1].senderId !== user.id;
                    const lastMsgBFromOther = b.messages[b.messages.length - 1].senderId !== user.id;
                    if (lastMsgAFromOther && !lastMsgBFromOther) return -1;
                    if (!lastMsgAFromOther && lastMsgBFromOther) return 1;
                    return 0;
                });
            case 'Bimbingan & Konsultasi':
                return allUserChats.filter(chat => 
                    chat.topic === ConsultationCategory.ACADEMIC ||
                    chat.topic === ConsultationCategory.CAREER
                );
            case 'Grup Chat':
                return allUserChats.filter(chat => chat.type === 'group');
            case 'Riwayat Chat':
                 return [...allUserChats].sort((a, b) => {
                    if (a.messages.length === 0) return 1;
                    if (b.messages.length === 0) return -1;
                    const lastMsgA = a.messages[a.messages.length - 1].timestamp;
                    const lastMsgB = b.messages[b.messages.length - 1].timestamp;
                    // This is a simple string comparison for time; for production, use Date objects
                    return lastMsgB.localeCompare(lastMsgA);
                });
            default:
                return allUserChats;
        }
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'Pesan Masuk':
            case 'Riwayat Chat':
            case 'Bimbingan & Konsultasi':
            case 'Grup Chat':
                 const displayedChats = getFilteredChats();
                 const showCreateButton = activeMenu === 'Grup Chat' || activeMenu === 'Riwayat Chat';
                 return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-text-primary">{activeMenu}</h2>
                            {showCreateButton && (
                                <button
                                    onClick={() => setIsCreatingGroup(true)}
                                    className="flex items-center gap-2 bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                                >
                                    <PlusCircleIcon className="w-5 h-5" />
                                    Buat Grup Baru
                                </button>
                            )}
                        </div>
                        {displayedChats.length > 0 ? (
                            <ul className="space-y-2">
                            {displayedChats.map(chat => {
                                    const otherUser = chat.participants.find(p => p.id !== user.id);
                                    const lastMessage = chat.messages[chat.messages.length - 1];
                                    const isGroup = chat.type === 'group';
                                    const sender = users.find(u => u.id === lastMessage?.senderId);
                                    return (
                                    <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                        <img src={isGroup ? chat.avatarUrl : otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
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
                        ) : (
                             <p className="text-text-secondary mt-4">Tidak ada chat dalam kategori ini.</p>
                        )}
                    </div>
                );
            case 'Informasi Kampus':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Informasi Kampus</h2>
                         <div className="space-y-4">
                            {announcements.map(ann => (
                                <div key={ann.id} className="border border-border p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-text-primary">{ann.title}</h3>
                                        <span className="text-xs text-text-secondary">{ann.date}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">{ann.category}</span>
                                    <p className="text-sm text-text-secondary mt-2">{ann.content}</p>
                                </div>
                            ))}
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
                <h1 className="text-3xl font-bold text-text-primary">Selamat datang, {user.name}! 👋</h1>
                <p className="text-text-secondary">Siap membantu mahasiswa hari ini?</p>
            </header>
            <div className="h-[calc(100%-6rem)]">
                {renderContent()}
            </div>
        </div>
    );
};

export default LecturerDashboard;
