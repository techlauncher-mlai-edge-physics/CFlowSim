import { Button } from 'antd';

// for themes switching
import { SettingButton } from '../styles/theme/ThemeSwitching.styled.ts';
import styled from 'styled-components';

interface NavBarProps {
  setlightTheme: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  padding: 0 2rem;
  background-color: ${(props) => (props.theme.light ? '#004b87' : '#142c3f')};
  color: ${(props) => (props.theme.light ? '#f5f5f5' : '#9faee5')};
`;

const Logo = styled.img`
  border: 1px solid #000000;
  filter: invert(100%);
  position: absolute;
  width: 65px;
  height: 65px;
  left: 0.5rem;
  top: 0.5rem;
`;

const Name = styled.div`
  position: absolute;
  left: 6.5rem;
  top: 0.5rem;
  font-family: 'Darumadrop One', cursive;
  font-size: 2.3rem;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NavAnchor = styled.a`
  margin: 0 1rem;
  color: #eee;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const ThemeButton = styled.button`
  font-family: 'Source Code Pro', monospace;
  font-size: 0.8rem;
  color: #000000;
  background-color: #f3f3f3;
  height: 2.7rem;
  width: 4.5rem;
`;

const NavButton = styled(Button)`
  color: #eeeeee;
  background-color: #00a9ce;
  height: 3.2rem;
  width: 8rem;
  margin: 0 0.2rem;
`;

export default function NavBar(props: NavBarProps): React.ReactElement {
  const { setlightTheme, setPage } = props;

  return (
    <Header>
      <NavAnchor href="/">
        <Logo
          src="/physics.svg"
          alt="Physics in the Browser Logo "
          width={50}
          height={50}
        />
      </NavAnchor>
      <Name>CFLowSim</Name>
      <Nav>
        <NavButton type="primary" onClick={() => setPage(0)}>
          Simulations
        </NavButton>
        <NavButton type="primary" onClick={() => setPage(1)}>
          About
        </NavButton>
        <SettingButton>Settings</SettingButton>
        <ThemeButton
          onClick={() => {
            setlightTheme(true);
          }}
        >
          Light
        </ThemeButton>
        <ThemeButton
          onClick={() => {
            setlightTheme(false);
          }}
        >
          Dark
        </ThemeButton>
      </Nav>
    </Header>
  );
}
