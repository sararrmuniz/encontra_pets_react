import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PetCard, type PetCardProps } from './PetCard';
import { PetModal } from './PetModal';
import { CadastrarPetModal } from '../CadastrarPetModal';
import styles from './styles.module.css';
import { supabase } from '@/lib/supabase';

const DEFAULT_PET_IMAGE =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';

// Exportamos a interface para uso compartilhado
export interface PetItem extends PetCardProps {
  id: number | string;
  owner_id: string;
  type: 'dog' | 'cat';
  status: 'adoption' | 'lost' | 'found';
}

interface PetDatabaseRecord {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  status: 'adoption' | 'lost' | 'found';
  breed: string;
  gender: 'Macho' | 'Fêmea';
  location: string;
  image_url: string | null;
  description: string;
  owner_id: string;
}

function mapDatabasePet(pet: PetDatabaseRecord): PetItem {
  const appearance = {
    adoption: {
      statusBadge: { label: 'Adoção', bgColor: 'bg-amber-600' },
      actionButton: {
        text: 'Quero Conhecer',
        bgColor: 'bg-amber-50 hover:bg-amber-100',
        textColor: 'text-amber-950',
      },
      genderBadgeBg: 'bg-amber-100 text-amber-900',
    },
    lost: {
      statusBadge: { label: 'Perdido', bgColor: 'bg-red-600' },
      actionButton: {
        text: 'Ver Informações',
        bgColor: 'bg-red-50 hover:bg-red-100',
        textColor: 'text-red-700',
      },
      genderBadgeBg: 'bg-red-50 text-red-700',
    },
    found: {
      statusBadge: { label: 'Encontrado', bgColor: 'bg-cyan-600' },
      actionButton: {
        text: 'Reconhece este Pet?',
        bgColor: 'bg-cyan-50 hover:bg-cyan-100',
        textColor: 'text-cyan-800',
      },
      genderBadgeBg: 'bg-cyan-50 text-cyan-800',
    },
  }[pet.status];

  return {
    id: pet.id,
    owner_id: pet.owner_id,
    name: pet.name,
    type: pet.species,
    status: pet.status,
    breed: pet.breed,
    gender: pet.gender,
    location: pet.location,
    image: pet.image_url || DEFAULT_PET_IMAGE,
    description: pet.description,
    ...appearance,
  };
}

type FilterCategory = 'all' | 'adoption' | 'lost' | 'found';

interface PetSectionProps {
  isCadastrarPetModalOpen: boolean;
  onCloseCadastrarPet: () => void;
}

export function PetSection({
  isCadastrarPetModalOpen,
  onCloseCadastrarPet,
}: PetSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pets, setPets] = useState<PetItem[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState('');
  const [reloadPetsKey, setReloadPetsKey] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Estado que armazena o pet selecionado para abrir a modal
  const [selectedPet, setSelectedPet] = useState<PetItem | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadPets = async () => {
      setIsLoadingPets(true);
      setPetsError('');

      try {
        const { data, error } = await supabase
          .from('pets')
          .select('id, owner_id, name, species, status, breed, gender, location, image_url, description')
          .is('resolved_at', null)
          .order('created_at', { ascending: false });

        if (!isActive) return;

        if (error) {
          setPetsError(`Não foi possível carregar os anúncios: ${error.message}`);
        } else {
          const loadedPets = data.map((pet: PetDatabaseRecord) => mapDatabasePet(pet));
          setPets((currentPets) => {
            const currentPetIds = new Set(currentPets.map((pet) => pet.id));
            return [
              ...currentPets,
              ...loadedPets.filter((pet) => !currentPetIds.has(pet.id)),
            ];
          });
        }
      } catch (error) {
        if (isActive) {
          setPetsError(
            `Não foi possível carregar os anúncios: ${
              error instanceof Error ? error.message : 'erro desconhecido.'
            }`,
          );
        }
      } finally {
        if (isActive) setIsLoadingPets(false);
      }
    };

    void loadPets();

    return () => {
      isActive = false;
    };
  }, [reloadPetsKey]);

  const filteredPets = pets.filter((pet) => {
    const matchesCategory = activeFilter === 'all' || pet.status === activeFilter;
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const scrollCarousel = (direction: 'previous' | 'next') => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction === 'next' ? carousel.clientWidth : -carousel.clientWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8 relative">
      {/* Cabeçalho e Pesquisa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-amber-950 font-display">
            Animais Cadastrados
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

      {/* Lista de cards */}
      {isLoadingPets ? (
        <p role="status" className="py-12 text-center text-amber-900">
          Carregando anúncios...
        </p>
      ) : petsError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p role="alert" className="mb-4 text-sm text-red-700">
            {petsError}
          </p>
          <button
            type="button"
            onClick={() => setReloadPetsKey((currentKey) => currentKey + 1)}
            className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-800 transition-colors hover:bg-red-200"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredPets.length > 0 ? (
        filteredPets.length > 4 ? (
          <div>
            <div className="flex justify-end gap-2 mb-3">
              <button
                type="button"
                onClick={() => scrollCarousel('previous')}
                aria-label="Ver animais anteriores"
                className="p-2 rounded-full border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('next')}
                aria-label="Ver próximos animais"
                className="p-2 rounded-full border border-amber-200 text-amber-900 hover:bg-amber-100 transition-colors"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            <div
              ref={carouselRef}
              className={styles.carouselTrack}
              role="region"
              aria-label="Animais cadastrados"
              aria-roledescription="carrossel"
            >
              {filteredPets.map((pet) => (
                <div key={pet.id} className={styles.carouselCard}>
                  <PetCard
                    name={pet.name}
                    breed={pet.breed}
                    gender={pet.gender}
                    location={pet.location}
                    image={pet.image}
                    description={pet.description}
                    statusBadge={pet.statusBadge}
                    actionButton={pet.actionButton}
                    genderBadgeBg={pet.genderBadgeBg}
                    onActionClick={() => setSelectedPet(pet)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
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
                onActionClick={() => setSelectedPet(pet)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-amber-50/50 rounded-2xl border border-dashed border-amber-200">
          <p className="text-amber-900 font-medium">
            Nenhum pet encontrado com os filtros selecionados.
          </p>
        </div>
      )}

      {/* Renderização condicional da Modal */}
      <PetModal
        key={selectedPet?.id ?? 'no-pet'}
        pet={selectedPet}
        onClose={() => setSelectedPet(null)}
      />
      <CadastrarPetModal
        isOpen={isCadastrarPetModalOpen}
        onClose={onCloseCadastrarPet}
        onAddPet={(newPet) => setPets(currentPets => [newPet, ...currentPets])}
      />
    </section>
  );
}