import React, { ReactNode } from 'react'
import { NotesRepositoryContext } from './NotesRepositoryContext'
import { SQLiteNotesRepository } from '../../infrastructure/repositories/SQLiteNotesRepository'
import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'

interface Props {
  children: ReactNode
}

export const NotesRepositoryProvider: React.FC<Props> = ({ children }) => {
  const expoDb = openDatabaseSync('db.notikas')
  const db = drizzle(expoDb)

  const notesRepository = new SQLiteNotesRepository(db)

  return (
    <NotesRepositoryContext.Provider value={{ notesRepository }}>
      {children}
    </NotesRepositoryContext.Provider>
  )
}
