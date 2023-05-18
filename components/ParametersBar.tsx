import styled from "styled-components";
import { ColorPicker } from "antd";
import { useEffect, useMemo, useState } from "react";
import type { Color } from "antd/es/color-picker";
import { Color as ThreeColor } from "three";
import { type SimulationParams } from "./Simulation";

const Container = styled.div`
  background-color: #d3d3d3;
  color: #000000;
  width: 20rem;
  height: calc(100% - 5rem);
  border-right: 2px solid #808080;
  font-size: 2rem;
  min-height: 90%;
  position: absolute;
`;
const Title = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 1.4rem;
  position: absolute;
  left: 5.5rem;
  top: 1rem;
`;
const ColorPickerContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function ParametersBar(props: {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}): React.ReactElement {
  const [colorLow, setColorLow] = useState<Color | string>("#0000FF");
  const [colorHigh, setColorHigh] = useState<Color | string>("#FF0000");

  const setParams = props.setParams;

  const colorLowString = useMemo(
    () => (typeof colorLow === "string" ? colorLow : colorLow.toHexString()),
    [colorLow]
  );
  const colorHighString = useMemo(
    () => (typeof colorHigh === "string" ? colorHigh : colorHigh.toHexString()),
    [colorHigh]
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

  return (
    <Container>
      <Title>Parameters</Title>
      <ColorPickerContainer>
        <div style={{ fontSize: "1.2rem" }}>Color</div>
        <ColorPicker value={colorLow} onChange={setColorLow} />
        <ColorPicker value={colorHigh} onChange={setColorHigh} />
      </ColorPickerContainer>
    </Container>
  );
}
