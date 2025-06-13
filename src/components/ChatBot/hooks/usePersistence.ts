import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { compress, decompress } from 'lz-string';

interface StorageOptions {
  compression?: boolean;
  maxSize?: number;
  ttl?: number;
}

const DEFAULT_OPTIONS: StorageOptions = {
  compression: true,
  maxSize: 5 * 1024 * 1024, // 5MB
  ttl: 24 * 60 * 60 * 1000 // 24 hours
};

export function usePersistence<T>(
  key: string,
  initialValue: T,
  options: StorageOptions = {}
) {
  const [data, setData] = useState<T>(initialValue);
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Inicializar IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const database = await openDB('chatbot-storage', 1, {
        upgrade(db) {
          db.createObjectStore('data');
          db.createObjectStore('metadata');
        }
      });
      setDb(database);
    };

    initDB();
    return () => {
      db?.close();
    };
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      if (!db) return;

      try {
        // Verificar metadata
        const metadata = await db.get('metadata', key);
        if (metadata && metadata.timestamp) {
          if (Date.now() - metadata.timestamp > opts.ttl!) {
            await cleanup(key);
            return;
          }
        }

        // Cargar datos
        let storedData = await db.get('data', key);
        if (storedData) {
          if (opts.compression) {
            storedData = JSON.parse(decompress(storedData));
          }
          setData(storedData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [db, key, opts.compression, opts.ttl]);

  // Guardar datos
  const saveData = useCallback(async (newData: T) => {
    if (!db) return;

    try {
      let dataToStore = newData;
      
      // Comprimir si es necesario
      if (opts.compression) {
        dataToStore = compress(JSON.stringify(newData));
      }

      // Verificar tamaño
      const size = new Blob([JSON.stringify(dataToStore)]).size;
      if (size > opts.maxSize!) {
        const truncated = truncateData(newData);
        dataToStore = opts.compression ? 
          compress(JSON.stringify(truncated)) : 
          truncated;
      }

      // Guardar datos y metadata
      await db.put('data', dataToStore, key);
      await db.put('metadata', {
        timestamp: Date.now(),
        size
      }, key);

      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [db, key, opts.compression, opts.maxSize]);

  // Limpiar datos
  const cleanup = async (key: string) => {
    if (!db) return;
    await db.delete('data', key);
    await db.delete('metadata', key);
    setData(initialValue);
  };

  return [data, saveData] as const;
}

function truncateData<T>(data: T): T {
  if (Array.isArray(data)) {
    return data.slice(-50) as T;
  }
  return data;
}