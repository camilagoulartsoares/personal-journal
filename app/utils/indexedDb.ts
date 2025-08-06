import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface DiarioDB extends DBSchema {
  entradas: {
    key: string
    value: {
      id: string
      texto: string
    }
  }
}

const DB_NAME = 'diario-db'
const STORE_NAME = 'entradas'

export const initDB = async (): Promise<IDBPDatabase<DiarioDB>> => {
  return openDB<DiarioDB>(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export const salvarEntrada = async (entrada: { id: string; texto: string }) => {
  const db = await initDB()
  await db.put('entradas', entrada)
  console.log('Entrada salva com sucesso:', entrada)
}

export const buscarEntrada = async (id: string) => {
  const db = await initDB()
  return db.get(STORE_NAME, id)
}

export const buscarTodasEntradas = async (): Promise<{ [date: string]: string }> => {
  const db = await initDB()
  const todas = await db.getAll(STORE_NAME)
  const resultado: { [date: string]: string } = {}
  todas.forEach((item) => {
    resultado[item.id] = item.texto
  })
  return resultado
}
