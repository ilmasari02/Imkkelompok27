import React, { useState } from 'react';
import { Role } from '../types';
import { UserGraduateIcon, UserTieIcon, BuildingIcon } from './icons';

interface RegistrationPageProps {
  onRegister: (name: string, nim_nip: string, password: string, role: Role) => void;
  onBack: () => void;
}

const roleOptions = [
  { role: Role.STUDENT, icon: <UserGraduateIcon className="w-8 h-8 md:w-10 md:h-10 text-unsri-yellow" /> },
  { role: Role.LECTURER, icon: <UserTieIcon className="w-8 h-8 md:w-10 md:h-10 text-unsri-yellow" /> },
  { role: Role.STAFF, icon: <BuildingIcon className="w-8 h-8 md:w-10 md:h-10 text-unsri-yellow" /> },
  { role: Role.ALUMNI, icon: <UserGraduateIcon className="w-8 h-8 md:w-10 md:h-10 text-unsri-yellow" /> },
];

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onBack }) => {
  const [name, setName] = useState('');
  const [nimNip, setNimNip] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
        alert('Harap pilih peran Anda.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Konfirmasi kata sandi tidak cocok.');
        return;
    }
    if (name && nimNip && password) {
      onRegister(name, nimNip, password, selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Satu langkah lagi untuk terhubung di <span className="font-semibold text-unsri-yellow">UNSRI TALK</span>.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Pilih Peran Anda</label>
                <div className="grid grid-cols-4 gap-3">
                {roleOptions.map((option) => (
                    <div
                    key={option.role}
                    onClick={() => setSelectedRole(option.role)}
                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center ${
                        selectedRole === option.role
                        ? 'border-unsri-yellow bg-unsri-yellow/10'
                        : 'border-border hover:border-unsri-yellow hover:bg-unsri-yellow/10'
                    }`}
                    >
                    <div className="flex justify-center mb-1.5">{option.icon}</div>
                    <h2 className="font-semibold text-text-primary text-xs md:text-sm">{option.role}</h2>
                    </div>
                ))}
                </div>
            </div>

             <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm bg-input-bg text-text-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nimNip" className="block text-sm font-medium text-text-secondary">
                NIM / NIP
              </label>
              <div className="mt-1">
                <input
                  id="nimNip"
                  name="nimNip"
                  type="text"
                  autoComplete="off"
                  required
                  value={nimNip}
                  onChange={(e) => setNimNip(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm bg-input-bg text-text-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm bg-input-bg text-text-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary">
                Konfirmasi Kata Sandi
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm bg-input-bg text-text-primary"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-unsri-yellow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed"
                disabled={!selectedRole}
              >
                Buat Akun
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-text-secondary">Atau</span>
              </div>
            </div>

            <div className="mt-6">
                <button 
                  onClick={onBack}
                  className="w-full text-center py-2 px-4 border border-border rounded-md shadow-sm text-sm font-medium text-text-secondary bg-card hover:bg-input-bg"
                >
                  Kembali ke Halaman Awal
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;