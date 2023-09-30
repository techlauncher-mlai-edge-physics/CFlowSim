// a service that auto saves the current model with given interval
// to IndexedDB

import { type ModelSave } from '../model/modelService';

export default class AutoSaveService {
  saveInterval: number;
  intervalObj: ReturnType<typeof setInterval> | undefined;
  maxAutoSaves: number;
  getModelSerialized: () => ModelSave;
  db!: IDBDatabase;
  constructor(
    getModelSerialized: () => ModelSave,
    saveInterval = 10000,
    maxAutoSaves = 5,
  ) {
    this.saveInterval = saveInterval;
    this.maxAutoSaves = maxAutoSaves;
    this.getModelSerialized = getModelSerialized;
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

      this.startAutoSave();
    };
    dbRequest.onerror = () => {
      throw new Error('Failed to open IndexedDB');
    };
  }

  startAutoSave(): void {
    if (this.intervalObj != null) {
      throw new Error('intervalObj is not null');
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
        let count = request2.result;
        console.log('count', count);
        if (count > this.maxAutoSaves) {
          console.log('deleting old model');
          // use while loop to delete all but the last 5 models
          while (count > this.maxAutoSaves) {
            const request3 = objectStore.delete(count - this.maxAutoSaves);
            request3.onsuccess = () => {
              console.log('successfully deleted model');
            };
            request3.onerror = () => {
              throw new Error('Failed to delete model');
            };
            count -= 1;
          }
        }
      };
      request2.onerror = () => {
        throw new Error('Failed to count models');
      };
    }, this.saveInterval);
  }

  pauseAutoSave(): void {
    setTimeout(() => {
      console.log('pausing auto save');
      clearInterval(this.intervalObj);
    }, 0);
  }

  close(): void {
    this.db.close();
  }
}
