// import "../../styles/Navbar.module.css";
import styles from "../styles/Navbar.module.css";
import { Button } from "antd";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className={styles.header}>
      <div>
        <a href="/">
          <Image
            className={styles.logo}
            src="/physics.svg"
            alt="Next.js Logo"
            width={50}
            height={50}
            priority
          />
        </a>
      </div>
      <div className={styles.description}>Physics in the Browser</div>
      <nav className={styles.nav}>
        <a href="/#">
          <Button type="primary" className={styles.btn}>
            Simulations
          </Button>
        </a>
        <a href="/#">
          <Button type="primary" className={styles.btn}>
            About
          </Button>
        </a>
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
