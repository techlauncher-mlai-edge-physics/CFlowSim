// a service that auto saves the current model with given interval
// to IndexedDB

import { type ModelSave } from '../model/modelService';

export default class AutoSaveService {
  saveInterval: number;
  intervalObj: ReturnType<typeof setInterval> | undefined;
  maxAutoSaves: number;
  getModelSerialized: () => ModelSave;
  db!: IDBDatabase;
  ready = false;
  constructor(
    getModelSerialized: () => ModelSave,
    saveInterval = 10000,
    maxAutoSaves = 5,
  ) {
    this.saveInterval = saveInterval;
    this.maxAutoSaves = maxAutoSaves;
    this.getModelSerialized = getModelSerialized;
    this.intervalObj = undefined;
    const dbRequest = indexedDB.open('modelAutoSave', 1);
    dbRequest.onupgradeneeded = () => {
      const db = dbRequest.result;
      this.db = db;
      const objectStore = this.db.createObjectStore('modelSave', {
        autoIncrement: true,
      });
      objectStore.transaction.oncomplete = () => {
        console.log('Successfully created object store');
      };
    };
    dbRequest.onsuccess = () => {
      console.log('Successfully opened IndexedDB');
      this.db = dbRequest.result;
      this.ready = true;
    };
    dbRequest.onerror = () => {
      throw new Error('Failed to open IndexedDB');
    };
  }

  startAutoSave(): void {
    if (this.intervalObj !== null && this.intervalObj !== undefined) {
      throw new Error('Auto save already started');
    }
    if (!this.ready) {
      throw new Error('IndexedDB not ready');
    }
    this.intervalObj = setInterval(() => {
      const serialisationData = this.getModelSerialized();
      const modelSaveString = JSON.stringify(serialisationData);
      console.log('saving model');
      const transaction = this.db.transaction(['modelSave'], 'readwrite');
      transaction.onerror = () => {
        throw new Error('Failed to open transaction');
      };
      const objectStore = transaction.objectStore('modelSave');
      const request = objectStore.add(modelSaveString);
      request.onsuccess = () => {
        console.log('successfully saved model');
      };
      request.onerror = () => {
        throw new Error('Failed to save model');
      };
      const request2 = objectStore.count();
      request2.onsuccess = () => {
        const count = request2.result;
        console.log('count', count);
        if (count > this.maxAutoSaves) {
          console.log('deleting old model');
          // use while loop to delete all but the last 5 models
          const request3 = objectStore.getAllKeys();
          request3.onsuccess = () => {
            const keys = request3.result;
            console.log('keys', keys);
            const keysToDelete = keys.slice(0, count - this.maxAutoSaves);
            console.log('keysToDelete', keysToDelete);
            keysToDelete.forEach((key) => {
              const request4 = objectStore.delete(key);
              request4.onsuccess = () => {
                console.log('successfully deleted model');
              };
              request4.onerror = () => {
                throw new Error('Failed to delete model');
              };
            });
          }
        }
      };
      request2.onerror = () => {
        throw new Error('Failed to count models');
      };
      transaction.oncomplete = () => {
        console.log('Successfully saved model and possibly deleted old models');
      }
    }, this.saveInterval);
  }

  pauseAutoSave(): void {
    setTimeout(() => {
      console.log('pausing auto save');
      clearInterval(this.intervalObj);
      this.intervalObj = undefined;
    }, 0);
  }

  close(): void {
    this.db.close();
  }
}
