import aboutContent from '../../README.md';
import styled from 'styled-components';

const Content = styled.div`
  text-align:left;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: 4%;
  margin-bottom: 8%;
  font-family: 'Roboto', sans-serif;
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

export default function AboutPage(): React.ReactElement {
  return (
    <>
      <Content>
        <div dangerouslySetInnerHTML={{ __html: aboutContent as string }} />
      </Content>
    </>
  );
  // return aboutContent as React.ReactElement
  // return <div dangerouslySetInnerHTML={{ __html: aboutContent as string }} />;
}
