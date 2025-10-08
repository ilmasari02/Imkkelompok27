import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { CheckCircleIcon } from './icons';

interface ProfileSettingsProps {
    user: User;
    onUpdate: (user: User) => void;
}

const SuccessPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-card rounded-2xl shadow-lg p-8 text-center flex flex-col items-center transform transition-transform duration-300 scale-100">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-text-primary">Berhasil!</h2>
            <p className="text-text-secondary">Perubahan berhasil disimpan.</p>
        </div>
    </div>
);


const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState<string | undefined>(user.avatarUrl);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const handleAvatarChange = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            alert('Konfirmasi password tidak cocok!');
            return;
        }

        const updatedUser: User = {
            ...user,
            name,
            email,
            avatarUrl: avatar,
        };

        onUpdate(updatedUser);
        setShowSuccess(true);
    };

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <div>
            {showSuccess && <SuccessPopup />}
             <header className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">Pengaturan Akun</h1>
                <p className="text-text-secondary">Kelola informasi profil dan kredensial Anda.</p>
            </header>
            <div className="bg-card rounded-2xl shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex items-center space-x-6">
                        <img src={avatar || `https://picsum.photos/seed/${user.id}/100/100`} alt="User Avatar" className="w-24 h-24 rounded-full object-cover"/>
                        <div>
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/gif"
                                className="hidden"
                            />
                            <button 
                                type="button" 
                                onClick={handleAvatarChange}
                                className="bg-input-bg text-text-primary font-semibold py-2 px-4 rounded-lg text-sm hover:bg-border"
                            >
                                Ganti Foto
                            </button>
                            <p className="text-xs text-text-secondary mt-2">JPG, GIF atau PNG. Ukuran maks. 800K.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary">Nama Lengkap</label>
                            <input type="text" id="fullName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow bg-input-bg text-text-primary"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow bg-input-bg text-text-primary"/>
                        </div>
                         <div>
                            <label htmlFor="nim" className="block text-sm font-medium text-text-secondary">NIM / NIP</label>
                            <input type="text" id="nim" value={user.nim_nip} disabled className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 bg-input-bg/50 cursor-not-allowed text-text-secondary"/>
                        </div>
                        <div></div>
                         <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">Kata Sandi Baru</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Biarkan kosong jika tidak ingin ganti" className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow bg-input-bg text-text-primary"/>
                        </div>
                         <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">Konfirmasi Kata Sandi</label>
                            <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-border rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow bg-input-bg text-text-primary"/>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6 flex justify-end space-x-3">
                         <button type="button" className="bg-card text-text-secondary font-semibold py-2 px-4 rounded-lg border border-border hover:bg-input-bg">
                            Batal
                        </button>
                        <button type="submit" className="bg-unsri-yellow text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500">
                            Simpan Perubahan
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
