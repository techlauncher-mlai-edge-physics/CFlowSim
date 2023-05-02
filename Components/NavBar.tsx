import styles from "../styles/Navbar.module.css";
import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
// import btn_styles from "../styles/Button.module.scss";

export default function NavBar() {
  return (
    <header className={styles.header}>
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
        <a href="/#">
          <Button type="primary" className={styles.btn}>
            Simulations
          </Button>
        </a>
        <Link href="/AboutPage">
          <Button type="primary" className={styles.btn}>
            About
          </Button>
        </Link>
        <a href="/#">
          <Button type="primary" className={styles.theme_btn}>
            THEMEs
          </Button>
        </a>
        <a href="/#">
          <Button type="primary" className={styles.theme_btn}>
            Night Mode
          </Button>
        </a>
      </nav>
    </header>
  );
}
