import { PawPrint } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        onClose();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, phone },
        },
      });

      if (error) throw error;

      if (data.session) {
        onClose();
      } else {
        setFeedback({
          type: 'success',
          message: 'Conta criada. Verifique seu e-mail para confirmar o cadastro antes de entrar.',
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível concluir a autenticação.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10">
        
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors disabled:opacity-50"
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
          <p className="text-sm text-amber-800/70 mt-1">
            {mode === 'login'
              ? 'Acesse sua conta para gerenciar seus pets'
              : 'Crie sua conta para cadastrar pets e ajudar a comunidade'}
          </p>

          {/* Abas Alternadoras: Entrar / Cadastrar */}
          <div className="flex bg-amber-100/60 p-1 rounded-xl mt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-amber-950 shadow-sm'
                  : 'text-amber-900/70 hover:text-amber-950'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
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
          {feedback && (
            <p
              role={feedback.type === 'error' ? 'alert' : 'status'}
              className={`rounded-xl px-4 py-3 text-sm ${
                feedback.type === 'error'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {feedback.message}
            </p>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-1">
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
                <label className="block text-sm font-bold text-amber-900 mb-1">
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
            <label className="block text-sm font-bold text-amber-900 mb-1">
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
            <label className="block text-sm font-bold text-amber-900 mb-1">
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all mt-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar na Conta'
                : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}