import styles from "./StatCard.module.css";

const StatCard = ({ label, value, Icon }) => {
    return (
        <div className={styles.container}>
            <div className={styles.leftSide}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
            </div>
            <div className={styles.rightSide}>
                <Icon className={styles.icon} size={24} />
            </div>
        </div>
    );
};

export default StatCard;
