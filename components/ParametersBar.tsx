import styles from "../styles/ParametersBar.module.css";

export default function ParametersBar(): JSX.Element {
    return (
        <div className={styles.bgc}>
            <div className={styles.title}>
                Parameters
            </div>
        </div>
    );
}