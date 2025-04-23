import { useContext } from 'react'
import { BottomSheetContext } from './BottomSheetContext'

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext)
  if (!context) {
    throw new Error('useBottomSheet must be used within a BottomSheetProvider')
  }
  return context
}
