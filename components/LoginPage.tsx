import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (nim_nip: string, password: string) => void;
  onBack: () => void;
  prefilledNimNip?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack, prefilledNimNip }) => {
  const [nimNip, setNimNip] = useState(prefilledNimNip || '');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nimNip && password) {
      onLogin(nimNip, password);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
          Masuk ke Akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Selamat datang kembali! Silakan masukkan kredensial Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nimNip" className="block text-sm font-medium text-text-secondary">
                NIM / NIP
              </label>
              <div className="mt-1">
                <input
                  id="nimNip"
                  name="nimNip"
                  type="text"
                  autoComplete="username"
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm bg-input-bg text-text-primary"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-unsri-yellow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Masuk
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
        <p className="mt-8 text-center text-sm text-text-secondary">
          Dikelola oleh Universitas Sriwijaya
        </p>
      </div>
    </div>
  );
};

export default LoginPage;