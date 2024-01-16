// a service that auto saves the current model with given interval
// to IndexedDB

import { type ModelSave } from '../model/modelService';
import { openDB, type IDBPDatabase } from 'idb';

export default class AutoSaveService {
  saveInterval: number;
  intervalObj: ReturnType<typeof setInterval> | undefined;
  maxAutoSaves: number;
  getModelSerialized: () => ModelSave;
  db!: IDBPDatabase;
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

    openDB('modelAutoSave', 1, {
      upgrade(db) {
        db.createObjectStore('modelSave', {
          keyPath: 'time',
          autoIncrement: true,
        });
      },
    })
      .then((db) => {
        this.db = db;
        this.ready = true;
      })
      .catch(() => {
        throw new Error('Failed to open IndexedDB');
      });
  }

  startAutoSave(): void {
    if (this.intervalObj !== null && this.intervalObj !== undefined) {
      throw new Error('Auto save already started');
    }
    if (!this.ready) {
      throw new Error('IndexedDB not ready');
    }
    this.intervalObj = setInterval(async () => {
      const serialisationData = this.getModelSerialized();
      console.log(
        '🚀 ~ file: autoSaveService.ts:51 ~ AutoSaveService ~ this.intervalObj=setInterval ~ serialisationData:',
        serialisationData,
      );
      // Save the model to the database
      await this.db.add('modelSave', serialisationData);
      // Check if the total count exceeds maxAutoSaves
      const count = await this.db.count('modelSave');
      if (count > this.maxAutoSaves) {
        // Get the earliest model according to the time (index)
        const earliestModel = await this.db.getAllKeys('modelSave', null, 10);
        console.log( 
          '🚀 ~ file: autoSaveService.ts:63 ~ AutoSaveService ~ this.intervalObj=setInterval ~ earliestModel:',
          earliestModel,
        );
        // Delete the earliest model
        await this.db.delete('modelSave', earliestModel[0]);
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
