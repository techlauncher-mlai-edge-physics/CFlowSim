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
  return (
    <Lab key={props.title}>
      <>
      {props.title}&nbsp;&nbsp;
      { props.tooltip !== undefined &&
        <Styled>
          <Tooltip
            placement="right"
            title={props.tooltip}
            key={props.tooltip}
            getPopupContainer={(tn) => tn}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Styled>
      }
      </>
    </Lab>
  );
}
