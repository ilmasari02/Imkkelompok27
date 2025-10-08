import React, { useState } from 'react';
import { Role } from '../types';
import { UserGraduateIcon, UserTieIcon, BuildingIcon } from './icons';

interface LandingPageProps {
  onProceed: (role: Role, mode: 'login' | 'register') => void;
}

const roleOptions = [
  { role: Role.STUDENT, icon: <UserGraduateIcon className="w-12 h-12 text-unsri-yellow" /> },
  { role: Role.LECTURER, icon: <UserTieIcon className="w-12 h-12 text-unsri-yellow" /> },
  { role: Role.STAFF, icon: <BuildingIcon className="w-12 h-12 text-unsri-yellow" /> },
  { role: Role.ALUMNI, icon: <UserGraduateIcon className="w-12 h-12 text-unsri-yellow" /> },
  { role: Role.SERVER_ADMIN, icon: <UserTieIcon className="w-12 h-12 text-unsri-yellow" /> },
];


const LandingPage: React.FC<LandingPageProps> = ({ onProceed }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-poppins">
      <div className="max-w-4xl w-full bg-card rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          Selamat datang di <span className="text-unsri-yellow">UNSRI TALK</span> 👋
        </h1>
        <p className="text-text-secondary text-lg mb-8">Silakan pilih peran Anda untuk melanjutkan.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {roleOptions.map((option) => (
            <div
              key={option.role}
              onClick={() => handleSelectRole(option.role)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center ${
                selectedRole === option.role
                  ? 'border-unsri-yellow bg-unsri-yellow/10'
                  : 'border-border hover:border-unsri-yellow hover:bg-unsri-yellow/10'
              }`}
            >
              <div className="flex justify-center mb-3">{option.icon}</div>
              <h2 className="font-semibold text-text-primary text-sm md:text-base">{option.role}</h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
            onClick={() => selectedRole && onProceed(selectedRole, 'login')}
            disabled={!selectedRole}
            className="w-full md:w-auto flex-1 bg-unsri-yellow text-slate-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:bg-yellow-200 disabled:cursor-not-allowed hover:bg-yellow-500"
            >
            Masuk
            </button>
            <button
            onClick={() => selectedRole && onProceed(selectedRole, 'register')}
            disabled={!selectedRole}
            className="w-full md:w-auto flex-1 bg-card border-2 border-unsri-yellow text-unsri-yellow font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:border-yellow-200 disabled:text-yellow-200 disabled:cursor-not-allowed hover:bg-unsri-yellow/10"
            >
            Daftar Akun Baru
            </button>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;