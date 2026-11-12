import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { AuthModal } from '@/components/AuthModal'
import { BannerCarousel } from '@/components/BannerCarousel'
import { Section } from '@/components/Section'
import { Footer } from './components/Footer'
import { PetSection } from './components/PetSection'

function getUserName(user: User | null): string | null {
  const fullName = user?.user_metadata.full_name
  return typeof fullName === 'string' && fullName.trim()
    ? fullName.trim()
    : null
}

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCadastrarPetModalOpen, setIsCadastrarPetModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let isMounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(Boolean(session?.user))
        setUserName(getUserName(session?.user ?? null))
        setAuthError('')
      },
    )

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) throw error
        if (isMounted) {
          setIsAuthenticated(Boolean(data.session?.user))
          setUserName(getUserName(data.session?.user ?? null))
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
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

  return (
    <>
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCadastrarPet={() => setIsCadastrarPetModalOpen(true)}
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

      <Footer />
    </>
  )
}
