import { ReactComponent } from '../../README.md';
import styled from 'styled-components';

const Content = styled.div`
  background-color: ${(props) =>
    (props.theme.light as boolean) ? '#ffffff' : '#707070'};
  text-align: justify;
  margin-left: 20%;
  margin-right: 20%;
  margin-bottom: 5%;
  font-family: 'Roboto', sans-serif;
  color: ${(props) => ((props.theme.light as boolean) ? '#333333' : '#c9c9c9')};
  a:link {
    text-decoration: none;
  }
  a:visited {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  a:active {
    text-decoration: underline;
  }
`;

export default function AboutPage(): JSX.Element {
  return (
    <Content>
      <ReactComponent />
    </Content>
  );
}
