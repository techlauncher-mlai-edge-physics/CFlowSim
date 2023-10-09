import { Divider, Menu } from 'antd';
import type React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import LocalFileRestore from './LocalFileRestore';
import { type RestoreProps } from './RestoreProps';
import IndexedDBRestore from './IndexedDBRestore';
import { CloseOutlined } from '@ant-design/icons';

const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60%;
  height: 80%;
  background-color: #ffffff;
  border-radius: 1rem;
  transform: translate(-50%, -50%);
  z-index: 100;

  @media (max-width: 760px) {
    width: 95%;
    height: 97%;
  }
`;

const IconButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
`;

const LeftColumn = styled.div`
  width: 25%;
  height: 100%;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 760px) {
    width: 95%;
    float: none;
    height: 30%;
  }
`;
const SafeArea = styled.div`
  width: 80%;
  height: 90%;
  overflow: hidden;
  display: flex;
  justify-content: center;
`;

const RightColumn = styled.div`
  width: 70%;
  height: 100%;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 760px) {
    width: 100%;
    float: none;
    height: 70%;
  }
`;

const MenuContainer = styled(Menu)`
  width: 100%;
  height: 100%;
  border: none;
`;

export default function RestorePopup(props: RestoreProps): React.ReactElement {
  const setRestorePopupVisible = props.setRestorePopupVisible;
  const [selectedItem, setSelectedItem] = useState('');

  const handleItemClick = (item: {
    key: React.SetStateAction<string>;
  }): void => {
    setSelectedItem(item.key);
  };

  const renderRightColumn = (): React.ReactNode => {
    switch (selectedItem) {
      case 'A':
        return <LocalFileRestore {...props} />;
      case 'B':
        return <IndexedDBRestore {...props} />;
      default:
        return null;
    }
  };

  const handleCloseClick = (): void => {
    setRestorePopupVisible(false);
  };

  return (
    <Popup id="restore-popup">
      <IconButton onClick={handleCloseClick}>
        <CloseOutlined />
      </IconButton>
      <LeftColumn>
        <SafeArea>
          <MenuContainer
            onClick={handleItemClick}
            selectedKeys={[selectedItem]}
          >
            <Menu.Item key="A">Local PC</Menu.Item>
            <Menu.Item key="B">IndexedDB</Menu.Item>
          </MenuContainer>
        </SafeArea>
      </LeftColumn>
      <Divider type="vertical" />
      <RightColumn>
        <SafeArea>{renderRightColumn()}</SafeArea>
      </RightColumn>
    </Popup>
  );
}
