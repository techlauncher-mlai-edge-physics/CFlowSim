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

export const ThemeButton = styled.button`
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
`;