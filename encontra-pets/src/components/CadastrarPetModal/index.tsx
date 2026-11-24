import { useState } from 'react';
import { type PetItem } from '../PetSection';
import { PawPrint } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DEFAULT_PET_IMAGE =
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';

interface CadastrarPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (newPet: PetItem) => void;
}

export function CadastrarPetModal({ isOpen, onClose, onAddPet }: CadastrarPetModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'dog' | 'cat'>('dog');
  const [status, setStatus] = useState<'adoption' | 'lost' | 'found'>('adoption');
  const [gender, setGender] = useState<'Macho' | 'Fêmea'>('Macho');
  const [breed, setBreed] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    let statusBadge = { label: 'Adoção', bgColor: 'bg-amber-600' };
    let actionButton = {
      text: 'Quero Conhecer',
      bgColor: 'bg-amber-50 hover:bg-amber-100',
      textColor: 'text-amber-950',
    };
    let genderBadgeBg = 'bg-amber-100 text-amber-900';

    if (status === 'lost') {
      statusBadge = { label: 'Perdido', bgColor: 'bg-red-600' };
      actionButton = {
        text: 'Ver Informações',
        bgColor: 'bg-red-50 hover:bg-red-100',
        textColor: 'text-red-700',
      };
      genderBadgeBg = 'bg-red-50 text-red-700';
    } else if (status === 'found') {
      statusBadge = { label: 'Encontrado', bgColor: 'bg-cyan-600' };
      actionButton = {
        text: 'Reconhece este Pet?',
        bgColor: 'bg-cyan-50 hover:bg-cyan-100',
        textColor: 'text-cyan-800',
      };
      genderBadgeBg = 'bg-cyan-50 text-cyan-800';
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) {
        setErrorMessage('Usuário não identificado, por favor faça login!');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) {
        if (userError) throw userError;
        setErrorMessage('Usuário não identificado, por favor faça login!');
        return;
      }
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('pets')
        .insert({
          owner_id: user.id,
          name: name.trim(),
          species: type,
          status,
          breed: breed.trim() || 'SRD',
          gender,
          location: location.trim(),
          image_url: image.trim() || null,
          description: description.trim(),
        })
        .select('id')
        .single();

      if (error) throw error;

      const newPet: PetItem = {
        id: data.id,
        owner_id: user.id,
        name: name.trim(),
        type,
        status,
        breed: breed.trim() || 'SRD',
        gender,
        location: location.trim(),
        image: image.trim() || DEFAULT_PET_IMAGE,
        description: description.trim(),
        statusBadge,
        actionButton,
        genderBadgeBg,
      };

      onAddPet(newPet);
      setName('');
      setType('dog');
      setStatus('adoption');
      setGender('Macho');
      setBreed('');
      setLocation('');
      setImage('');
      setDescription('');
      onClose();
    } catch (error) {
      if (error instanceof Error && error.message === 'Auth session missing!') {
        setErrorMessage('Usuário não identificado, por favor faça login!');
        return;
      }
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar o pet. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-900/10">
        
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors disabled:opacity-50"
        >
          ✕
        </button>

        {/* Cabeçalho */}
        <div className="p-6 pb-2 border-b border-amber-900/10">
        <div className="flex items-center justify-center gap-2 mb-2">
            <PawPrint className="h-6 w-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-amber-950 font-display">
            Cadastrar Novo Pet
          </h2>
        </div>
          <p className="text-sm text-center text-amber-800/70 mt-1">
            Preencha os dados do animal para publicar o anúncio no mural.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {errorMessage && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          
          {/* Nome e Espécie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Nome do Pet
              </label>
              <input
                type="text"
                placeholder="Ex: Thor, Mel..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Tipo de Animal
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'dog' | 'cat')}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="dog">Cão</option>
                <option value="cat">Gato</option>
              </select>
            </div>
          </div>

          {/* Status e Gênero */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Situação / Anúncio
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'adoption' | 'lost' | 'found')}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="adoption">Para Adoção</option>
                <option value="lost">Pet Perdido</option>
                <option value="found">Pet Encontrado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Gênero
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Macho' | 'Fêmea')}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
          </div>

          {/* Raça e Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Raça
              </label>
              <input
                type="text"
                placeholder="Ex: SRD, Pug, Siamês..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">
                Localização / Bairro
              </label>
              <input
                type="text"
                placeholder="Ex: Bairro Sta. Mônica, Uberlândia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* URL da Foto */}
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-1">
              URL da Imagem / Foto
            </label>
            <input
              type="url"
              placeholder="https://exemplo.com/foto-do-pet.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-bold text-amber-900 mb-1">
              Descrição / Detalhes
            </label>
            <textarea
              rows={3}
              placeholder="Descreva o temperamento, vacinas, local onde foi visto ou detalhes relevantes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-amber-950 placeholder-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all mt-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Anúncio'}
          </button>
        </form>
      </div>
    </div>
  );
}