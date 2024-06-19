import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import getFurthestWorksheetColumn from "../get-furthest-worksheet-column";
import { config } from "src/config";

export default async function getRecurringPayments(
    worksheet: GoogleSpreadsheetWorksheet
) {
    const furthestColumn = getFurthestWorksheetColumn([
        config.RECURRING_WORKSHEET_DISABLED_COLUMN,
        config.RECURRING_WORKSHEET_DESCRIPTION_COLUMN,
        config.RECURRING_WORKSHEET_AMOUNT_COLUMN,
        config.RECURRING_WORKSHEET_CATEGORY_COLUMN,
        config.RECURRING_WORKSHEET_PURCHASER_COLUMN,
        config.RECURRING_WORKSHEET_FREQUENCY_COLUMN,
        config.RECURRING_WORKSHEET_LAST_PURCHASED_COLUMN,
    ]);

    const data = await worksheet.getCellsInRange(
        `A${config.RECURRING_WORKSHEET_ROW_OFFSET}:Z1000`
    );
    console.log(data);
    return data;
}
