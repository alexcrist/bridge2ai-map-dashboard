import { Pie } from "@nivo/pie";
import styles from "./PieChart.module.css";

const WIDTH = 570;
const HEIGHT = 210;
const LABEL_SKIP_ANGLE = 13;

// TODO: convert these to be portrait shaped so that it can work responsively
// * remove arc link labels
// * add legend underneath chart

const PieChart = ({ title, data }) => {
    return (
        <div className={styles.pieChartContainer}>
            <div className={styles.pieChartHeader}>{title}</div>
            <div
                className={styles.pieChart}
                style={{ width: WIDTH, height: HEIGHT }}
            >
                <Pie
                    width={WIDTH}
                    height={HEIGHT}
                    data={data}
                    margin={{
                        top: 30,
                        right: 30,
                        bottom: 30,
                        left: 30,
                    }}
                    theme={{
                        text: {
                            fontSize: 12,
                            fontFamily: "Montserrat, sans-serif",
                        },
                    }}
                    colors={{ scheme: "pastel1" }}
                    innerRadius={0.5}
                    padAngle={1.5}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 1]],
                    }}
                    arcLinkLabelsSkipAngle={LABEL_SKIP_ANGLE}
                    arcLinkLabelsTextColor="#01003a"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{
                        from: "color",
                        modifiers: [["darker", 1]],
                    }}
                    arcLinkLabelsDiagonalLength={5}
                    arcLinkLabelsStraightLength={5}
                    arcLinkLabelsTextOffset={5}
                    arcLabelsSkipAngle={LABEL_SKIP_ANGLE}
                    arcLabelsTextColor={{
                        from: "color",
                        modifiers: [["darker", 3]],
                    }}
                />
            </div>
        </div>
    );
};

export default PieChart;
