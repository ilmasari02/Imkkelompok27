
import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, ChatMessage } from '../types';
import { SendIcon, PaperclipIcon, UsersIcon, ChevronLeftIcon, SmileIcon, FileIcon, CameraIcon, UserPlusIcon, Edit2Icon } from './icons';

interface ChatWindowProps {
    chat: Chat;
    currentUser: User;
    onBack: () => void;
    allUsers: User[];
    onUpdateChat: (updatedChat: Chat) => void;
}

const EMOJIS = ['😀', '😂', '👍', '❤️', '🎉', '🤔', '🙏', '🔥'];

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, onBack, allUsers, onUpdateChat }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [view, setView] = useState<'chat' | 'info'>('chat');
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(chat.name || '');
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const groupAvatarInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const otherUser = chat.type === 'private' ? chat.participants.find(p => p.id !== currentUser.id) : null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat.messages, view]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    const handleSendMessage = (messageContent: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => {
        const newMessage: ChatMessage = {
            ...messageContent,
            id: `m${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            read: false, // Should be false initially
        };
        const updatedChat = { ...chat, messages: [...chat.messages, newMessage] };
        onUpdateChat(updatedChat);
    };

    const handleSendMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        handleSendMessage({ senderId: currentUser.id, text: newMessage });
        setNewMessage('');
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            handleSendMessage({
                senderId: currentUser.id,
                text: '',
                file: { name: file.name, type: file.type }
            });
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleGroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedChat = { ...chat, avatarUrl: reader.result as string };
                onUpdateChat(updatedChat);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMember = (userToAdd: User) => {
        if (chat.participants.some(p => p.id === userToAdd.id)) return;
        const updatedParticipants = [...chat.participants, userToAdd];
        const updatedChat = { ...chat, participants: updatedParticipants };
        onUpdateChat(updatedChat);
    };

    const handleNameChange = () => {
        if (!editedName.trim() || editedName.trim() === chat.name) {
            setIsEditingName(false);
            return;
        };
        const updatedChat = { ...chat, name: editedName.trim() };
        onUpdateChat(updatedChat);
        setIsEditingName(false);
    };

    const getSender = (senderId: string) => {
        return allUsers.find(p => p.id === senderId);
    };

    if (view === 'info' && chat.type === 'group') {
        const potentialMembers = allUsers.filter(u => !chat.participants.some(p => p.id === u.id));

        return (
             <div className="bg-card rounded-2xl shadow-lg h-full flex flex-col">
                <header className="p-4 border-b border-border flex items-center">
                    <button onClick={() => setView('chat')} className="p-2 mr-2 text-text-secondary hover:text-unsri-yellow rounded-full hover:bg-input-bg transition-colors">
                        <ChevronLeftIcon className="w-6 h-6"/>
                    </button>
                    <h2 className="font-semibold text-text-primary text-lg">Info Grup</h2>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative mb-4">
                            <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/128/128`} alt="Group Avatar" className="w-32 h-32 rounded-full object-cover"/>
                            <input type="file" ref={groupAvatarInputRef} onChange={handleGroupAvatarChange} accept="image/*" className="hidden"/>
                            <button onClick={() => groupAvatarInputRef.current?.click()} className="absolute bottom-1 right-1 bg-card p-2 rounded-full shadow-md hover:bg-input-bg">
                                <CameraIcon className="w-5 h-5 text-text-primary"/>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            {isEditingName ? (
                                <input 
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    onBlur={handleNameChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNameChange()}
                                    className="text-xl font-bold text-text-primary bg-input-bg rounded-lg p-1 w-full text-center"
                                    autoFocus
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-text-primary">{chat.name}</h2>
                            )}
                            <button onClick={() => setIsEditingName(prev => !prev)} className="p-1 text-text-secondary hover:text-unsri-yellow">
                                {isEditingName ? 'Batal' : <Edit2Icon className="w-4 h-4" />}
                            </button>
                        </div>

                        <p className="text-text-secondary">{chat.participants.length} anggota</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-semibold text-text-primary mb-3 px-1">{chat.participants.length} Anggota</h3>
                        <ul className="space-y-2">
                            {chat.participants.map(member => (
                                <li key={member.id} className="flex items-center p-2 hover:bg-input-bg/50 rounded-lg">
                                    <img src={member.avatarUrl || `https://picsum.photos/seed/${member.id}/40/40`} alt={member.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                                    <div>
                                        <p className="font-medium text-text-primary">{member.name}</p>
                                        <p className="text-sm text-text-secondary">{member.role}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-text-primary mb-3 px-1">Tambah Anggota</h3>
                        <ul className="space-y-2">
                            {potentialMembers.map(user => (
                                <li key={user.id} className="flex items-center justify-between p-2 hover:bg-input-bg/50 rounded-lg">
                                    <div className="flex items-center">
                                        <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} className="w-10 h-10 rounded-full mr-3 object-cover"/>
                                        <div>
                                            <p className="font-medium text-text-primary">{user.name}</p>
                                            <p className="text-sm text-text-secondary">{user.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAddMember(user)} className="p-2 text-text-secondary hover:text-unsri-yellow rounded-full hover:bg-input-bg transition-colors">
                                        <UserPlusIcon className="w-6 h-6"/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="bg-card rounded-2xl shadow-lg h-full flex flex-col">
            <header className="p-4 border-b border-border flex items-center">
                <button onClick={onBack} className="p-2 mr-2 text-text-secondary hover:text-unsri-yellow rounded-full hover:bg-input-bg transition-colors">
                    <ChevronLeftIcon className="w-6 h-6"/>
                </button>
                 {chat.type === 'group' ? (
                    <img src={chat.avatarUrl || `https://picsum.photos/seed/${chat.id}/40/40`} alt="Avatar" className="w-10 h-10 rounded-full mr-4 object-cover"/>
                 ) : (
                    <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/40/40`} alt="Avatar" className="w-10 h-10 rounded-full mr-4 object-cover"/>
                 )}
                <div 
                    onClick={() => chat.type === 'group' && setView('info')} 
                    className={chat.type === 'group' ? 'cursor-pointer' : ''}
                >
                    <h2 className="font-semibold text-text-primary">{chat.type === 'group' ? chat.name : otherUser?.name}</h2>
                    {chat.type === 'group' ? (
                        <p className="text-sm text-text-secondary">{chat.participants.length} anggota</p>
                    ) : (
                        <p className="text-sm text-text-secondary">{otherUser?.role}</p>
                    )}
                </div>
            </header>
            <main className="flex-1 p-6 overflow-y-auto space-y-1">
                {chat.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const sender = getSender(message.senderId);
                    
                    const bubbleClass = isCurrentUser
                        ? 'bg-unsri-yellow-light self-end rounded-br-none'
                        : 'bg-input-bg self-start rounded-bl-none border border-border';

                    return (
                        <div key={message.id} className={`flex flex-col mb-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                            {chat.type === 'group' && !isCurrentUser && (
                                <p className="text-xs text-text-secondary mb-1 ml-2">{sender?.name}</p>
                            )}
                            <div className={`p-3 rounded-xl max-w-md ${bubbleClass}`}>
                                {message.file ? (
                                    <div className="flex items-center space-x-2">
                                        <FileIcon className="w-6 h-6 text-text-primary flex-shrink-0" />
                                        <span className="text-sm text-text-primary font-medium truncate">{message.file.name}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-text-primary whitespace-pre-wrap">{message.text}</p>
                                )}
                                <p className="text-xs text-text-secondary/70 mt-1 text-right">{message.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
                 <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t border-border bg-card">
                <form onSubmit={handleSendMessageSubmit} className="flex items-center space-x-2 relative">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-text-secondary hover:text-unsri-yellow hover:bg-input-bg rounded-full transition-colors">
                        <PaperclipIcon className="w-6 h-6"/>
                    </button>
                    <div ref={emojiPickerRef}>
                         {showEmojiPicker && (
                            <div className="absolute bottom-14 bg-card shadow-lg rounded-xl p-2 grid grid-cols-4 gap-2 border border-border">
                                {EMOJIS.map(emoji => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setNewMessage(prev => prev + emoji)}
                                        className="text-2xl p-1 rounded-lg hover:bg-input-bg"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="p-2 text-text-secondary hover:text-unsri-yellow hover:bg-input-bg rounded-full transition-colors">
                            <SmileIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Ketik pesan Anda..."
                        className="flex-1 bg-input-bg rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-unsri-yellow text-text-primary"
                    />
                    <button type="submit" className="bg-unsri-yellow p-2 rounded-full text-white hover:bg-yellow-500 transition-colors">
                        <SendIcon className="w-5 h-5 text-slate-800"/>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default ChatWindow;
