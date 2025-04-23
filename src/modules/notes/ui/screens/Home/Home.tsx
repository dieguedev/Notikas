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
import { Header } from './_components/Header'
import { useBottomSheet } from '../../../providers/BottomSheet/useBottomSheet'
import { ButtonGrid } from '../../../../../common/BottomSheet/_components/ButtonGrid'
import { ColorPicker } from '../../../../../common/ColorPicker/ColorPicker'
import { getColorOptions } from '../../../domain/services/getColorOptions'
import { ColorOption } from '../../../domain/models/ColorOption'
import { useNotesRepository } from '../../../providers/NotesRepository/useNotesRepository'
import { getNoteById } from '../../../application/note/get/getNote'
import { updateNote } from '../../../application/note/update/updateNote'
import { Note } from '../../../../../../db/schema'
import { RootStackNavigationProp } from '../../../../../../type'
import { useNavigation } from '@react-navigation/native'
import { deleteNote } from '../../../application/note/delete/deleteNote'
import { getDatabase } from '../../../../../../db/database'

export const Home: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false)
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([])

  const db = getDatabase()
  const { success, error } = useMigrations(db, migrations)
  const { openBottomSheet, closeBottomSheet } = useBottomSheet()
  const { notesRepository } = useNotesRepository()
  const navigation = useNavigation<RootStackNavigationProp>()

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

  const handleColorChange = (color: FileColor, note: Note) => {
    updateNote(notesRepository, { ...note, color })
    loadNotes()
  }

  const handleOpenBottomSheet = async (id: number) => {
    const [note] = await getNoteById(notesRepository, id)

    openBottomSheet(
      <View style={styles.bottomSheetContainer}>
        <Texto estilo="montserratBold" size="large" marginBottom="medium">
          Opciones
        </Texto>
        <ColorPicker
          colorOptions={colorOptions}
          initialColor={note.color}
          onColorChange={(color) => handleColorChange(color, note)}
          isInBottomSheet
        />
        <ButtonGrid
          options={[
            {
              icon: 'pencil',
              label: 'Editar',
              onPress: () => {
                navigation.navigate('EditNote', { noteId: id })
                closeBottomSheet()
              },
            },
            {
              icon: 'delete',
              label: 'Eliminar',
              onPress: () => {
                deleteNote(notesRepository, id)
                loadNotes()
                closeBottomSheet()
              },
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
