import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import theme from '../../theme'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: string[]
}

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  snapPoints: customSnapPoints,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => customSnapPoints || ['50%'], [])

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.present()
    } else {
      bottomSheetRef.current?.dismiss()
    }
  }, [isOpen])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose()
    },
    [onClose]
  )

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: theme.spacing.xsmall,
  },
  handle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: theme.spacing.large,
  },
  indicator: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 3,
  },
  background: {
    backgroundColor: 'white',
  },
})
