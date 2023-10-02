import styled from 'styled-components';
import { type IncomingMessage } from '../../workers/modelWorkerMessage';
import type React from 'react';
import { Divider, List, Typography } from 'antd';

import { type RestoreProps } from './RestoreProps';

import { useEffect, useState } from 'react';

async function getDBEntry(): Promise<Array<string>> {
  return await new Promise((resolve, reject) => {
    const request = window.indexedDB.open('modelAutoSave', 1);
    request.onerror = (event) => {
      reject(event);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('modelSave', 'readonly');
      const objectStore = transaction.objectStore('modelSave');
      const request = objectStore.getAllKeys();
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
    };
  });
}

export default function IndexedDBRestore(props: RestoreProps): React.ReactElement {
  const { worker } = props;
  const [keys, setKeys] = useState<Array<string>>([]);

  useEffect(() => {
    async function fetchKeys() {
      const dbKeys = await getDBEntry();
      setKeys(dbKeys);
    }
    fetchKeys();
  }, []);

  function handleSelect(key: string) {
    // Do something with the selected key
    console.log(`Selected key: ${key}`);
  }

  return (
    <div>
      <Typography.Title level={3}>Select a key to restore:</Typography.Title>
      <Divider />
      <List
        bordered
        dataSource={keys}
        renderItem={(key) => (
          <List.Item onClick={() => handleSelect(key)}>
            <Typography.Text>{key}</Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
}