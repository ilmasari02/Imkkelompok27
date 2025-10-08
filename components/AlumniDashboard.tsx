
import React, { useState } from 'react';
import { User, Chat, Role, ChatMessage, Announcement } from '../types';
import { MOCK_JOB_POSTINGS } from '../constants';
import ChatWindow from './ChatWindow';
import CreateGroup from './CreateGroup';
import { PlusCircleIcon } from './icons';

interface AlumniDashboardProps {
  user: User;
  activeMenu: string;
  announcements: Announcement[];
  chats: Chat[];
  users: User[];
  onUpdateChats: (updatedChats: Chat[]) => void;
}

const AlumniDashboard: React.FC<AlumniDashboardProps> = ({ user, activeMenu, announcements, chats, users, onUpdateChats }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const alumniGroupChats = chats.filter(chat =>
        chat.type === 'group' && chat.participants.some(p => p.role === Role.ALUMNI) && chat.participants.some(p => p.id === user.id)
    );
    
    const otherAlumni = users.filter(u => u.role === Role.ALUMNI && u.id !== user.id);
    
    const alumniEvents = announcements.filter(ann => ann.category.includes('Alumni') || ann.category.includes('Karir'));

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
    
    const handleStartChatWithAlumnus = (alumnus: User) => {
         const existingChat = chats.find(c =>
            c.type === 'private' &&
            c.participants.length === 2 &&
            c.participants.some(p => p.id === user.id) &&
            c.participants.some(p => p.id === alumnus.id)
        );

        if (existingChat) {
            setSelectedChat(existingChat);
        } else {
            const newChat: Chat = {
                id: `chat${Date.now()}`,
                participants: [user, alumnus],
                type: 'private',
                messages: [
                    {
                        id: `m${Date.now()}`,
                        senderId: user.id,
                        text: `Halo, ${alumnus.name.split(' ')[0]}. Senang bisa terhubung!`,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        read: false
                    }
                ]
            };
            onUpdateChats([...chats, newChat]);
            setSelectedChat(newChat);
        }
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
            case 'Forum Angkatan':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-text-primary">{activeMenu}</h2>
                            <button
                                onClick={() => setIsCreatingGroup(true)}
                                className="flex items-center gap-2 bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                                Buat Forum Baru
                            </button>
                        </div>
                        <ul className="space-y-2">
                           {alumniGroupChats.map(chat => {
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               const sender = chat.participants.find(p => p.id === lastMessage?.senderId);
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
                    </div>
                );
            case 'Info Karir & Lowongan':
                return (
                     <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">{activeMenu}</h2>
                         <div className="space-y-4">
                            {MOCK_JOB_POSTINGS.map(job => (
                                <div key={job.id} className="border border-border p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-text-primary text-lg">{job.title}</h3>
                                            <p className="text-sm font-semibold text-unsri-yellow">{job.company}</p>
                                            <p className="text-xs text-text-secondary mt-1">{job.location}</p>
                                        </div>
                                        <span className="text-xs text-text-secondary flex-shrink-0">{job.postedDate}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary mt-2">{job.description}</p>
                                     <p className="text-sm text-text-secondary mt-3">Kontak: <a href={`mailto:${job.contact}`} className="text-unsri-yellow hover:underline">{job.contact}</a></p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Jejaring Alumni':
                 return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">{activeMenu}</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {otherAlumni.map(alumnus => (
                                <li 
                                    key={alumnus.id} 
                                    onClick={() => handleStartChatWithAlumnus(alumnus)}
                                    className="flex flex-col items-center text-center p-4 border border-border rounded-lg hover:border-unsri-yellow hover:bg-unsri-yellow/10 cursor-pointer transition-all"
                                >
                                    <img src={alumnus.avatarUrl || `https://picsum.photos/seed/${alumnus.id}/80/80`} alt={alumnus.name} className="w-20 h-20 rounded-full mb-3 object-cover"/>
                                    <h3 className="font-semibold text-text-primary">{alumnus.name}</h3>
                                    <p className="text-sm text-text-secondary">Angkatan {alumnus.graduationYear}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'Riwayat Chat':
                const allUserChats = chats.filter(chat => chat.participants.some(p => p.id === user.id))
                    .sort((a, b) => {
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
            case 'Event Kampus':
                 return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">{activeMenu}</h2>
                         <div className="space-y-4">
                            {alumniEvents.length > 0 ? alumniEvents.map(ann => (
                                <div key={ann.id} className="border-l-4 border-unsri-yellow bg-unsri-yellow/10 p-4 rounded-r-lg">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-text-primary">{ann.title}</h3>
                                        <span className="text-xs text-text-secondary">{ann.date}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">{ann.category}</span>
                                    <p className="text-sm text-text-secondary mt-2">{ann.content}</p>
                                </div>
                            )) : (
                                <p className="text-text-secondary">Belum ada event terbaru untuk alumni.</p>
                            )}
                        </div>
                    </div>
                );
            default:
                return <div>Pilih menu di samping.</div>;
        }
    };

    return (
        <div className="h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Selamat datang kembali, {user.name}!</h1>
                <p className="text-text-secondary">Tetap terhubung dengan almamater dan rekan sejawat Anda.</p>
            </header>
            <div className="h-[calc(100%-6rem)]">
                {renderContent()}
            </div>
        </div>
    );
};

export default AlumniDashboard;
