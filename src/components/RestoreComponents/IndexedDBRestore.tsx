import styled from 'styled-components';
import {
  type DeserializeArgs,
  type IncomingMessage,
  RunnerFunc,
} from '../../workers/modelWorkerMessage';
import { useEffect, useState } from 'react';
import { Divider, List, Typography } from 'antd';
import { openDB } from 'idb';
import { type RestoreProps } from './RestoreProps';
import { type ModelSave } from '../../services/model/modelService';

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default function IndexedDBRestore(props: RestoreProps): JSX.Element {
  const { worker } = props;
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    async function fetchKeys(): Promise<void> {
      const db = await openDB('modelAutoSave', 1);
      const transaction = db.transaction('modelSave', 'readonly');
      const objectStore = transaction.objectStore('modelSave');
      const allKeys = await objectStore.getAllKeys();
      setKeys(allKeys.map((key) => String(key)));
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
            func: RunnerFunc.DESERIALIZE,
            args: {
              savedState: value as ModelSave,
            } satisfies DeserializeArgs,
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
