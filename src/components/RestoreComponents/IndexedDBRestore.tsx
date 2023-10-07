import styled from 'styled-components';
import { type IncomingMessage } from '../../workers/modelWorkerMessage';
import type React from 'react';
import { Divider, List, Typography } from 'antd';

import { type RestoreProps } from './RestoreProps';

import { useEffect, useState } from 'react';

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
`;

async function getDBEntry(): Promise<string[]> {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open('modelAutoSave', 1);
    request.onerror = (event) => {
      reject(event);
    };
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('modelSave', 'readonly');
      const objectStore = transaction.objectStore('modelSave');
      const getAllKeysRequest = objectStore.getAllKeys();
      getAllKeysRequest.onsuccess = (event) => {
        const keys = (event.target as IDBRequest).result;
        if (Array.isArray(keys)) {
          resolve(keys);
        }
      };
    };
  });
}

export default function IndexedDBRestore(
  props: RestoreProps,
): React.ReactElement {
  const { worker } = props;
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    async function fetchKeys(): Promise<void> {
      const dbKeys = await getDBEntry();
      setKeys(dbKeys);
    }
    void fetchKeys();
  }, []);

  function handleSelect(key: string): void {
    // Do something with the selected key
    console.log(`Selected key: ${key}`);
    // get value from indexedDB
    const request = window.indexedDB.open('modelAutoSave', 1);
    request.onerror = (event) => {
      console.log(event);
    };
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction('modelSave', 'readonly');
      const objectStore = transaction.objectStore('modelSave');
      const getRequest = objectStore.get(key);
      getRequest.onsuccess = (event) => {
        const value = (event.target as IDBRequest).result;
        if (value !== undefined) {
          const message: IncomingMessage = {
            func: 'deserialize',
            args: value,
          };
          worker.postMessage(message);
        }
      };
    };
  }

  return (
    <Container>
      <Typography.Title level={3}>Select a key to restore:</Typography.Title>
      <Divider />
      <List
        bordered
        dataSource={keys}
        renderItem={(key) => (
          <List.Item
            onClick={() => {
              handleSelect(key);
            }}
          >
            <Typography.Text>{key}</Typography.Text>
          </List.Item>
        )}
      />
    </Container>
  );
}
