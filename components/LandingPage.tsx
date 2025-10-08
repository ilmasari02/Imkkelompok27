import React from 'react';

interface LandingPageProps {
  onProceed: (mode: 'login' | 'register') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onProceed }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-poppins">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-lg p-8 md:p-12 text-center">
        <div className="flex justify-center mb-4">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C27.55 44 30.87 43.19 33.78 41.79C34.25 41.58 34.5 41.11 34.5 40.59V36.21C34.5 35.43 33.91 34.78 33.15 34.62C30.43 34.01 27.86 33.69 25.5 33.69C18.6 33.69 13.06 28.16 13.06 21.25C13.06 14.34 18.6 8.81 25.5 8.81C32.4 8.81 37.94 14.34 37.94 21.25V24C37.94 27.31 35.25 30 31.94 30H28.5C27.67 30 27 29.33 27 28.5V25.5C27 24.67 27.67 24 28.5 24H31.94C32.74 24 33.44 24.68 33.44 25.5V26.25C33.44 26.66 33.78 27 34.19 27H35.25C35.66 27 36 26.66 36 26.25V21.25C36 13.39 29.86 7 22.5 7C15.14 7 9 13.39 9 21.25C9 29.11 15.14 35.5 22.5 35.5C25.13 35.5 27.59 34.9 29.75 33.87" stroke="var(--color-unsri-yellow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
          Selamat Datang di <span className="text-unsri-yellow">UNSRI TALK</span>
        </h1>
        <p className="text-text-secondary text-lg mb-8">
          Portal Komunikasi & Konsultasi Terpadu Universitas Sriwijaya. Hubungkan diri Anda dengan seluruh sivitas akademika.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
            onClick={() => onProceed('login')}
            className="w-full md:w-auto flex-1 bg-unsri-yellow text-slate-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500"
            >
            Masuk ke Akun
            </button>
            <button
            onClick={() => onProceed('register')}
            className="w-full md:w-auto flex-1 bg-card border-2 border-unsri-yellow text-unsri-yellow font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-unsri-yellow/10"
            >
            Buat Akun Baru
            </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;