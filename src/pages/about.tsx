import aboutContent from '../../docs/about.md';

export default function AboutPage(): React.ReactElement {
  // return aboutContent as React.ReactElement
  return <div dangerouslySetInnerHTML={{ __html: aboutContent as string }} />;
}
