import { spreadsheet } from "../spreadsheet";

export async function getWorksheet(month: string) {
    const worksheetCurrentMonth = spreadsheet.sheetsByTitle[month];

    if (!worksheetCurrentMonth)
        throw new Error(`Worksheet for ${month} was not found`);

    return worksheetCurrentMonth;
}
