import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd"
import styled from 'styled-components';

const Lab = styled.div`
  align-items:center;
  height: 100%;
  display:flex;
`;

export default function ParameterLabel(props: {
  title: string,
  tooltip?: string,
}): React.ReactElement {
  const tooltip: React.ReactElement[] = []
  if (props.tooltip) {
    tooltip.push(<Tooltip placement="right" title={props.tooltip}><QuestionCircleOutlined /></Tooltip>)
  }

  return (
    <Lab>
      {props.title}&nbsp;&nbsp;{tooltip}
    </Lab>
  )
}
