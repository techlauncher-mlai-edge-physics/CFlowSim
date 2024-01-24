import styled from 'styled-components';
import {
  type IncomingMessage,
  RunnerFunc,
} from '../../workers/modelWorkerMessage';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { type RestoreProps } from './RestoreProps';
import { type RcFile } from 'antd/es/upload';

const { Dragger } = Upload;

const DragandDrop = styled.div`
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export default function LocalFileRestore(props: RestoreProps): JSX.Element {
  const { worker } = props;

  const getBeforeUpload = (worker: Worker) => (file: RcFile) => {
    // use beforeUpload to prevent actual upload, since we want to
    // handle the file locally
    console.log(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target?.result);
      const result = e.target?.result;
      if (typeof result === 'string') {
        const msg: IncomingMessage = {
          func: RunnerFunc.DESERIALIZE,
          args: { savedState: result },
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
