import { spreadsheet } from "../spreadsheet";

export async function getCurrentMonthWorksheet() {
    const date = new Date();
    const monthLong = date.toLocaleString("default", { month: "long" });
    const monthShort = date.toLocaleString("default", { month: "short" });

    const worksheetCurrentMonth =
        spreadsheet.sheetsByTitle[monthShort] ||
        spreadsheet.sheetsByTitle[monthLong];

    if (!worksheetCurrentMonth)
        throw new Error(`Worksheet for ${monthLong} was not found`);

    return worksheetCurrentMonth;
}
