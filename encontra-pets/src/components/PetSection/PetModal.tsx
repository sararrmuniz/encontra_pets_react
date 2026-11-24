import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/lib/supabase';
import { formatBrazilianPhone, normalizeBrazilianPhone } from '@/lib/phone';
import { type PetItem } from './index';

interface PetModalProps {
  pet: PetItem | null;
  onClose: () => void;
}

export function PetModal({ pet, onClose }: PetModalProps) {
  const [nomeContato, setNomeContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadContactDetails = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) return;

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (!isActive) return;

        setNomeContato((currentName) => currentName || data.full_name || '');
        setTelefoneContato((currentPhone) => currentPhone || normalizeBrazilianPhone(data.phone || ''));
      } catch (error) {
        if (isActive) {
          setErrorMessage(
            error instanceof Error
              ? `Não foi possível preencher seus dados automaticamente: ${error.message}`
              : 'Não foi possível preencher seus dados automaticamente.',
          );
        }
      }
    };

    void loadContactDetails();

    return () => {
      isActive = false;
    };
  }, []);

  if (!pet) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        setErrorMessage('Você precisa estar logado para enviar uma mensagem. Faça login e tente novamente.');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        setErrorMessage('Você precisa estar logado para enviar uma mensagem. Faça login e tente novamente.');
        return;
      }

      const { error } = await supabase
        .from('pet_messages')
        .insert({
          pet_id: pet.id,
          owner_id: pet.owner_id,
          sender_id: user.id,
          sender_name: nomeContato.trim(),
          sender_phone: telefoneContato.trim(),
          message: mensagem.trim(),
        });

      if (error) throw error;

      setSuccessMessage('Mensagem enviada ao anunciante.');
      setNomeContato('');
      setTelefoneContato('');
      setMensagem('');
    } catch (error) {
      if (error instanceof Error && error.message === 'Auth session missing!') {
        setErrorMessage('Você precisa estar logado para enviar uma mensagem. Faça login e tente novamente.');
        return;
      }
      setErrorMessage(
        error instanceof Error
          ? `Não foi possível enviar a mensagem: ${error.message}`
          : 'Não foi possível enviar a mensagem.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Caixa da Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10">
        
        {/* Botão de Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow-md"
        >
          ✕
        </button>

        {/* Foto de Capa do Pet */}
        <div className="relative h-48 w-full bg-amber-100">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Conteúdo da Modal */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Cabeçalho: Nome e Badge de Status */}
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-2xl font-bold text-amber-950 font-display">
              {pet.name}
            </h2>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full text-white shadow-sm ${pet.statusBadge.bgColor}`}
            >
              {pet.statusBadge.label}
            </span>
          </div>

          {/* Localização */}
          <p className="text-sm font-medium text-amber-800/70 flex items-center gap-1 mb-4">
            <span>📍</span> {pet.location}
          </p>

          {/* Caixa com Descrição Detalhada */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 mb-6 text-sm text-amber-950 leading-relaxed">
            {pet.description}
          </div>

          {/* Formulário de Contato */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Envie uma mensagem ao anunciante
            </p>

            {(errorMessage || successMessage) && (
              <p
                role={errorMessage ? 'alert' : 'status'}
                className={`rounded-xl px-4 py-3 text-sm ${
                  errorMessage ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                }`}
              >
                {errorMessage || successMessage}
              </p>
            )}

            <div>
              <input
                type="text"
                placeholder="Seu Nome"
                aria-label="Seu nome"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Seu Telefone / WhatsApp"
                aria-label="Seu telefone ou WhatsApp"
                value={formatBrazilianPhone(telefoneContato)}
                onChange={(e) => setTelefoneContato(normalizeBrazilianPhone(e.target.value))}
                inputMode="numeric"
                autoComplete="tel"
                maxLength={15}
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
            </div>

            <div>
              <textarea
                placeholder="Escreva sua mensagem"
                aria-label="Mensagem para o anunciante"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                required
                rows={4}
                className="w-full resize-y px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 cursor-pointer px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all mt-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}