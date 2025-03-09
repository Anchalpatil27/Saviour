"use client"

import React from "react"
import type { MidAltitudePlace } from "@/lib/actions/altitude-actions"

// Define the context type
type AltitudePlacesContextType = {
  places: MidAltitudePlace[]
  loading: boolean
  selectedPlace: MidAltitudePlace | null
  setPlaces: (places: MidAltitudePlace[]) => void
  setLoading: (loading: boolean) => void
  setSelectedPlace: (place: MidAltitudePlace | null) => void
}

// Create default context value
const defaultContextValue: AltitudePlacesContextType = {
  places: [],
  loading: true,
  selectedPlace: null,
  setPlaces: () => {},
  setLoading: () => {},
  setSelectedPlace: () => {},
}

// Create the context
const AltitudePlacesContext = React.createContext<AltitudePlacesContextType>(defaultContextValue)

// Provider function
export function AltitudePlacesProvider(props: { children: React.ReactNode }) {
  const [places, setPlaces] = React.useState<MidAltitudePlace[]>([])
  const [loading, setLoading] = React.useState(true)
  const [selectedPlace, setSelectedPlace] = React.useState<MidAltitudePlace | null>(null)

  const contextValue = {
    places,
    loading,
    selectedPlace,
    setPlaces,
    setLoading,
    setSelectedPlace,
  }

  // Using createElement to avoid JSX parsing issues
  return React.createElement(AltitudePlacesContext.Provider, { value: contextValue }, props.children)
}

// Custom hook to use the context
export function useAltitudePlaces(): AltitudePlacesContextType {
  return React.useContext(AltitudePlacesContext)
}

