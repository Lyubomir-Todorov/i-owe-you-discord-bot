import { getCurrentMonthWorksheet } from "./get-current-month-worksheet";
import { config } from "../../config";

export async function getInsertionRowIndex() {
    const worksheetCurrentMonth = await getCurrentMonthWorksheet();

    if (!worksheetCurrentMonth) {
        return;
    }

    const row = config.WORKSHEET_PURCHASE_ROW_OFFSET;
    const column = config.WORKSHEET_DATE_COLUMN;

    const data = await worksheetCurrentMonth.getCellsInRange(
        `${column}${row}:${column}`
    );

    if (!data) {
        return Number(row);
    }

    return data.length + Number(row);
}
