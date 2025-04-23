import { openDatabaseSync } from 'expo-sqlite/next'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite/driver'

let dbInstance: ExpoSQLiteDatabase | null = null

export const getDatabase = () => {
  if (!dbInstance) {
    const expoDb = openDatabaseSync('db.notikas')
    dbInstance = drizzle(expoDb)
  }
  return dbInstance
}
