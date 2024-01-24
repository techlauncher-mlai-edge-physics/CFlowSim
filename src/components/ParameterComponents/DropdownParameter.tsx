import styled from 'styled-components';
import { useState } from 'react';

const Select = styled.select`
  -webkit-appearance: none;
  appearance: none;
  width: 15rem;
  display: block;
  border: black 1px solid;
  background: rgb(217, 217, 217);
  margin: 5px 0;
  padding: 0 5px;
  height: 24px;
`;

export default function DropdownParameter(props: {
  onChange: (value: string) => void;
  values: string[];
  initValue?: string;
}): JSX.Element {
  const [value, setValue] = useState(props.values[0]);
  if (props.initValue !== undefined) {
    setValue(props.initValue);
  }
  return (
    <Select
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        props.onChange(e.target.value);
      }}
    >
      {props.values.map((val) => (
        // use value as key, this asserts that the values are unique
        // CAUTION: this is true when I wrote this, but may not be true in the future
        <option key={val} value={val}>
          {val}
        </option>
      ))}
    </Select>
  );
}
