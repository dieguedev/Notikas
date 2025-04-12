import React, { useEffect, useState } from 'react'
import { Layout } from '../../../../../common/Layout/Layout'
import { Texto } from '../../../../../common/Texto/Texto'
import { View, StyleSheet } from 'react-native'
import theme from '../../../../../theme'
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export const Home: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false)
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false)

  const expoDb = openDatabaseSync('db.notikas')
  const db = drizzle(expoDb)
  const { success, error } = useMigrations(db, migrations)
  const { openBottomSheet } = useBottomSheet()

  const { notes, loadNotes } = useNotes()

  useEffect(() => {
    try {
      const onLoad = async () => {
        loadNotes()
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

  const handleOpenBottomSheet = () => {
    openBottomSheet(
      <View style={styles.bottomSheetContainer}>
        <Texto estilo="montserratBold" size="large" marginBottom="large">
          Opciones
        </Texto>
        <View style={styles.buttonContainer}>
          <View style={styles.optionButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
            <Texto estilo="montserratBold">Editar</Texto>
          </View>
          <View style={styles.optionButton}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
            <Texto estilo="montserratBold">Editar</Texto>
          </View>
        </View>
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
  },
  buttonContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
    paddingHorizontal: theme.spacing.large,
  },
  optionButton: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    gap: theme.spacing.xsmall,
    borderRadius: 10,
    padding: 15,
  },
})
