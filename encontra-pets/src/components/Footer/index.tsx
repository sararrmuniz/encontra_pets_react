import { PawPrint } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-amber-950 text-amber-100/80 mt-12 py-10 border-t border-amber-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="contents sm:block">
          <div className="order-2 mb-1 flex items-center justify-center font-display text-2xl font-bold text-white sm:order-0 sm:justify-start">
            Encontra
            <span className="ml-0.5 flex items-center gap-1 text-brand-500">
              <PawPrint aria-hidden="true" className="-rotate-12 h-5 w-5" />
              Pets
            </span>
          </div>
          <p className="order-1 text-sm text-amber-200/60 sm:order-0">
            Conectando corações e reunindo famílias desde 2026.
          </p>
        </div>
        <div className="order-3 text-sm text-amber-200/60 sm:order-0">
          &copy; {currentYear} Encontra Pets. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}