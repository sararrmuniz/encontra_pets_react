import { Container } from '@/components/Container'
import { Header } from '@/components/Header'
import { BannerCarousel } from '@/components/BannerCarousel'
import { Section } from '@/components/Section'
import { Footer } from './components/Footer'
import { PetSection } from './components/PetSection'

export default function App() {
  return (
    <>
      <Header />

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
