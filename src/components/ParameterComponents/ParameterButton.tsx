import styled from 'styled-components';

const ParamButton = styled.button`
  border-radius: 20px;
  height: 35px;
  width: 100%;
  padding: 10px 20px 7px 20px;
  background-color: #D9D9D9;
  color: #464646;
  font-size: 14px;
  border: none;
  cursor: pointer;
`

export default function ParameterButton(props : {
    label: string;
    onClick?: () => void;
}){
    return (
        <ParamButton onClick={props.onClick}>
            {props.label}
        </ParamButton>
    )
}
