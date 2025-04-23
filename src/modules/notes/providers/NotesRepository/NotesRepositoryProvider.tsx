import React, { ReactNode } from 'react'
import { NotesRepositoryContext } from './NotesRepositoryContext'
import { SQLiteNotesRepository } from '../../infrastructure/repositories/SQLiteNotesRepository'
import { getDatabase } from '../../../../../db/database'

interface Props {
  children: ReactNode
}

export const NotesRepositoryProvider: React.FC<Props> = ({ children }) => {
  const db = getDatabase()

  const notesRepository = new SQLiteNotesRepository(db)

  return (
    <NotesRepositoryContext.Provider value={{ notesRepository }}>
      {children}
    </NotesRepositoryContext.Provider>
  )
}
