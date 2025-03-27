import Papa from "papaparse";
import { useEffect, useState } from "react";

const GOOGLE_SHEET_PROMISE = (async () => {
    let data = [];
    try {
        const res = await fetch(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vRhVfbSe0_jQBHdqbssbutK2n77y0KyB5Th2E70C3whkSoxMFnuBfkD7xjnHU1VIA/pub?gid=1792955439&single=true&output=csv",
        );
        const csvText = await res.text();
        const result = Papa.parse(csvText, {
            header: true,
            transformHeader: (header) =>
                header
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/gi, ""),
        });
        data = result.data;
    } catch (error) {
        alert("Error loading datasets CSV.");
        console.error(error);
    }
    return data;
})();

export const getGoogleSheet = async () => {
    const googleSheet = await GOOGLE_SHEET_PROMISE;
    return googleSheet;
};

export const useIsGoogleSheetLoading = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        (async () => {
            await GOOGLE_SHEET_PROMISE;
            setIsLoading(false);
        })();
    }, []);
    return isLoading;
};
