// a service that auto saves the current model with given interval
// to IndexedDB

import { type ModelSave } from '../model/modelService';

export default class AutoSaveService {
  saveInterval: number;
  intervalObj: number | undefined;
  maxAutoSaves: number;
  getModelSerialized: () => ModelSave;
  dbRequest: IDBOpenDBRequest;
  db!: IDBDatabase;
  constructor(
    saveInterval = 1000,
    maxAutoSaves = 5,
    getModelSerialized: () => ModelSave,
  ) {
    this.saveInterval = saveInterval;
    this.maxAutoSaves = maxAutoSaves;
    this.getModelSerialized = getModelSerialized;
    this.dbRequest = indexedDB.open('modelAutoSave', 1);
    this.dbRequest.onupgradeneeded = () => {
      const db = this.dbRequest.result;
      db.createObjectStore('modelSave');
      this.db = db;
      this.startAutoSave();
    };
    this.dbRequest.onsuccess = () => {
      this.db = this.dbRequest.result;
      this.startAutoSave();
    };
    this.dbRequest.onerror = () => {
      throw new Error('Failed to open IndexedDB');
    };
  }

  startAutoSave(): void {
    this.intervalObj = setInterval(() => {
      const serialisationData = this.getModelSerialized();
      const modelSaveString = JSON.stringify(serialisationData);
      const transaction = this.db.transaction('modelSave', 'readwrite');
      const objectStore = transaction.objectStore('modelSave');
      const newKey = Date.now();
      const request = objectStore.put(modelSaveString, newKey);
      request.onerror = () => {
        throw new Error('Failed to save model');
      };
      // remove old auto saves if there are more than maxAutoSaves
      const objectStoreRequest = objectStore.getAllKeys();
      objectStoreRequest.onsuccess = (event) => {
        const keys = (event.target as IDBRequest).result as number[];
        if (keys.length > this.maxAutoSaves) {
          // remove the oldest auto save
          const oldestKey = Math.min(...keys);
          const deleteRequest = objectStore.delete(oldestKey.toString());
          deleteRequest.onerror = () => {
            throw new Error('Failed to delete oldest auto save');
          };
        }
      };
    }, this.saveInterval);
  }

  pauseAutoSave(): void {
    clearInterval(this.intervalObj);
  }
}
