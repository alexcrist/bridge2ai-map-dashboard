import chroma from "chroma-js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./PieChart.module.css";

// Note: there is matching --chart-radius value in the CSS which must match
//       this value
const CHART_RADIUS = 110;

const MAX_LEGEND_ITEMS = 100;

const INNER_RADIUS = CHART_RADIUS / 2;
const CHART_MARGIN = 20;
const ANGLE_GAP_DEGREES = 3;
const ANGLE_GAP_RADIANS = (ANGLE_GAP_DEGREES / 180) * Math.PI;

const COLOR_HUES = [
    // Primaries
    // 0 - no red
    120, 240,
    // Secondaries
    60, 180, 300,
    // Tertiaries
    30, 90, 150, 210, 270,
];
const COLORS = COLOR_HUES.map((hue) => {
    return chroma.hsl(hue, 0.7, 0.7).hex();
});

const PieChart = ({ title, data }) => {
    // Calculate pie chart slice shapes and colors
    const chartData = useMemo(() => {
        const valueSum = data.reduce((sum, { value }) => sum + value, 0);
        let startAngle = 0;
        const totalRadians = 2 * Math.PI - ANGLE_GAP_RADIANS * data.length;
        return data.map(({ id, value }, index) => {
            const colorIndex = index % COLORS.length;
            const fillColor = COLORS[colorIndex];
            const borderColor = chroma(fillColor).darken(1).hex();
            const angle = (value / valueSum) * totalRadians;
            const largeArc = angle > Math.PI ? 1 : 0;

            // Values for outer radius of donut
            const x1o =
                CHART_RADIUS +
                CHART_RADIUS * Math.cos(startAngle) +
                CHART_MARGIN;
            const y1o =
                CHART_RADIUS +
                CHART_RADIUS * Math.sin(startAngle) +
                CHART_MARGIN;
            const x2o =
                CHART_RADIUS +
                CHART_RADIUS * Math.cos(startAngle + angle) +
                CHART_MARGIN;
            const y2o =
                CHART_RADIUS +
                CHART_RADIUS * Math.sin(startAngle + angle) +
                CHART_MARGIN;

            // Values for inner radius of donut
            const x2i =
                CHART_RADIUS +
                INNER_RADIUS * Math.cos(startAngle + angle) +
                CHART_MARGIN;
            const y2i =
                CHART_RADIUS +
                INNER_RADIUS * Math.sin(startAngle + angle) +
                CHART_MARGIN;
            const x1i =
                CHART_RADIUS +
                INNER_RADIUS * Math.cos(startAngle) +
                CHART_MARGIN;
            const y1i =
                CHART_RADIUS +
                INNER_RADIUS * Math.sin(startAngle) +
                CHART_MARGIN;

            startAngle += angle + ANGLE_GAP_RADIANS;
            return {
                id,
                value,
                fillColor,
                borderColor,
                x1o,
                y1o,
                x2o,
                y2o,
                x1i,
                y1i,
                x2i,
                y2i,
                largeArc,
            };
        });
    }, [data]);

    // Upon hovering SVG (show / hide tooltip)
    const svgRef = useRef(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredMousePosition, setHoveredMousePosition] = useState(null);
    const onMouseLeaveSvg = useCallback(() => {
        setHoveredItem(null);
        setHoveredMousePosition(null);
    }, []);
    useEffect(() => {
        const onMouse = (event) => {
            if (
                svgRef.current &&
                event.target.tagName === "path" &&
                svgRef.current.contains(event.target)
            ) {
                setHoveredMousePosition({
                    x: event.clientX,
                    y: event.clientY,
                });
                const id = event.target?.id;
                const item = chartData.find((item) => item.id === id);
                if (item) {
                    setHoveredItem(item);
                }
            } else {
                setHoveredItem(null);
                setHoveredMousePosition(null);
            }
        };
        const onTouchStart = (event) => {
            const mouseEvent = {
                target: event.target,
                clientX: event.touches[0].clientX,
                clientY: event.touches[0].clientY,
            };
            onMouse(mouseEvent);
        };
        document.addEventListener("touchstart", onTouchStart);
        document.addEventListener("mousedown", onMouse);
        document.addEventListener("mousemove", onMouse);
        return () => {
            document.removeEventListener("touchstart", onTouchStart);
            document.removeEventListener("mousedown", onMouse);
            document.removeEventListener("mousemove", onMouse);
        };
    }, [chartData]);

    return (
        <div className={styles.pieChartContainer}>
            <div className={styles.pieChartHeader}>{title}</div>
            <div className={styles.pieChart}>
                <svg
                    ref={svgRef}
                    onMouseLeave={onMouseLeaveSvg}
                    className={styles.svg}
                    width={(CHART_RADIUS + CHART_MARGIN) * 2}
                    height={(CHART_RADIUS + CHART_MARGIN) * 2}
                >
                    {chartData.map((item) => {
                        const {
                            id,
                            fillColor,
                            borderColor,
                            x1o,
                            y1o,
                            x2o,
                            y2o,
                            x1i,
                            y1i,
                            x2i,
                            y2i,
                            largeArc,
                        } = item;
                        const d = [
                            `M${x1o},${y1o}`,
                            `A${CHART_RADIUS},${CHART_RADIUS} 0 ${largeArc} 1 ${x2o},${y2o}`,
                            `L${x2i},${y2i}`,
                            `A${INNER_RADIUS},${INNER_RADIUS} 0 ${largeArc} 0 ${x1i},${y1i}`,
                            `Z`,
                        ].join(" ");
                        return (
                            <path
                                id={item.id}
                                className={styles.path}
                                key={id}
                                d={d}
                                fill={fillColor}
                                stroke={borderColor}
                                strokeWidth={2}
                            />
                        );
                    })}
                </svg>
                {hoveredItem && hoveredMousePosition && (
                    <div
                        className={styles.tooltip}
                        style={{
                            left: `${hoveredMousePosition.x}px`,
                            top: `${hoveredMousePosition.y - 20}px`,
                        }}
                    >
                        <div className={styles.tooltipInner}>
                            <div
                                className={styles.tooltipColor}
                                style={{
                                    background: hoveredItem?.fillColor,
                                    border: `2px solid ${hoveredItem?.borderColor}`,
                                }}
                            />
                            {hoveredItem?.id}: {hoveredItem?.value}
                        </div>
                    </div>
                )}
                <div className={styles.legend}>
                    {chartData.slice(0, MAX_LEGEND_ITEMS).map((item) => {
                        return (
                            <div className={styles.legendItem} key={item.id}>
                                <div
                                    className={styles.tooltipColor}
                                    style={{
                                        background: item?.fillColor,
                                        border: `2px solid ${item?.borderColor}`,
                                    }}
                                />
                                {item.id}: {item.value}
                            </div>
                        );
                    })}
                    {chartData.length > MAX_LEGEND_ITEMS && (
                        <div className={styles.ellipsis}>...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PieChart;
