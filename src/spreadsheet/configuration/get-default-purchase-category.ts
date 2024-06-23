import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export default function getDefaultPurchaseCategory(
    worksheet: GoogleSpreadsheetWorksheet,
    defaultPurchaseCategoryCell: string
) {
    const data = worksheet.getCellByA1(defaultPurchaseCategoryCell);
    return data.value;
}
