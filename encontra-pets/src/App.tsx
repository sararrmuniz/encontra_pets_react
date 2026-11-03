import { useState } from 'react'
import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { AuthModal } from '@/components/AuthModal'
import { BannerCarousel } from '@/components/BannerCarousel'
import { Section } from '@/components/Section'
import { Footer } from './components/Footer'
import { PetSection } from './components/PetSection'

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <>
      <Header onOpenAuth={() => setIsAuthModalOpen(true)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <main>
        <Section>
          <Container>
            <BannerCarousel />
          </Container>
        </Section>
        <Section>
          <Container>
            <PetSection />
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  )
}
