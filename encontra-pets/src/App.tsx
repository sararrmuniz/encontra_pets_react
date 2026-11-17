import { lazy, Suspense, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { AuthModal } from '@/components/AuthModal'
import { BannerCarousel } from '@/components/BannerCarousel'
import { Section } from '@/components/Section'
import { Footer } from './components/Footer'
import { PetSection } from './components/PetSection'

const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then(({ ProfilePage }) => ({ default: ProfilePage })),
)

function getUserName(user: User | null): string | null {
  const fullName = user?.user_metadata.full_name
  return typeof fullName === 'string' && fullName.trim()
    ? fullName.trim()
    : null
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCadastrarPetModalOpen, setIsCadastrarPetModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let isMounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(Boolean(session?.user))
        setUserName(getUserName(session?.user ?? null))
        setIsAuthLoading(false)
        setAuthError('')
      },
    )

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error
        if (isMounted) {
          setIsAuthenticated(Boolean(data.session?.user))
          setUserName(getUserName(data.session?.user ?? null))
          setIsAuthLoading(false)
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setIsAuthLoading(false)
          setAuthError(
            error instanceof Error
              ? error.message
              : 'Não foi possível verificar a sessão.',
          )
        }
      })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const handleOpenCadastrarPet = () => {
    setIsCadastrarPetModalOpen(true)
    if (location.pathname !== '/') navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCadastrarPet={handleOpenCadastrarPet}
        isAuthenticated={isAuthenticated}
        userName={userName}
        onSignOut={handleSignOut}
      />
      {authError && (
        <p role="alert" className="bg-red-50 px-4 py-2 text-center text-sm text-red-700">
          Não foi possível verificar a sessão: {authError}
        </p>
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <div className="flex flex-1 flex-col">
        <Suspense fallback={<main className="py-12 text-center text-amber-900">Carregando página...</main>}>
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Section>
                    <Container>
                      <BannerCarousel
                        onOpenCadastrarPet={() => setIsCadastrarPetModalOpen(true)}
                      />
                    </Container>
                  </Section>
                  <Section>
                    <Container>
                      <PetSection
                        isCadastrarPetModalOpen={isCadastrarPetModalOpen}
                        onCloseCadastrarPet={() => setIsCadastrarPetModalOpen(false)}
                      />
                    </Container>
                  </Section>
                </main>
              }
            />
            <Route
              path="/perfil"
              element={
                isAuthLoading ? (
                  <main className="py-12 text-center text-amber-900">Verificando sessão...</main>
                ) : isAuthenticated ? (
                  <ProfilePage onProfileNameChange={setUserName} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  )
}
