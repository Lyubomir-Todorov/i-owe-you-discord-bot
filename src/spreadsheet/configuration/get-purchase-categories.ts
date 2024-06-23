import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { PurchaseCategory } from "src/types";

export default async function getPurchaseCategories(
    worksheet: GoogleSpreadsheetWorksheet,
    range: string
) {
    const data = await worksheet.getCellsInRange(range);
    return data.map((row: string[]) => {
        const keywordsRaw = row.slice(1);
        const keywords = keywordsRaw
            .flatMap((keyword) => {
                const formattedKeyword = keyword.includes(" ")
                    ? keyword.replaceAll(" ", "")
                    : "";
                return [keyword, formattedKeyword];
            })
            .filter((x) => x !== "");

        return {
            name: row[0],
            keywords: keywords,
        } as PurchaseCategory;
    });
}
