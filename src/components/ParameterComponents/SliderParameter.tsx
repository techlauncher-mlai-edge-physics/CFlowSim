import styled from 'styled-components';
import { useState } from "react";

const Slider = styled.input`
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 15rem;
  height: 24px;
  display: block;

  &::-webkit-slider-runnable-track,
  &::-moz-range-track {
    background: rgb(217,217,217);
    height:100%;
  }
  &::-webkit-slider-thumb,
  &::-moz-range-thumb {
    background: rgb(32,32,32);
    height:100%;
    width:10px;
    border:none;
    border-radius:0;
  }
`

export default function SliderParameter(props: {
  onChange: (value: number)=> void,
  lowerBound: number,
  upperBound: number,
  initValue?: number,
}): React.ReactElement {

  const [value, setValue] = useState(props.lowerBound)
  if (props.initValue) {
    setValue(props.initValue)
  }

  return (
  <>
    <Slider type="range" min={props.lowerBound} max={props.upperBound} defaultValue={value} onChange={(e) => {const val = parseFloat(e.target.value); setValue(val), props.onChange(val)}} />
  </>
  );
}