export interface PetCardProps {
  name: string;
  breed: string; // Mantido na tipagem caso queira usar na busca
  gender: 'Macho' | 'Fêmea';
  location: string;
  image: string;
  description: string;
  statusBadge: {
    label: string;
    bgColor: string; // Ex: 'bg-emerald-500', 'bg-red-500', etc.
  };
  actionButton: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  genderBadgeBg?: string;
  onActionClick?: () => void;
}

export function PetCard({
  name,
  gender,
  location,
  image,
  description,
  statusBadge,
  actionButton,
  genderBadgeBg = 'bg-amber-100 text-amber-900',
  onActionClick,
}: PetCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-md transition-all group flex flex-col">
      {/* Imagem do Pet com Badge de Status Flutuante */}
      <div className="relative h-48 w-full overflow-hidden bg-amber-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm ${statusBadge.bgColor}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Informações do Card */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Cabeçalho do Card: Nome e Apenas o Gênero */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-amber-950">{name}</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${genderBadgeBg}`}>
              {gender}
            </span>
          </div>

          {/* Localização */}
          <p className="text-xs font-medium text-amber-800/70 mb-3">
            {location}
          </p>

          {/* Descrição */}
          <p className="text-xs text-amber-900/80 leading-relaxed mb-6 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Botão de Ação Dinâmico */}
        <button
          onClick={onActionClick}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-sm ${actionButton.bgColor} ${actionButton.textColor}`}
        >
          {actionButton.text}
        </button>
      </div>
    </div>
  );
}