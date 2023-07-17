import styles from "../styles/Navbar.module.css";
import { Button } from "antd";

// for themes switching
import { SettingButton } from "../styles/theme/ThemeSwitching.styled.ts";
import styled from "styled-components";

interface NavBarProps {
  lightTheme: boolean;
  setlightTheme: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function NavBar(props: NavBarProps): React.ReactElement {
  const { lightTheme, setlightTheme, page, setPage } = props;

  return (
    <header
      className={`${lightTheme ? styles.light_header : styles.dark_header}`}
    >
      <div>
        <a href="/">
          <img
            className={`${
              lightTheme === "light" ? styles.logo_light : styles.logo_dark
            }`}
            src="/physics.svg"
            alt="Physics in the Browser Logo"
            width={50}
            height={50}
          />
        </a>
      </div>
      <div className={styles.description}>CFLowSim</div>
      <nav className={styles.nav}>
        <Button
          type="primary"
          className={styles.btn}
          onClick={() => setPage(0)}
        >
          Simulations
        </Button>
        <Button
          type="primary"
          className={styles.btn}
          onClick={() => setPage(1)}
        >
          About
        </Button>
        <SettingButton className={styles.setting_btn}>Settings</SettingButton>
        <button
          className={styles.theme_btn}
          onClick={() => {
            setlightTheme(true);
          }}
        >
          Light
        </button>
        <button
          className={styles.theme_btn}
          onClick={() => {
            setlightTheme(false);
          }}
        >
          Dark
        </button>
      </nav>
    </header>
  );
}
