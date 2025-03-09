"use client"

import { create } from "zustand"
import type { HighAltitudePlace } from "@/lib/actions/altitude-actions"

interface AltitudePlacesState {
  places: HighAltitudePlace[]
  loading: boolean
  selectedPlace: HighAltitudePlace | null
  setPlaces: (places: HighAltitudePlace[]) => void
  setLoading: (loading: boolean) => void
  setSelectedPlace: (place: HighAltitudePlace | null) => void
}

export const useAltitudePlacesStore = create<AltitudePlacesState>((set) => ({
  places: [],
  loading: true,
  selectedPlace: null,
  setPlaces: (places) => set({ places }),
  setLoading: (loading) => set({ loading }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
}))

