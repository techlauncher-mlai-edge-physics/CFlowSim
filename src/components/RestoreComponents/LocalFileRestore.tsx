import styled from 'styled-components';
import { type IncomingMessage } from '../../workers/modelWorkerMessage';
import type React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { type RestoreProps } from './RestoreProps';
import { type RcFile } from 'antd/es/upload';

const { Dragger } = Upload;

const DragandDrop = styled.div`
  width: 90%;
  height: 90%;
  z-index: 100;
  transform: translate(5%, 5%);
`;

export default function LocalFileRestore(
  props: RestoreProps,
): React.ReactElement {
  const { worker } = props;

  const getBeforeUpload = (worker: Worker) => (file: RcFile) => {
    // use beforeUpload to prevent actual upload, since we want to
    // handle the file locally
    console.log(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target?.result);
      const result = e.target?.result;
      // TODO: add json validation
      if (typeof result === 'string') {
        const msg: IncomingMessage = {
          func: 'deserialize',
          args: result,
        };
        worker.postMessage(msg);
      }
    };
    reader.readAsText(file);
    return false;
  };

  const uploadProps: UploadProps = {
    accept: '.json',
    name: 'file',
    multiple: false,
    beforeUpload: getBeforeUpload(worker),
  };
  return (
    <DragandDrop>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
    </DragandDrop>
  );
}
