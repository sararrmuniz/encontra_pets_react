import { useState } from 'react';
import { PetCard,type  PetCardProps } from './PetCard';
import { PetModal } from './PetModal';

// Exportamos a interface para uso compartilhado
export interface PetItem extends PetCardProps {
  id: number;
  type: 'dog' | 'cat';
  status: 'adoption' | 'lost' | 'found';
}

const PETS_MOCK: PetItem[] = [
  {
    id: 1,
    name: 'Mel',
    type: 'dog',
    status: 'adoption',
    breed: 'Bulldog Francês',
    gender: 'Fêmea',
    location: 'Uberlândia, MG',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    description: 'Cão Golden Mix - 1 ano • Já castrada, vacinada e vermifugada. Muito carinhosa!',
    statusBadge: { label: 'Adoção', bgColor: 'bg-amber-600' },
    actionButton: {
      text: 'Quero Conhecer',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      textColor: 'text-amber-950',
    },
    genderBadgeBg: 'bg-amber-100 text-amber-900',
  },
  {
    id: 2,
    name: 'Bob',
    type: 'dog',
    status: 'lost',
    breed: 'Pug',
    gender: 'Macho',
    location: 'Bairro Santa Mônica',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600',
    description: 'Sumiu na tarde de ontem perto da praça. Estava usando coleira azul e é muito dócil.',
    statusBadge: { label: 'Perdido', bgColor: 'bg-red-600' },
    actionButton: {
      text: 'Ver Informações',
      bgColor: 'bg-red-50 hover:bg-red-100',
      textColor: 'text-red-700',
    },
    genderBadgeBg: 'bg-red-50 text-red-700',
  },
  {
    id: 3,
    name: 'Gatinho SRD',
    type: 'cat',
    status: 'found',
    breed: 'SRD',
    gender: 'Macho',
    location: 'Centro, Uberlândia',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    description: 'Encontrado próximo à rotatória. Está seguro em abrigo temporário aguardando o dono.',
    statusBadge: { label: 'Encontrado', bgColor: 'bg-cyan-600' },
    actionButton: {
      text: 'Reconhece este Pet?',
      bgColor: 'bg-cyan-50 hover:bg-cyan-100',
      textColor: 'text-cyan-800',
    },
    genderBadgeBg: 'bg-cyan-50 text-cyan-800',
  },
  {
    id: 4,
    name: 'Thor',
    type: 'dog',
    status: 'adoption',
    breed: 'Corgi',
    gender: 'Macho',
    location: 'Uberlândia, MG',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600',
    description: 'Porte médio, muito ativo e protetor. Ideal para casas com quintal espaçoso.',
    statusBadge: { label: 'Adoção', bgColor: 'bg-amber-600' },
    actionButton: {
      text: 'Quero Conhecer',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      textColor: 'text-amber-950',
    },
    genderBadgeBg: 'bg-amber-100 text-amber-900',
  },
];

type FilterCategory = 'all' | 'adoption' | 'lost' | 'found';

export function PetSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado que armazena o pet selecionado para abrir a modal
  const [selectedPet, setSelectedPet] = useState<PetItem | null>(null);

  const filteredPets = PETS_MOCK.filter((pet) => {
    const matchesCategory = activeFilter === 'all' || pet.status === activeFilter;
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-8 relative">
      {/* Cabeçalho e Pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-amber-950 font-display">
            Mural de Animais
          </h2>
          <p className="text-sm text-amber-800/70">
            Encontre o seu próximo amigo ou ajude um pet a voltar para casa.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por nome, raça, bairro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-9 rounded-lg border border-amber-200 bg-white text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm transition-all"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-800/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Botões de Filtro */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-amber-900/10 pb-4">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'all' ? 'bg-amber-900 text-white shadow-sm' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          Todos os Pets
        </button>
        <button
          onClick={() => setActiveFilter('adoption')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'adoption' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          Para Adoção
        </button>
        <button
          onClick={() => setActiveFilter('lost')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'lost' ? 'bg-red-600 text-white shadow-sm' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          Perdidos
        </button>
        <button
          onClick={() => setActiveFilter('found')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === 'found' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-amber-100/60 text-amber-900 hover:bg-amber-200/60'
          }`}
        >
          Encontrados
        </button>
      </div>

      {/* Grid de Cards */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              name={pet.name}
              breed={pet.breed}
              gender={pet.gender}
              location={pet.location}
              image={pet.image}
              description={pet.description}
              statusBadge={pet.statusBadge}
              actionButton={pet.actionButton}
              genderBadgeBg={pet.genderBadgeBg}
              // Ao clicar no botão do card, definimos o pet ativo para abrir a modal
              onActionClick={() => setSelectedPet(pet)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
          <p className="text-amber-900 font-medium">
            Nenhum pet encontrado com os filtros selecionados.
          </p>
        </div>
      )}

      {/* Renderização condicional da Modal */}
      <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
    </section>
  );
}