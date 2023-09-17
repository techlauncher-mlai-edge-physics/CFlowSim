import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export default function ParameterLabel(props: {
  title: string;
  tooltip?: string;
}): React.ReactElement {
  const tooltip: React.ReactElement[] = [];
  if (props.tooltip) {
    tooltip.push(
      <Tooltip placement="right" title={props.tooltip}>
        <QuestionCircleOutlined />
      </Tooltip>,
    );
  }
  const label = (
    <div>
      {props.title}&nbsp;&nbsp;{tooltip}
    </div>
  );
  return label;
}
