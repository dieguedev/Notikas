import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { ZoomIn } from 'react-native-reanimated'
import theme, { FileColor } from '../../theme'
import { ColorOption } from '../../modules/notes/domain/models/ColorOption'
import {
  checkedCircle,
  circleInput,
} from '../../modules/notes/ui/styles/styles'

interface ColorPickerProps {
  colorOptions: ColorOption[]
  initialColor?: FileColor
  onColorChange: (color: FileColor) => void
  fieldName?: string
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | any>
  isInBottomSheet?: boolean
}

type ItemProps = {
  colorOption: ColorOption
  selectedColor: FileColor
  onPress: (colorOption: ColorOption) => void
}

const Item = ({ colorOption, selectedColor, onPress }: ItemProps) => (
  <Pressable
    style={circleInput(colorOption.color)}
    onPress={() => onPress(colorOption)}
  >
    <Animated.View
      style={checkedCircle(colorOption, selectedColor)}
      entering={ZoomIn.duration(400)}
    />
  </Pressable>
)

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colorOptions,
  initialColor = 'pastelDarkPurple',
  fieldName,
  isInBottomSheet = false,
  onColorChange,
  setFieldValue,
}) => {
  const [selectedColor, setSelectedColor] = useState<FileColor>(initialColor)

  const handleColorChange = (colorOption: ColorOption) => {
    setSelectedColor(colorOption.value)
    onColorChange(colorOption.value)

    if (fieldName && setFieldValue) {
      setFieldValue(fieldName, colorOption.value)
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={colorOptions}
        contentContainerStyle={styles.colorPickerContainer}
        overScrollMode="auto"
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Item
            colorOption={item}
            selectedColor={selectedColor}
            onPress={handleColorChange}
          />
        )}
        keyExtractor={(item) => item.value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  colorPickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.small,
    minHeight: 60,
    paddingHorizontal: theme.spacing.xsmall,
    marginBottom: theme.spacing.large,
  },
})
