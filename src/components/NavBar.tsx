import { Button } from 'antd';
import { useState } from 'react';

// for themes switching
import styled from 'styled-components';

interface NavBarProps {
  setCurThemeMode: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 5rem;
  background-color: ${(props) =>
    (props.theme.light as boolean) ? '#004b87' : '#142c3f'};
  color: ${(props) => ((props.theme.light as boolean) ? '#f5f5f5' : '#9faee5')};
`;

const LogoAnchor = styled.a`
  margin: 0 1rem;
  color: #eee;
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  border: 1px solid #000000;
  filter: invert(100%);
  position: relative;
  width: 65px;
  height: 65px;
  color: #eee;
`;

const Name = styled.div`
  position: relative;
  left: 1.4rem;
  bottom: 0.2rem;
  font-family: 'Darumadrop One', cursive;
  font-size: 2.3rem;
`;

const ButtonGroup = styled.nav`
  display: flex;
  position: absolute;
  right: 1rem;
  flex-direction: row;
  align-items: center;
  margin-right: 2rem;
  @media (max-width: 760px) {
    display: none;
  }
`;

const ThemeButton = styled.button`
  font-family: 'Source Code Pro', monospace;
  font-size: 0.8rem;
  color: #000000;
  background-color: #f3f3f3;
  height: 2.7rem;
  width: 4.5rem;
  margin: 0 0.1rem;
  cursor: pointer;
`;

const NavButton = styled(Button)`
  color: #eeeeee;
  background-color: #00a9ce;
  height: 3.2rem;
  width: 8rem;
  margin: 0 0.2rem;
  cursor: pointer;
  @media (max-width: 760px) {
    margin-bottom: 0.2rem;
  }
`;

const HamburgerBar = styled.button`
  display: inline;
  width: 2rem;
  height: 9rem;
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  position: absolute;
  right: 2rem;
  cursor: pointer;
  @media (min-width: 760px) {
    display: none;
  }
`;

const ExtendContainer = styled.nav`
  display: inline;
  flex-direction: column;
  align-items: center;
  width: 8.4rem;
  height: 15rem;
  position: absolute;
  top: 4.5rem;
  right: 1rem;
  margin-bottom: 1rem;
  @media (min-width: 760px) {
    display: none;
  }
`;

export default function NavBar(props: NavBarProps): React.ReactElement {
  const { setCurThemeMode, setPage } = props;
  const [isShowExtend, setIsShowExtend] = useState(false);

  return (
    <Header>
      <LogoAnchor href="/">
        <Logo
          src="/physics.svg"
          alt="Physics in the Browser Logo "
          width={50}
          height={50}
        />
        <Name>CFlowSim</Name>
      </LogoAnchor>
      <HamburgerBar
        onClick={() => {
          setIsShowExtend((curr) => !curr);
        }}
      >
        {isShowExtend ? <>&#10005;</> : <>&#8801;</>}
      </HamburgerBar>

      <ButtonGroup>
        <NavButton
          type="primary"
          onClick={() => {
            setPage(0);
          }}
        >
          Simulations
        </NavButton>
        <NavButton
          type="primary"
          onClick={() => {
            setPage(1);
          }}
        >
          About
        </NavButton>
        <ThemeButton
          onClick={() => {
            setCurThemeMode('light');
          }}
        >
          Light
        </ThemeButton>
        <ThemeButton
          onClick={() => {
            setCurThemeMode('dark');
          }}
        >
          Dark
        </ThemeButton>
      </ButtonGroup>
      {isShowExtend ? (
        <ExtendContainer>
          <NavButton
            type="primary"
            onClick={() => {
              setPage(0);
            }}
          >
            Simulations
          </NavButton>
          <NavButton
            type="primary"
            onClick={() => {
              setPage(1);
            }}
          >
            About
          </NavButton>
          <ThemeButton
            onClick={() => {
              setCurThemeMode('light');
            }}
          >
            Light
          </ThemeButton>
          <ThemeButton
            onClick={() => {
              setCurThemeMode('dark');
            }}
          >
            Dark
          </ThemeButton>
        </ExtendContainer>
      ) : null}
    </Header>
  );
}
