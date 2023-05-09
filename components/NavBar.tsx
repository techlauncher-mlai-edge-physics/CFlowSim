import styles from "../styles/Navbar.module.css";
import {Button} from "antd";
import Image from "next/image";
import Link from "next/link";

// for themes switching
import {useState} from "react";
import {ThemeButton} from "../styles/theme/ThemeSwitching.styled";

export default function NavBar(): React.ReactElement {
    const [selectedTheme, setSelectedTheme] = useState('light');
    const changeTheme = (theme: string): void => {
        console.log('click button ' + theme)
        setSelectedTheme(theme);
    }

    return (
        <header className={`${selectedTheme === 'light' ? styles.light_header : styles.dark_header}`}>
            {/*<header className={`${selectedTheme === 'light' ? 'styles.light_header' : 'styles.dark_header'}`}>*/}
            <div>
                <Link href="/">
                    <Image
                        className={styles.logo}
                        src="/physics.svg"
                        alt="Physics in the Browser Logo"
                        width={50}
                        height={50}
                        priority
                    />
                </Link>
            </div>
            <div className={styles.description}>Physics in the Browser</div>
            <nav className={styles.nav}>
                <Link href="/#">
                    <Button type="primary" className={styles.btn}>
                        Simulations
                    </Button>
                </Link>
                <Link href="/about">
                    <Button type="primary" className={styles.btn}>
                        About
                    </Button>
                </Link>
                <Link href="/#">
                    <Button type="primary" className={styles.theme_btn}>
                        Settings
                    </Button>
                </Link>
                <ThemeButton className={styles.theme_btn} onClick={() => {
                    changeTheme('light')
                }}>Light</ThemeButton>
                <ThemeButton className={styles.theme_btn} onClick={() => {
                    changeTheme('dark')
                }}>Dark</ThemeButton>
            </nav>
        </header>
    );
}
