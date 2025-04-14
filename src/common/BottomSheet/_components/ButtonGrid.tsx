import { FlatList } from 'react-native'
import { BottomSheetButton } from './BottomSheetButton'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import theme from '../../../theme'

type IconName = keyof typeof MaterialCommunityIcons.glyphMap

interface ButtonGridProps {
  options: ButtonGridOption[]
}

interface ButtonGridOption {
  icon: IconName
  label: string
  onPress: () => void
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({ options }) => {
  const renderItem = ({ item }: { item: ButtonGridOption }) => (
    <BottomSheetButton
      icon={item.icon}
      label={item.label}
      onPress={item.onPress}
    />
  )

  return (
    <FlatList
      data={options}
      renderItem={renderItem}
      keyExtractor={(item) => item.label}
      numColumns={2}
      style={{ width: '100%' }}
      columnWrapperStyle={{
        gap: theme.spacing.small,
        justifyContent: 'space-between',
      }}
    />
  )
}
