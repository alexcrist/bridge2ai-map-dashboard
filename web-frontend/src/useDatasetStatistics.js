import _ from "lodash";
import { useEffect, useState } from "react";
import {
    FaDatabase,
    FaEarthEurope,
    FaHeadset,
    FaLanguage,
    FaUserGroup,
    FaUsers,
} from "react-icons/fa6";
import { getGoogleSheet } from "./getGoogleSheet";

export const useDatasetStatistics = () => {
    const [stats, setStats] = useState({
        cardStats: [],
        pieCharts: [],
    });
    useEffect(() => {
        (async () => {
            const newStats = await getStats();
            setStats(newStats);
        })();
    }, []);
    return stats;
};

const getStats = async () => {
    let numDatasets = 0;
    let numParticipants = 0;
    let numSamples = 0;

    const countryCounter = new Counter();
    const languageCounter = new Counter();
    const diseaseCategoryCounter = new Counter();
    const speechTaskCounter = new Counter();
    const accessibilityCounter = new Counter();

    const csv = await getGoogleSheet();
    console.log("csv[0]", csv[0]);
    for (const row of csv) {
        numDatasets++;
        numParticipants += getNumericalValue(row, "numberofparticipants");
        numSamples += getNumericalValue(row, "ofsamples");
        const countryCode = getTextValue(row, "countrycode");
        countryCounter.add(countryCode);
        const language = getTextValue(row, "language");
        languageCounter.add(language);
        const diseaseCategory = getTextValue(row, "diseasecategory");
        diseaseCategoryCounter.add(diseaseCategory);
        const speechTask = getTextValue(row, "speechtasks");
        speechTaskCounter.add(speechTask);
        const accessibility = getTextValue(row, "accessibility");
        accessibilityCounter.add(accessibility);
    }
    const cardStats = getCardStats(
        numDatasets,
        numParticipants,
        numSamples,
        countryCounter,
        languageCounter,
    );
    const pieCharts = getPieCharts(
        languageCounter,
        diseaseCategoryCounter,
        speechTaskCounter,
        accessibilityCounter,
    );
    return { cardStats, pieCharts };
};

const getCardStats = (
    numDatasets,
    numParticipants,
    numSamples,
    countryCounter,
    languageCounter,
) => {
    const avgNumParticipants = Math.round(numParticipants / numDatasets);
    const numCountries = countryCounter.getKeys().length;
    const numLanguages = languageCounter.getKeys().length;
    return [
        {
            label: "Datasets",
            value: formatInteger(numDatasets),
            Icon: FaDatabase,
        },
        {
            label: "Participants on Average",
            value: formatInteger(avgNumParticipants),
            Icon: FaUserGroup,
        },
        {
            label: "Total Participants",
            value: formatInteger(numParticipants),
            Icon: FaUsers,
        },
        {
            label: "Audio Samples",
            value: formatInteger(numSamples),
            Icon: FaHeadset,
        },
        {
            label: "Countries",
            value: formatInteger(numCountries),
            Icon: FaEarthEurope,
        },
        {
            label: "Languages",
            value: formatInteger(numLanguages),
            Icon: FaLanguage,
        },
    ];
};

const getPieCharts = (
    languageCounter,
    diseaseCategoryCounter,
    speechTaskCounter,
    accessibilityCounter,
) => {
    return [
        getPieChart({
            title: "Languages",
            counter: languageCounter,
            skipKeys: ["Not Reported"],
        }),
        getPieChart({
            title: "Disease Categories",
            counter: diseaseCategoryCounter,
        }),
        getPieChart({
            title: "Speech Tasks",
            counter: speechTaskCounter,
        }),
        getPieChart({
            title: "Accessibility",
            counter: accessibilityCounter,
        }),
    ];
};

const getPieChart = ({ title, counter, skipKeys = [] }) => {
    const data = _(counter.counts)
        .entries()
        .map(([category, count]) => {
            return {
                id: formatCategoryLabel(category),
                value: count,
            };
        })
        .filter(({ id }) => !skipKeys.includes(id))
        .sortBy("value")
        .value();
    return { title, data };
};

const formatCategoryLabel = (category) => {
    return category.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatInteger = (integer) => {
    return integer.toLocaleString();
};

const getNumericalValue = (row, key) => {
    const value = row[key];
    if (
        value === "" ||
        value === undefined ||
        value === null ||
        isNaN(Number(value))
    ) {
        return 0;
    }
    return Number(value);
};

const getTextValue = (row, key) => {
    const value = row[key];
    if (value === undefined || value === null || typeof value !== "string") {
        return "";
    }
    return value.trim().toLowerCase();
};

class Counter {
    constructor() {
        this.counts = {};
    }

    add(value) {
        this.counts[value] ??= 0;
        this.counts[value]++;
    }

    getKeys() {
        return Object.keys(this.counts);
    }
}
