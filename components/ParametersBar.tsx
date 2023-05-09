import styled from "styled-components";

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

export default function ParametersBar(): React.ReactElement {
  return (
    <Container>
      <Title>Parameters</Title>
    </Container>
  );
}
