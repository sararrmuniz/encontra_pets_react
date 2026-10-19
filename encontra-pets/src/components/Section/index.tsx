// components/Section/index.tsx
export function Section({ children }: { children: React.ReactNode }) {
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 w-full">{children}</section>
}