import styled from 'styled-components';
import { ColorPicker, Divider, Col, Space, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Color } from 'antd/es/color-picker';
import { Color as ThreeColor } from 'three';
import { type SimulationParams } from './Simulation';
import { type SpaceSize } from 'antd/es/space';

const Container = styled(Space)`
  background-color: #d3d3d3;
  color: #000000;
  width: 20rem;
  height: calc(100% - 5rem);
  border-right: 2px solid #808080;
  font-size: 2rem;
  min-height: 90%;
  position: absolute;
  display: flex;
`;
const Title = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 1.4rem;
`;

export default function ParametersBar(props: {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}): React.ReactElement {
  const [colorLow, setColorLow] = useState<Color | string>('#0000FF');
  const [colorHigh, setColorHigh] = useState<Color | string>('#FF0000');

  const setParams = props.setParams;

  const colorLowString = useMemo(
    () => (typeof colorLow === 'string' ? colorLow : colorLow.toHexString()),
    [colorLow],
  );
  const colorHighString = useMemo(
    () => (typeof colorHigh === 'string' ? colorHigh : colorHigh.toHexString()),
    [colorHigh],
  );

  useEffect(() => {
    setParams((prev) => {
      return {
        ...prev,
        densityLowColour: new ThreeColor(colorLowString),
        densityHighColour: new ThreeColor(colorHighString),
      };
    });
  }, [colorLowString, colorHighString, setParams]);
  const space: [SpaceSize, SpaceSize] = ['large', 'small'];

  return (
    <Container direction="vertical" size={space}>
      <Row justify="center" />
      <Row justify="center">
        <Title>Parameters</Title>
      </Row>
      <Divider orientation="left">Simulator Color</Divider>
      <Row justify="space-around">
        <Col style={{ textAlign: 'center' }}>
          <span>Low</span>
        </Col>
        <Col>
          <ColorPicker value={colorLow} onChange={setColorLow} />
        </Col>
      </Row>
      <Row justify="space-around">
        <Col>
          <span>High</span>
        </Col>
        <Col>
          <ColorPicker value={colorHigh} onChange={setColorHigh} />
        </Col>
      </Row>
      <Divider />
    </Container>
  );
}
