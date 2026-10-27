import { useState } from 'react';
import { type PetItem } from './index'; // Vamos exportar a tipagem do pet

interface PetModalProps {
  pet: PetItem | null;
  onClose: () => void;
}

export function PetModal({ pet, onClose }: PetModalProps) {
  const [nomeContato, setNomeContato] = useState('');
  const [telefoneContato, setTelefoneContato] = useState('');

  // Se nenhum pet estiver selecionado, não renderiza nada
  if (!pet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Mensagem enviada com sucesso para o pet ${pet.name}! Entraremos em contato.`);
    onClose();
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
          <p className="text-xs font-medium text-amber-800/70 flex items-center gap-1 mb-4">
            <span>📍</span> {pet.location}
          </p>

          {/* Caixa com Descrição Detalhada */}
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 mb-6 text-sm text-amber-950 leading-relaxed">
            {pet.description}
          </div>

          {/* Formulário de Contato */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Entre em contato sobre este anúncio
            </p>

            <div>
              <input
                type="text"
                placeholder="Seu Nome"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Seu Telefone / WhatsApp"
                value={telefoneContato}
                onChange={(e) => setTelefoneContato(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all mt-2"
            >
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}