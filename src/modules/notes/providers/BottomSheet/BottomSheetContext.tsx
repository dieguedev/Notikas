import { createContext, ReactNode } from 'react'

type BottomSheetContextType = {
  openBottomSheet: (content: ReactNode) => void
  closeBottomSheet: () => void
}

export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined)
