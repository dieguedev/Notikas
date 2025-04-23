import React from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { Texto } from '../../Texto/Texto'
import theme from '../../../theme'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

interface BottomSheetButtonProps {
  icon: IconName
  label: string
  onPress: () => void
}

export const BottomSheetButton: React.FC<BottomSheetButtonProps> = ({
  icon,
  label,
  onPress,
}) => {
  return (
    <View style={{ flex: 1, borderRadius: 10, overflow: 'hidden' }}>
      <Pressable
        android_ripple={{ color: theme.colors.primary, foreground: true }}
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <View style={styles.button}>
          <MaterialCommunityIcons name={icon} size={24} color="black" />
          <Texto estilo="montserratBold">{label}</Texto>
        </View>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    gap: theme.spacing.xsmall,
    borderRadius: 10,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.xlarge,
  },
  buttonContainer: {
    display: 'flex',
  },
})
