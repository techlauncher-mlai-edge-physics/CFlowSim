import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  margin: 5px 0;
`;
const Row = styled.div``;
const Col = styled.span``;
const Button = styled.button`
  -webkit-appearance: none;
  appearance: none;
  border: none;
  padding: 5px 15px;
  border-radius: calc(1rem + 5px);
  color: black;
  background: rgb(217, 217, 217);
  margin-right: 15px;

  &.primary {
    background: rgb(42, 40, 161);
    color: white;
  }
`;

export default function ChoiceParameter(props: {
  onChange: (value: string) => void;
  values: string[];
  initValue?: string;
}): JSX.Element {
  const [value, setValue] = useState(props.values[0]);
  if (props.initValue !== undefined) {
    setValue(props.initValue);
  }
  // split values into rows of 3
  const rows: string[][] = [];
  for (let i = 0; i < props.values.length; i += 3) {
    rows.push(props.values.slice(i * 3, i * 3 + 3));
  }

  return (
    <Container>
      {rows.map((row, rowIndex) => (
        // eslint-disable-next-line @eslint-react/jsx/no-array-index-key
        <Row key={`row-${rowIndex}-${row.join('-')}`}>
          {row.map((val) => (
            <Col key={`col-${val}`}>
              <Button
                data-value={val}
                onClick={() => {
                  setValue(val);
                  props.onChange(val);
                }}
                className={val === value ? 'primary' : 'default'}
              >
                {val}
              </Button>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}
