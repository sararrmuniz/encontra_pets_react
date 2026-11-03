import { PawPrint } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  // Estados dos formulários
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      alert(`Login realizado com sucesso para: ${email}`);
    } else {
      alert(`Conta criada com sucesso para: ${name}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
        >
          ✕
        </button>

        {/* Cabeçalho do Modal */}
        <div className="p-6 pb-0 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PawPrint className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-amber-950 font-display">
              {mode === 'login' ? 'Entrar na Conta' : 'Criar Conta'}
            </h2>
          </div>
          <p className="text-xs text-amber-800/70 mt-1">
            {mode === 'login'
              ? 'Acesse sua conta para gerenciar seus pets'
              : 'Crie sua conta para cadastrar pets e ajudar a comunidade'}
          </p>

          {/* Abas Alternadoras: Entrar / Cadastrar */}
          <div className="flex bg-amber-100/60 p-1 rounded-xl mt-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              Criar Conta
            </button>
          </div>
        </div>

        {/* Formulário Dinâmico */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="(34) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all mt-2"
          >
            {mode === 'login' ? 'Entrar na Conta' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}