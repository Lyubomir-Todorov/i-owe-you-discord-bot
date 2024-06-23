import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export default async function getBlacklistedKeywords(
    worksheet: GoogleSpreadsheetWorksheet,
    keywordRange: string
) {
    const keywords = await worksheet.getCellsInRange(keywordRange);

    return keywords ? keywords.flatMap((keyword: string) => keyword) : [];
}
