import { Menu } from 'antd';
import type React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import LocalFileRestore from './LocalFileRestore';
import { type RestoreProps } from './RestoreProps';
import IndexedDBRestore from './IndexedDBRestore';

const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 80%;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 1rem;
  transform: translate(-50%, -50%);
  z-index: 100;

  @media (max-width: 760px) {
    width: 100%;
    height: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const LeftColumn = styled.div`
  width: 25%;
  transform: translate(0, 5%);
  height: 100%;
  float: left;

  @media (max-width: 760px) {
    width: 95%;
    float: none;
    height: 30%;
  }
`;

const RightColumn = styled.div`
  width: 70%;
  height: 100%;
  float: left;

  @media (max-width: 760px) {
    width: 100%;
    float: none;
    height: 70%;
  }
`;

export default function RestorePopup(props: RestoreProps): React.ReactElement {
  const [selectedItem, setSelectedItem] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item.key);
  };

  const renderRightColumn = () => {
    switch (selectedItem) {
      case 'A':
        return <LocalFileRestore {...props} />;
      case 'B':
        return <IndexedDBRestore {...props} />;
      default:
        return null;
    }
  };

  const handleCloseClick = () => {
    // handle close button click here
    // remove the popup from the DOM
    const popup = document.getElementById('restore-popup');
    if (popup !== null) {
      popup.remove();
    }
  };

  return (
    <Popup id="restore-popup">
      <CloseButton onClick={handleCloseClick}>X</CloseButton>
      <LeftColumn>
        <Menu onClick={handleItemClick} selectedKeys={[selectedItem]}>
          <Menu.Item key="A">Local PC</Menu.Item>
          <Menu.Item key="B">IndexedDB</Menu.Item>
        </Menu>
      </LeftColumn>
      <RightColumn>{renderRightColumn()}</RightColumn>
    </Popup>
  );
}