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
  const [isCadastrarPetModalOpen, setIsCadastrarPetModalOpen] = useState(false)

  return (
    <>
      <Header
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCadastrarPet={() => setIsCadastrarPetModalOpen(true)}
      />
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
