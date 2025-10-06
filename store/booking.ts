import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Length = 'small' | 'medium' | 'long'

export interface DesignImage {
  url: string
  name?: string
}

export interface Customer {
  fullName?: string
  phone?: string
  email?: string
  instagram?: string
}

export interface BookingDraft {
  serviceId?: string
  designText?: string
  designImages: DesignImage[]
  length?: Length
  date?: string // 'YYYY-MM-DD'
  time?: string // 'HH:mm'
  customer?: Customer
}

interface BookingStore {
  draft: BookingDraft
  currentStep: number
  setService: (serviceId: string) => void
  setDesignText: (text: string) => void
  addImage: (image: DesignImage) => void
  removeImage: (index: number) => void
  setLength: (length: Length) => void
  setDate: (date: string) => void
  setTime: (time: string) => void
  setCustomer: (customer: Partial<Customer>) => void
  setStep: (step: number) => void
  reset: () => void
  isValid: (step: number) => boolean
}

const initialDraft: BookingDraft = {
  designImages: [],
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      currentStep: 1,
      
      setService: (serviceId) =>
        set((state) => ({
          draft: { ...state.draft, serviceId },
        })),
      
      setDesignText: (designText) =>
        set((state) => ({
          draft: { ...state.draft, designText },
        })),
      
      addImage: (image) =>
        set((state) => ({
          draft: {
            ...state.draft,
            designImages: [...state.draft.designImages, image],
          },
        })),
      
      removeImage: (index) =>
        set((state) => ({
          draft: {
            ...state.draft,
            designImages: state.draft.designImages.filter((_, i) => i !== index),
          },
        })),
      
      setLength: (length) =>
        set((state) => ({
          draft: { ...state.draft, length },
        })),
      
      setDate: (date) =>
        set((state) => ({
          draft: { ...state.draft, date },
        })),
      
      setTime: (time) =>
        set((state) => ({
          draft: { ...state.draft, time },
        })),
      
      setCustomer: (customer) =>
        set((state) => ({
          draft: {
            ...state.draft,
            customer: { ...state.draft.customer, ...customer },
          },
        })),
      
      setStep: (currentStep) => set({ currentStep }),
      
      reset: () => set({ draft: initialDraft, currentStep: 1 }),
      
      isValid: (step) => {
        const { draft } = get()
        
        switch (step) {
          case 1: // Service
            return !!draft.serviceId
          case 2: // Design
            return !!(draft.designText || draft.designImages.length > 0)
          case 3: // Length
            return !!draft.length
          case 4: // Date & Time
            return !!(draft.date && draft.time)
          case 5: // Customer
            return !!(draft.customer?.fullName && draft.customer?.phone)
          default:
            return false
        }
      },
    }),
    {
      name: 'booking-store',
      partialize: (state) => ({ draft: state.draft, currentStep: state.currentStep }),
    }
  )
)
