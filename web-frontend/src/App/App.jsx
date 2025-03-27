import { useIsGoogleSheetLoading } from "../getGoogleSheet";
import PieChart from "../PieChart/PieChart";
import StatCard from "../StatCard/StatCard";
import { useDatasetStatistics } from "../useDatasetStatistics";
import styles from "./App.module.css";

const App = () => {
    const isGoogleSheetLoading = useIsGoogleSheetLoading();
    const { cardStats, pieCharts } = useDatasetStatistics();

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
                        className={styles.waveImageHeader}
                        src="/wave1.png"
                        alt="Wave design"
                    />
                </div>
                <div className={styles.headerGradientLine}></div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentItem}>
                    <div className={styles.contentItemLeft} />
                    <div className={styles.contentItemRight}>
                        <h2 className={styles.contentTitle}>
                            Global Voice Datasets Repository Map
                        </h2>
                        <div className={styles.contentSubtitle}>
                            Accessibility, Licensing, and Research Ethics
                        </div>
                        <div className={styles.contentPreviewDescription}>
                            <a
                                href="https://map.b2ai-voice.org/"
                                target="_"
                                className={styles.contentLink}
                            >
                                <img
                                    className={styles.contentImage}
                                    src="voicedatagovernance.png"
                                    alt="Voice data governance website screenshot"
                                />
                            </a>
                            {"\t"}This map tracks publicly accessible speech and
                            voice datasets collected for neurological, mood, and
                            speech disorder research in different countries.
                            Information about the institutional source of the
                            datasets, the number of speakers, languages, and
                            types of voice samples are included, but the focus
                            of the map is on the governance of these voice
                            datasets. The type of accessibility (open or
                            safeguarded), access instructions, and licensing are
                            detailed and can be compared between datasets,
                            institutions, and countries/regions. This map
                            complements a forthcoming searchable tool that can
                            be used to find voice datasets specific to disease
                            categories, diagnoses, or vocal tasks.
                            {"\n"}
                            {"\t"}In an upcoming iteration of the map, a
                            research ethics element will be added to the dataset
                            information, focusing on the informed consent
                            process that participants went through to contribute
                            their voice data. The aim is to provide information
                            about the research ethics process and related
                            documentation (e.g., consent forms, IRB/REB
                            documentation) to make these datasets more easily
                            useable for researchers whose institutions have
                            stringent data governance requirements.
                        </div>
                        {isGoogleSheetLoading ? (
                            <div className={styles.loading}>
                                Loading dataset statistics...
                            </div>
                        ) : null}
                        <div className={styles.statCards}>
                            {cardStats.map((stat, index) => {
                                return (
                                    <StatCard
                                        key={`${stat.label}-${index}`}
                                        {...stat}
                                    />
                                );
                            })}
                        </div>
                        <div className={styles.pieCharts}>
                            {pieCharts.map((pieChart) => {
                                return (
                                    <PieChart
                                        key={pieChart.title}
                                        {...pieChart}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className={styles.spacer}></div>
            </div>

            <div className={styles.footer}></div>
        </div>
    );
};

export default App;
