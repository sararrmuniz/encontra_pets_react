import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { PawPrint, Pencil, RotateCcw, Save, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type PetSpecies = 'dog' | 'cat'
type PetStatus = 'adoption' | 'lost' | 'found'
type PetGender = 'Macho' | 'Fêmea'

interface ProfileRecord {
  full_name: string
  phone: string
}

interface ProfilePet {
  id: string
  name: string
  species: PetSpecies
  status: PetStatus
  breed: string
  gender: PetGender
  location: string
  image_url: string | null
  description: string
  resolved_at: string | null
  created_at: string
}

type PetDraft = Pick<
  ProfilePet,
  'name' | 'species' | 'status' | 'breed' | 'gender' | 'location' | 'image_url' | 'description'
>

interface ProfilePageProps {
  onProfileNameChange: (name: string) => void
}

const EMPTY_PET_DRAFT: PetDraft = {
  name: '',
  species: 'dog',
  status: 'adoption',
  breed: '',
  gender: 'Macho',
  location: '',
  image_url: '',
  description: '',
}

const PET_STATUS_LABELS: Record<PetStatus, string> = {
  adoption: 'Para adoção',
  lost: 'Perdido',
  found: 'Encontrado',
}

const PET_STATUS_COLORS: Record<PetStatus, string> = {
  adoption: 'bg-amber-600', // Laranja
  lost: 'bg-red-600',       // Vermelho
  found: 'bg-cyan-600',     // Azul claro
}

function getResolutionAction(status: PetStatus): string {
  if (status === 'lost') return 'Marcar como reencontrado'
  if (status === 'found') return 'Marcar como devolvido ao tutor'
  return 'Marcar como adotado'
}

function getResolutionLabel(status: PetStatus): string {
  if (status === 'lost') return 'Reencontrado'
  if (status === 'found') return 'Devolvido ao tutor'
  return 'Adotado'
}

function getStatusBadgeColor(pet: ProfilePet): string {
  if (pet.resolved_at) return 'bg-green-600'
  return PET_STATUS_COLORS[pet.status]
}

export function ProfilePage({ onProfileNameChange }: ProfilePageProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [pets, setPets] = useState<ProfilePet[]>([])
  const [editingPetId, setEditingPetId] = useState<string | null>(null)
  const [petDraft, setPetDraft] = useState<PetDraft>(EMPTY_PET_DRAFT)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [busyPetId, setBusyPetId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isUnauthenticated, setIsUnauthenticated] = useState(false)

  useEffect(() => {
    let isActive = true

    const loadProfile = async () => {
      setLoadError('')
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) {
          if (isActive) setIsUnauthenticated(true)
          return
        }

        const [profileResult, petsResult] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', user.id)
            .single(),
          supabase
            .from('pets')
            .select('id, name, species, status, breed, gender, location, image_url, description, resolved_at, created_at')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false }),
        ])

        if (profileResult.error) throw profileResult.error
        if (petsResult.error) throw petsResult.error
        if (!isActive) return

        const profile: ProfileRecord = profileResult.data
        setUserId(user.id)
        setFullName(profile.full_name)
        setPhone(profile.phone)
        setPets(petsResult.data as ProfilePet[])
      } catch (error) {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os dados do perfil.',
          )
        }
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      isActive = false
    }
  }, [reloadKey])

  if (isUnauthenticated) return <Navigate to="/" replace />

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId) return

    const normalizedName = fullName.trim()
    setIsSavingProfile(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: normalizedName, phone: phone.trim() })
        .eq('id', userId)
        .select('id')
        .single()

      if (error) throw error

      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: normalizedName },
      })

      onProfileNameChange(normalizedName)
      if (authError) {
        setErrorMessage(`Dados salvos, mas não foi possível atualizar a saudação: ${authError.message}`)
      } else {
        setSuccessMessage('Seus dados foram atualizados.')
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar seus dados.',
      )
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleStartEditingPet = (pet: ProfilePet) => {
    setEditingPetId(pet.id)
    setPetDraft({
      name: pet.name,
      species: pet.species,
      status: pet.status,
      breed: pet.breed,
      gender: pet.gender,
      location: pet.location,
      image_url: pet.image_url ?? '',
      description: pet.description,
    })
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSavePet = async (event: FormEvent<HTMLFormElement>, petId: string) => {
    event.preventDefault()
    if (!userId) return

    setBusyPetId(petId)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const { data, error } = await supabase
        .from('pets')
        .update({
          name: petDraft.name.trim(),
          species: petDraft.species,
          status: petDraft.status,
          breed: petDraft.breed.trim() || 'SRD',
          gender: petDraft.gender,
          location: petDraft.location.trim(),
          image_url: petDraft.image_url?.trim() || null,
          description: petDraft.description.trim(),
        })
        .eq('id', petId)
        .eq('owner_id', userId)
        .select('id, name, species, status, breed, gender, location, image_url, description, resolved_at, created_at')
        .single()

      if (error) throw error

      const updatedPet: ProfilePet = data
      setPets((currentPets) =>
        currentPets.map((pet) => pet.id === petId ? updatedPet : pet),
      )
      setEditingPetId(null)
      setSuccessMessage('Anúncio atualizado.')
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível atualizar o anúncio.',
      )
    } finally {
      setBusyPetId(null)
    }
  }

  const handleToggleResolution = async (pet: ProfilePet) => {
    if (!userId) return

    setBusyPetId(pet.id)
    setErrorMessage('')
    setSuccessMessage('')
    const resolvedAt = pet.resolved_at ? null : new Date().toISOString()

    try {
      const { data, error } = await supabase
        .from('pets')
        .update({ resolved_at: resolvedAt })
        .eq('id', pet.id)
        .eq('owner_id', userId)
        .select('resolved_at')
        .single()

      if (error) throw error

      setPets((currentPets) =>
        currentPets.map((currentPet) =>
          currentPet.id === pet.id
            ? { ...currentPet, resolved_at: data.resolved_at }
            : currentPet,
        ),
      )
      setSuccessMessage(
        resolvedAt ? 'Anúncio marcado como resolvido.' : 'Anúncio reativado.',
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível alterar o estado do anúncio.',
      )
    } finally {
      setBusyPetId(null)
    }
  }

  if (isLoading) {
    return (
      <main
        role="status"
        className="flex flex-1 items-center justify-center px-4 text-center text-amber-900"
      >
        Carregando seu perfil...
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p role="alert" className="mb-4 text-sm text-red-700">{loadError}</p>
        <button
          type="button"
          onClick={() => {
            setIsLoading(true)
            setReloadKey((currentKey) => currentKey + 1)
          }}
          className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
        >
          Tentar novamente
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-amber-950">Meu perfil</h1>
        <p className="mt-2 text-sm text-amber-800/70">
          Gerencie seus dados e os anúncios dos seus pets.
        </p>
      </header>

      {(errorMessage || successMessage) && (
        <p
          role={errorMessage ? 'alert' : 'status'}
          className={`mb-6 rounded-xl px-4 py-3 text-sm ${
            errorMessage ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}
        >
          {errorMessage || successMessage}
        </p>
      )}

      <section className="mb-10 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-xl font-bold text-amber-950">Meus dados</h2>
        <form onSubmit={handleSaveProfile} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-amber-900">
            Nome completo
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </label>
          <label className="text-sm font-semibold text-amber-900">
            Telefone / WhatsApp
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} aria-hidden="true" />
              {isSavingProfile ? 'Salvando...' : 'Salvar meus dados'}
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-amber-600" aria-hidden="true" />
          <h2 className="text-xl font-bold text-amber-950">Meus anúncios</h2>
        </div>

        {pets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-6 py-10 text-center text-amber-900">
            Você ainda não cadastrou nenhum pet.
          </p>
        ) : (
          <div className="space-y-5">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="overflow-hidden rounded-3xl border border-amber-900/10 bg-white shadow-sm"
              >
                {editingPetId === pet.id ? (
                  <form
                    onSubmit={(event) => void handleSavePet(event, pet.id)}
                    className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7"
                  >
                    <label className="text-sm font-semibold text-amber-900">
                      Nome do pet
                      <input
                        value={petDraft.name}
                        onChange={(event) => setPetDraft({ ...petDraft, name: event.target.value })}
                        required
                        className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950"
                      />
                    </label>
                    <label className="text-sm font-semibold text-amber-900">
                      Espécie
                      <select
                        value={petDraft.species}
                        onChange={(event) => setPetDraft({ ...petDraft, species: event.target.value as PetSpecies })}
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 font-normal text-amber-950"
                      >
                        <option value="dog">Cão</option>
                        <option value="cat">Gato</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-amber-900">
                      Tipo de anúncio
                      <select
                        value={petDraft.status}
                        onChange={(event) => setPetDraft({ ...petDraft, status: event.target.value as PetStatus })}
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 font-normal text-amber-950"
                      >
                        <option value="adoption">Para adoção</option>
                        <option value="lost">Pet perdido</option>
                        <option value="found">Pet encontrado</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-amber-900">
                      Gênero
                      <select
                        value={petDraft.gender}
                        onChange={(event) => setPetDraft({ ...petDraft, gender: event.target.value as PetGender })}
                        className="mt-1 w-full rounded-xl border border-amber-200 bg-white px-4 py-2.5 font-normal text-amber-950"
                      >
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold text-amber-900">
                      Raça
                      <input
                        value={petDraft.breed}
                        onChange={(event) => setPetDraft({ ...petDraft, breed: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950"
                      />
                    </label>
                    <label className="text-sm font-semibold text-amber-900">
                      Localização
                      <input
                        value={petDraft.location}
                        onChange={(event) => setPetDraft({ ...petDraft, location: event.target.value })}
                        required
                        className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950"
                      />
                    </label>
                    <label className="text-sm font-semibold text-amber-900 sm:col-span-2">
                      URL da imagem
                      <input
                        type="url"
                        value={petDraft.image_url ?? ''}
                        onChange={(event) => setPetDraft({ ...petDraft, image_url: event.target.value })}
                        className="mt-1 w-full rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950"
                      />
                    </label>
                    <label className="text-sm font-semibold text-amber-900 sm:col-span-2">
                      Descrição
                      <textarea
                        rows={3}
                        value={petDraft.description}
                        onChange={(event) => setPetDraft({ ...petDraft, description: event.target.value })}
                        required
                        className="mt-1 w-full resize-y rounded-xl border border-amber-200 px-4 py-2.5 font-normal text-amber-950"
                      />
                    </label>
                    <div className="flex flex-wrap gap-3 sm:col-span-2">
                      <button
                        type="submit"
                        disabled={busyPetId === pet.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-60"
                      >
                        <Save size={16} aria-hidden="true" />
                        {busyPetId === pet.id ? 'Salvando...' : 'Salvar anúncio'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPetId(null)}
                        className="rounded-xl bg-amber-100 px-5 py-2.5 text-sm font-bold text-amber-950 hover:bg-amber-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-7">
                    <div className="h-48 shrink-0 overflow-hidden rounded-2xl bg-amber-100 sm:w-56">
                      <img
                        src={pet.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600'}
                        alt={pet.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-amber-950">{pet.name}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${getStatusBadgeColor(pet)}`}>
                          {pet.resolved_at ? getResolutionLabel(pet.status) : PET_STATUS_LABELS[pet.status]}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-amber-800/70">
                        {pet.species === 'dog' ? 'Cão' : 'Gato'} · {pet.breed || 'SRD'} · {pet.gender} · {pet.location}
                      </p>
                      <p className="mb-5 whitespace-pre-wrap text-sm text-amber-950/80">
                        {pet.description}
                      </p>
                      <div className="mt-auto flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleStartEditingPet(pet)}
                          className="inline-flex items-center gap-2 cursor-pointer rounded-xl bg-amber-100 px-4 py-2.5 text-sm font-bold text-amber-950 hover:bg-amber-200"
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Editar anúncio
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleToggleResolution(pet)}
                          disabled={busyPetId === pet.id}
                          className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-50 disabled:opacity-60"
                        >
                          {pet.resolved_at ? (
                            <><RotateCcw size={16} aria-hidden="true" /> Reativar anúncio</>
                          ) : (
                            <><Check size={16} aria-hidden="true" /> {getResolutionAction(pet.status)}</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
