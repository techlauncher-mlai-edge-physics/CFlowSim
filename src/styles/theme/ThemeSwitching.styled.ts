import styled from "styled-components";

// export const ThemeContainer = styled.div`
//   background-color: hsl(0, 0%, 100%);
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   align-items: center;
//   padding: 10px;
//   border-bottom: 1px solid hsl(0, 0%, 87%);
// `;

export const ThemeModeButton = styled.button`
  margin: 0 4px;
  padding: 10px;
  font-size: 0.5rem;
  border: 1px solid hsl(0, 0%, 87%);
  border-radius: 5px;
  width: 30px;
  height: 15px;
  cursor: pointer;
  &:hover {
    box-shadow: 2px 2px 2px hsl(0, 0%, 87%);
  }
`;

export const SettingButton = styled.button`
  font-family: "Source Code Pro", monospace;
  font-size: 0.8rem;
  color: #000000;
  background-color: #f3f3f3;
  height: 2.7rem;
  width: 6.5rem;
`;
