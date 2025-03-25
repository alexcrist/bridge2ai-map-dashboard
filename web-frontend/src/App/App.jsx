import styles from "./App.module.css";

const App = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerImageContainer}>
                        <img
                            className={styles.headerImage1}
                            src="/bridge2aivoice.png"
                            alt="Bridge2AI Voice logo"
                        />
                        <img
                            className={styles.headerImage2}
                            src="/bridge2aivoice.png"
                            alt="Bridge2AI Voice logo"
                        />
                    </div>
                    <div className={styles.headerSeparator} />
                    <h1 className={styles.headerText}>
                        Map Datasets Dashboard
                    </h1>
                    <img
                        className={styles.waveImage}
                        src="/wave.png"
                        alt="Wave design"
                    />
                </div>
                <div className={styles.headerGradientLine}></div>
            </div>
            <div className={styles.content}></div>
            <div className={styles.footer}></div>
        </div>
    );
};

export default App;
