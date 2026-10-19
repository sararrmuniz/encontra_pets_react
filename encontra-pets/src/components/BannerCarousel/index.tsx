import { useState, useEffect } from 'react';
import {
  HandHeart,
  Heart,
  MapPin,
  Megaphone,
  PawPrint,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import styles from './styles.module.css';

type BannerTheme = 'adoption' | 'lost' | 'found';

interface BannerAction {
  label: string;
  icon?: LucideIcon;
  variant: 'primary' | 'secondary';
}

interface BannerSlide {
  id: number;
  badge: string;
  badgeIcon: LucideIcon;
  theme: BannerTheme;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  actions: BannerAction[];
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    badge: 'Adoção Responsável',
    badgeIcon: Heart,
    theme: 'adoption',
    title: 'Encontre seu novo melhor amigo!',
    description: 'Centenas de cãezinhos e gatinhos estão ansiosos por um lar cheio de amor e carinho. Faça a diferença hoje mesmo.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Cão e gato esperando adoção',
    actions: [
      { label: 'Quero Adotar', icon: PawPrint, variant: 'primary' },
      { label: 'Como Funciona', variant: 'secondary' },
    ],
  },
  {
    id: 2,
    badge: 'Pets Perdidos',
    badgeIcon: TriangleAlert,
    theme: 'lost',
    title: 'Perdeu seu pet? Nós ajudamos!',
    description: 'Divulgue rapidamente o sumiço do seu companheiro para milhares de pessoas e protetores na sua região.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Gato esperando por seu tutor',
    actions: [
      { label: 'Cadastrar Pet Perdido', icon: Megaphone, variant: 'primary' },
      { label: 'Buscar Pets Perdidos', variant: 'secondary' },
    ],
  },
  {
    id: 3,
    badge: 'Reagrupamento',
    badgeIcon: HandHeart,
    theme: 'found',
    title: 'Encontrou um animalzinho na rua?',
    description: 'Cadastre o pet resgatado aqui para que a família dele possa encontrá-lo com segurança e facilidade.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
    imageAlt: 'Cão resgatado',
    actions: [
      { label: 'Registrar Pet Encontrado', icon: MapPin, variant: 'primary' },
    ],
  },
];

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNERS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  return (
    <section 
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className={styles.slidesWrapper}>
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          >
            <img className={styles.backgroundImage} src={banner.imageUrl} alt={banner.imageAlt} />
            <div className={styles.overlay} />
            <div className={styles.content}>
              <span className={`${styles.badge} ${styles[`badge_${banner.theme}`]}`}>
                <banner.badgeIcon size={14} aria-hidden="true" />
                {banner.badge}
              </span>
              <h2 className={styles.title}>{banner.title}</h2>
              <p className={styles.description}>{banner.description}</p>
              <div className={styles.actions}>
                {banner.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className={`${styles.actionBtn} ${
                      action.variant === 'primary'
                        ? `${styles.actionBtn_primary} ${styles[`actionBtn_${banner.theme}`]}`
                        : styles.actionBtn_secondary
                    }`}
                  >
                    {action.icon && <action.icon size={18} aria-hidden="true" />}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Navegação Lateral */}
      <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrev}>
        &#10094;
      </button>
      <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNext}>
        &#10095;
      </button>

      {/* Indicadores (Dots) */}
      <div className={styles.dotsContainer}>
        {BANNERS.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}