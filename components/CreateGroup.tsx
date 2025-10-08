
import React, { useState, useRef, useMemo } from 'react';
import { User, Chat } from '../types';
import { CameraIcon, ChevronLeftIcon, UsersIcon } from './icons';

interface CreateGroupProps {
    currentUser: User;
    allUsers: User[];
    onBack: () => void;
    onCreateGroup: (newGroup: Chat) => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ currentUser, allUsers, onBack, onCreateGroup }) => {
    const [step, setStep] = useState(1);
    const [groupName, setGroupName] = useState('');
    const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setGroupAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMemberToggle = (userId: string) => {
        const newSet = new Set(selectedMemberIds);
        if (newSet.has(userId)) {
            newSet.delete(userId);
        } else {
            newSet.add(userId);
        }
        setSelectedMemberIds(newSet);
    };

    const handleCreateGroup = () => {
        if (!groupName.trim() || selectedMemberIds.size === 0) return;

        const participants = [
            currentUser,
            ...allUsers.filter(u => selectedMemberIds.has(u.id))
        ];

        const newGroup: Chat = {
            id: `group${Date.now()}`,
            name: groupName.trim(),
            avatarUrl: groupAvatar || undefined,
            participants,
            type: 'group',
            messages: [],
        };

        onCreateGroup(newGroup);
    };

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user =>
            user.id !== currentUser.id &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allUsers, currentUser.id, searchTerm]);

    const renderStepOne = () => (
        <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Buat Grup Baru</h2>
            <p className="text-text-secondary mb-8 text-center">Atur nama dan ikon untuk grup Anda.</p>

            <div className="flex flex-col items-center mb-6">
                <div className="relative mb-2">
                    <img
                        src={groupAvatar || `https://picsum.photos/seed/${groupName || 'newgroup'}/128/128`}
                        alt="Group Avatar"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-1 right-1 bg-card p-2 rounded-full shadow-md hover:bg-input-bg"
                        aria-label="Ubah foto grup"
                    >
                        <CameraIcon className="w-5 h-5 text-text-primary" />
                    </button>
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="text-sm font-semibold text-unsri-yellow hover:underline">
                    Unggah Foto
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="groupName" className="block text-sm font-medium text-text-secondary">Nama Grup</label>
                    <input
                        id="groupName"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Contoh: Diskusi Tugas Akhir"
                        className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-input-bg text-text-primary focus:ring-unsri-yellow focus:border-unsri-yellow"
                    />
                </div>
                <button
                    onClick={() => setStep(2)}
                    disabled={!groupName.trim()}
                    className="w-full bg-unsri-yellow text-slate-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-yellow-200 disabled:cursor-not-allowed hover:bg-yellow-500"
                >
                    Lanjut
                </button>
            </div>
        </div>
    );

    const renderStepTwo = () => (
        <div className="h-full flex flex-col">
            <div className="flex items-center mb-4">
                <button onClick={() => setStep(1)} className="p-2 mr-2 -ml-2 text-text-secondary hover:text-unsri-yellow rounded-full hover:bg-input-bg transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Tambah Anggota</h2>
                    <p className="text-text-secondary">Pilih minimal 1 anggota untuk grup Anda.</p>
                </div>
            </div>
            
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama pengguna..."
                className="w-full border border-border rounded-full shadow-sm p-2 px-4 mb-4 bg-input-bg text-text-primary focus:ring-unsri-yellow focus:border-unsri-yellow"
            />

            <ul className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        <label className="flex items-center p-3 hover:bg-input-bg/50 rounded-lg cursor-pointer">
                            <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                            <div className="flex-1">
                                <p className="font-medium text-text-primary">{user.name}</p>
                                <p className="text-sm text-text-secondary">{user.role}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedMemberIds.has(user.id)}
                                onChange={() => handleMemberToggle(user.id)}
                                className="h-5 w-5 rounded text-unsri-yellow focus:ring-unsri-yellow border-border bg-input-bg"
                            />
                        </label>
                    </li>
                ))}
            </ul>

            <div className="mt-4 pt-4 border-t border-border">
                 <button
                    onClick={handleCreateGroup}
                    disabled={selectedMemberIds.size === 0}
                    className="w-full bg-unsri-yellow text-slate-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-yellow-200 disabled:cursor-not-allowed hover:bg-yellow-500 flex items-center justify-center gap-2"
                >
                    <UsersIcon className="w-5 h-5"/>
                    Buat Grup ({selectedMemberIds.size} Anggota)
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-card rounded-2xl shadow-lg p-6 h-full flex flex-col justify-center">
            {step === 1 ? renderStepOne() : renderStepTwo()}
        </div>
    );
};

export default CreateGroup;
