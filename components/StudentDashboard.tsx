
import React, { useState, useEffect } from 'react';
import { User, Chat, ConsultationCategory, ChatMessage, Announcement } from '../types';
import { CONSULTATION_SPECIALISTS } from '../constants';
import ChatWindow from './ChatWindow';
import CreateGroup from './CreateGroup';
import { ChevronLeftIcon, PlusCircleIcon } from './icons';

interface StudentDashboardProps {
  user: User;
  activeMenu: string;
  announcements: Announcement[];
  chats: Chat[];
  users: User[];
  onUpdateChats: (updatedChats: Chat[]) => void;
}

const consultationCategories = Object.values(ConsultationCategory);

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, activeMenu, announcements, chats, users, onUpdateChats }) => {
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [consultationStep, setConsultationStep] = useState<'select_category' | 'select_specialist'>('select_category');
    const [selectedCategory, setSelectedCategory] = useState<ConsultationCategory | null>(null);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    useEffect(() => {
        if (activeMenu !== 'Konsultasi Kampus') {
            setConsultationStep('select_category');
            setSelectedCategory(null);
        }
        setIsCreatingGroup(false);
    }, [activeMenu]);

    const privateChats = chats.filter(chat => chat.type === 'private' && chat.participants.some(p => p.id === user.id));
    const groupChats = chats.filter(chat => chat.type === 'group' && chat.participants.some(p => p.id === user.id));
    const allUserChats = [...privateChats, ...groupChats].sort((a, b) => {
        if (a.messages.length === 0) return 1;
        if (b.messages.length === 0) return -1;
        const lastMsgA = a.messages[a.messages.length - 1].timestamp;
        const lastMsgB = b.messages[b.messages.length - 1].timestamp;
        return lastMsgB.localeCompare(lastMsgA);
    });

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

    const handleCategorySelect = (category: ConsultationCategory) => {
        setSelectedCategory(category);
        setConsultationStep('select_specialist');
    };

    const handleStartConsultation = (specialist: User) => {
        const existingChat = chats.find(c =>
            c.type === 'private' &&
            c.participants.length === 2 &&
            c.participants.some(p => p.id === user.id) &&
            c.participants.some(p => p.id === specialist.id)
        );

        if (existingChat) {
            setSelectedChat(existingChat);
        } else {
            const newChat: Chat = {
                id: `chat${Date.now()}`,
                participants: [user, specialist],
                topic: selectedCategory!,
                type: 'private',
                messages: [
                    {
                        id: `m${Date.now()}`,
                        senderId: user.id,
                        text: `Halo, saya ingin berkonsultasi mengenai ${selectedCategory}.`,
                        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                        read: false
                    }
                ]
            };
            onUpdateChats([...chats, newChat]);
            setSelectedChat(newChat);
        }
        setConsultationStep('select_category');
        setSelectedCategory(null);
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
            case 'Chat Pribadi':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">{activeMenu}</h2>
                        <ul className="space-y-2">
                           {privateChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id);
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               return (
                                <li key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                                    <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-text-primary">{otherUser?.name}</h3>
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
            case 'Grup Chat':
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
                           {groupChats.map(chat => {
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
            case 'Riwayat Chat':
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
                               const sender = chat.participants.find(p => p.id === lastMessage?.senderId);
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
            case 'Konsultasi Kampus':
                if (consultationStep === 'select_specialist' && selectedCategory) {
                    const specialistIds = CONSULTATION_SPECIALISTS[selectedCategory];
                    const specialists = specialistIds.map(id => users.find(u => u.id === id)).filter((u): u is User => !!u);
                     return (
                         <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                            <div className="flex items-center mb-6">
                                <button onClick={() => setConsultationStep('select_category')} className="p-2 mr-2 -ml-2 text-text-secondary hover:text-unsri-yellow rounded-full hover:bg-input-bg transition-colors">
                                    <ChevronLeftIcon className="w-6 h-6" />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-text-primary">Pilih Konsultan</h2>
                                    <p className="text-text-secondary">Untuk kategori: <span className="font-semibold text-unsri-yellow">{selectedCategory}</span></p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {specialists.map(specialist => (
                                    <li key={specialist.id} className="flex items-center justify-between p-3 bg-input-bg/30 hover:bg-input-bg/70 rounded-lg">
                                        <div className="flex items-center">
                                            <img src={specialist.avatarUrl || `https://picsum.photos/seed/${specialist.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                            <div>
                                                <h3 className="font-semibold text-text-primary">{specialist.name}</h3>
                                                <p className="text-sm text-text-secondary">{specialist.role}{specialist.staffRole ? ` (${specialist.staffRole})` : ''}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleStartConsultation(specialist)} className="bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-yellow-500">
                                            Mulai
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                     );
                }
                return (
                     <div className="bg-card rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Pilih Topik Konsultasi</h2>
                        <p className="text-text-secondary mb-6">Pesan Anda akan diarahkan ke staf yang sesuai.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {consultationCategories.map(category => (
                                <div key={category} onClick={() => handleCategorySelect(category)} className="border border-border p-4 rounded-lg hover:border-unsri-yellow hover:bg-unsri-yellow/10 cursor-pointer transition-colors">
                                    <h3 className="font-semibold text-text-primary">{category}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Info & Pengumuman':
                return (
                    <div className="bg-card rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Informasi & Pengumuman</h2>
                         <div className="space-y-4">
                            {announcements.map(ann => (
                                <div key={ann.id} className="border-l-4 border-unsri-yellow bg-unsri-yellow/10 p-4 rounded-r-lg">
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
    };
    
    return (
        <div className="h-full">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Halo, {user.name}! 👋</h1>
                <p className="text-text-secondary">Ada yang ingin kamu tanyakan hari ini?</p>
            </header>
            <div className="h-[calc(100%-6rem)]">
              {renderContent()}
            </div>
        </div>
    );
};

export default StudentDashboard;
