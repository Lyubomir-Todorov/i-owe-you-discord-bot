import { spreadsheet } from "./spreadsheet";

export async function getCurrentMonthWorksheet() {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "long" });

    const worksheetCurrentMonth = spreadsheet.sheetsByTitle[month];

    if (!worksheetCurrentMonth) {
        throw new Error(`Worksheet for ${month} was not found`);
    }

    return worksheetCurrentMonth;
}
