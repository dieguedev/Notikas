import { ReactNode, useState } from 'react'
import { BottomSheetContext } from './BottomSheetContext'
import { BottomSheet } from '../../../../common/BottomSheet/BottomSheet'

export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState<ReactNode>(null)

  const openBottomSheet = (newContent: ReactNode) => {
    setContent(newContent)
    setIsOpen(true)
  }

  const closeBottomSheet = () => {
    setIsOpen(false)
  }

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
      {children}
      <BottomSheet isOpen={isOpen} onClose={closeBottomSheet}>
        {content}
      </BottomSheet>
    </BottomSheetContext.Provider>
  )
}
