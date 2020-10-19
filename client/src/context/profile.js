import { createContext, useContext } from 'react'

export const ProfileContext = createContext()

export const useProfile = () => {
  return useContext(ProfileContext)
}