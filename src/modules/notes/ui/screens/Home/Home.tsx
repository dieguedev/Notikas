import React, { useEffect, useState } from 'react'
import { Layout } from '../../../../../common/Layout/Layout'
import { Texto } from '../../../../../common/Texto/Texto'
import { View, StyleSheet } from 'react-native'
import theme, { FileColor } from '../../../../../theme'
import { StatusBar } from 'expo-status-bar'
import { NoteList } from '../../../_components/NoteList/NoteList'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNotes } from '../../../providers/Notes/useNotes'
import { FolderList } from '../../../_components/FolderList/FolderList'
import migrations from '../../../../../../drizzle/migrations'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import { isUndefined } from '../../../../../common/utilities/isUndefined'
import { openDatabaseSync } from 'expo-sqlite/next'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { Header } from './_components/Header'
import { useBottomSheet } from '../../../providers/BottomSheet/useBottomSheet'
import { BottomSheetButton } from '../../../../../common/BottomSheet/_components/BottomSheetButton'
import { ButtonGrid } from '../../../../../common/BottomSheet/_components/ButtonGrid'
import { ColorPicker } from '../../../../../common/ColorPicker/ColorPicker'
import { getColorOptions } from '../../../domain/services/getColorOptions'
import { ColorOption } from '../../../domain/models/ColorOption'

export const Home: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false)
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([])
  const [selectedColor, setSelectedColor] =
    useState<FileColor>('pastelDarkPurple')

  const expoDb = openDatabaseSync('db.notikas')
  const db = drizzle(expoDb)
  const { success, error } = useMigrations(db, migrations)
  const { openBottomSheet } = useBottomSheet()

  const { notes, loadNotes } = useNotes()

  useEffect(() => {
    try {
      const onLoad = async () => {
        loadNotes()
        const colorOptions = getColorOptions()
        setColorOptions(colorOptions)
      }
      onLoad()
    } catch (error) {
      setHasError(true)
    }
  }, [])

  if (hasError || error) {
    return (
      <Layout>
        <Texto>An error has occurred.</Texto>
      </Layout>
    )
  }

  const isLoading = isUndefined(notes) || isUndefined(success)

  if (isLoading) {
    return (
      <Layout>
        <Texto>Loading...</Texto>
      </Layout>
    )
  }

  const handleColorChange = (color: FileColor) => {
    setSelectedColor(color)
  }

  const handleOpenBottomSheet = () => {
    openBottomSheet(
      <View style={styles.bottomSheetContainer}>
        <Texto estilo="montserratBold" size="large" marginBottom="medium">
          Opciones
        </Texto>
        <ColorPicker
          colorOptions={colorOptions}
          initialColor={selectedColor}
          onColorChange={handleColorChange}
          isInBottomSheet
        />
        <ButtonGrid
          options={[
            {
              icon: 'pencil',
              label: 'Editar',
              onPress: () => {},
            },
            {
              icon: 'delete',
              label: 'Eliminar',
              onPress: () => {},
            },
          ]}
        />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView>
        <Layout>
          <View style={styles.container}>
            <Header loadNotes={loadNotes} />
            <FolderList data={undefined} />
            <Texto marginBottom="xsmall" estilo="montserratMedium">
              Últimas notas
            </Texto>
            <NoteList data={notes} onNotePress={handleOpenBottomSheet} />
          </View>
        </Layout>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing.large,
    flex: 1,
  },
  bottomSheetContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    paddingHorizontal: theme.spacing.large,
  },
})
