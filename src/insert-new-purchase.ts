import { config } from "./config";
import { getCurrentMonthWorksheet } from "./spreadsheet/get-current-month-worksheet";
import getFurthestWorksheetColumn from "./spreadsheet/get-furthest-worksheet-column";
import { getInsertionRowIndex } from "./spreadsheet/get-insertion-row-index";

export async function insertNewPurchase(
    description: string,
    category: string,
    split: string = "50/50",
    purchaser: "person1" | "person2",
    amount: number
) {
    const worksheet = await getCurrentMonthWorksheet();
    if (!worksheet) {
        throw new Error("Current month worksheet not found");
    }

    const furthestColumn = getFurthestWorksheetColumn([
        config.WORKSHEET_DATE_COLUMN,
        config.WORKSHEET_DESCRIPTION_COLUMN,
        config.WORKSHEET_CATEGORY_COLUMN,
        config.WORKSHEET_PERSON_1_AMOUNT_COLUMN,
        config.WORKSHEET_PERSON_2_AMOUNT_COLUMN,
        config.WORKSHEET_SPLIT_AMOUNT_COLUMN,
    ]);

    await worksheet.loadCells(`A1:${furthestColumn}`);
    const startIndex = await getInsertionRowIndex();

    const dateCell = worksheet.getCellByA1(
        `${config.WORKSHEET_DATE_COLUMN}${startIndex}`
    );
    dateCell.value = new Date().toDateString();

    const descriptionCell = worksheet.getCellByA1(
        `${config.WORKSHEET_DESCRIPTION_COLUMN}${startIndex}`
    );
    descriptionCell.value = description;

    const categoryCell = worksheet.getCellByA1(
        `${config.WORKSHEET_CATEGORY_COLUMN}${startIndex}`
    );
    categoryCell.value = category;

    const splitCell = worksheet.getCellByA1(
        `${config.WORKSHEET_SPLIT_AMOUNT_COLUMN}${startIndex}`
    );
    splitCell.value = split;

    const purchaserColumn =
        purchaser === "person1"
            ? config.WORKSHEET_PERSON_1_AMOUNT_COLUMN
            : config.WORKSHEET_PERSON_2_AMOUNT_COLUMN;
    const amountCell = worksheet.getCellByA1(`${purchaserColumn}${startIndex}`);
    amountCell.value = amount;

    await worksheet.saveUpdatedCells();
    worksheet.resetLocalCache(true);
}
