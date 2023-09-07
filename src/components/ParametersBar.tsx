import styled from 'styled-components';
import { ColorPicker, Col, Space, Row, Card } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import type { Color } from 'antd/es/color-picker';
import { Color as ThreeColor } from 'three';
import { type SimulationParams } from './Simulation';
import { type SpaceSize } from 'antd/es/space';

import ParameterButton from './ParameterComponents/ParameterButton';
import ParameterLabel from './ParameterComponents/ParameterLabel';

const Container = styled(Space)`
  background-color: #797979;
  color: #FFF;

  width: 20rem;
  height: calc(100% - 6.0rem);

  font-size: 2rem;
  position: absolute;
  display: flex;

  text-align:left;

  // set curves
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;

  padding:12px;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Title = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 2.0rem;

  @media (max-width: 760px) {
    display: none;
  }
`;

const Category = styled(Card) `
  font-family: 'Roboto', sans-serif;
  background-color: #797979;
  text-align: "left";
  font-size: 1.0rem;
  color: #FFFFFF;
`;

const BackButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #D9D9D9;
  color: #464646;
  font-size: 16px;
  border: none;
  cursor: pointer;
`

function ShowHideButton(props: {
  toggleVisible: ()=>void
}) {
  const toggleVis = props.toggleVisible
  return(
    <BackButton onClick={toggleVis}>
      {"<<"}
      </BackButton>
  )
}

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

  const toggleBar = () => console.log("e");

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
    <Container direction="vertical" size={space} >
      { /* Show/hide button */ }
      <Row justify="end">
        <ShowHideButton toggleVisible={toggleBar} />
      </Row>

      { /* Pane header */ }
      <Title>Parameters</Title>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <ParameterButton label="Easy mode"/>
        </Col>
        <Col className="gutter-row" span={12}>
          <ParameterButton label="Expert mode"/>
        </Col>
      </Row>

      <Row/>
      <Row/>

      { /* Simulation colour */ }
      <Category title={"Simulation Colour"}>
        <Row justify="start" gutter={16}>
          <Col className="gutter-row" span={12}>
            <ParameterLabel title="Low" tooltip="The colour to shade points of low density"/>
          </Col>
          <Col className="gutter-row" span={12}>
            <ColorPicker value={colorLow} onChange={setColorLow} />
          </Col>
        </Row>

        <Row justify="start" gutter={16}>
          <Col className="gutter-row" span={12}>
            <ParameterLabel title="High" tooltip="The colour to shade points of high density"/>
          </Col>
          <Col className="gutter-row" span={12}>
            <ColorPicker value={colorHigh} onChange={setColorHigh} />
          </Col>
        </Row>
      </Category>

    </Container>
  );
}
