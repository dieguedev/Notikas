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
import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { Header } from './_components/Header'

export const Home: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false)

  const expoDb = openDatabaseSync('db.notikas')
  const db = drizzle(expoDb)
  const { success, error } = useMigrations(db, migrations)

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
            <NoteList data={notes} />
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
})
