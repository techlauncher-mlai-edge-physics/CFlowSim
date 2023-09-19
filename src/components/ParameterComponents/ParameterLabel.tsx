import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import styled from 'styled-components';

const Lab = styled.div`
  align-items: center;
  height: 100%;
  display: flex;
  font-weight: bold;
`;

const Styled = styled(Tooltip)`
  .ant-tooltip-inner {
    font-weight: normal;
    color: #cfcfcf;
  }
`;

export default function ParameterLabel(props: {
  title: string;
  tooltip?: string;
}): React.ReactElement {
  const tooltip: React.ReactElement[] = [];
  if (props.tooltip !== null) {
    tooltip.push(
      <Styled>
        <Tooltip
          placement="right"
          title={props.tooltip}
          getPopupContainer={(tn) => tn}
        >
          <QuestionCircleOutlined />
        </Tooltip>
      </Styled>,
    );
  }

  return (
    <Lab>
      {props.title}&nbsp;&nbsp;{tooltip}
    </Lab>
  );
}
