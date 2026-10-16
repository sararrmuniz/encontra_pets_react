import { useState } from 'react'
import { Menu, PawPrint, X } from 'lucide-react'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-40 border-b border-amber-100/60 bg-brand-header shadow-sm">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <a href="#home" className="group flex items-center gap-3" aria-label="Encontra Pets — início">
                    <span className="flex items-center font-display text-3xl font-extrabold tracking-tight text-brand-500 sm:text-4xl">
                        Encontra
                        <span className="ml-0.5 flex items-center gap-1 text-brand-700">
                            <PawPrint aria-hidden="true" className="-rotate-12 h-7 w-7 sm:h-8 sm:w-8" />
                            Pets
                        </span>
                    </span>
                </a>

                <nav
                    aria-label="Navegação principal"
                    className="hidden items-center space-x-8 text-lg font-medium text-gray-700 md:flex"
                >
                    <a href="#home" className="font-semibold text-brand-600 transition hover:text-brand-700">
                        Home
                    </a>
                    <a href="#sobre" className="transition hover:text-brand-600">
                        About
                    </a>
                    <a href="#contato" className="transition hover:text-brand-600">
                        Contact
                    </a>
                </nav>

                <button
                    type="button"
                    aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                    className="text-2xl text-brand-700 hover:text-brand-500 focus:outline-none md:hidden"
                >
                    {isMobileMenuOpen ? (
                        <X aria-hidden="true" className="h-6 w-6" />
                    ) : (
                        <Menu aria-hidden="true" className="h-6 w-6" />
                    )}
                </button>
            </div>

            <nav
                id="mobile-menu"
                aria-label="Navegação móvel"
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} space-y-3 border-t border-amber-200/50 bg-brand-header px-4 pt-3 pb-5 md:hidden`}
            >
                <a
                    href="#home"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-semibold text-brand-600"
                >
                    Home
                </a>
                <a
                    href="#sobre"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg text-gray-700 hover:text-brand-600"
                >
                    About
                </a>
                <a
                    href="#contato"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg text-gray-700 hover:text-brand-600"
                >
                    Contact
                </a>
            </nav>
        </header>
    )
}
