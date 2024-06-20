import { differenceInDays } from "date-fns";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { config } from "src/config";
import { RecurringPurchase, RecurringPurchaseFrequency } from "src/types";

export default async function getRecurringPayments(
    worksheet: GoogleSpreadsheetWorksheet
) {
    const purchaseAmountRegExp = new RegExp(/\d+(\.\d+)?/);

    await worksheet.loadHeaderRow(
        Number(config.RECURRING_WORKSHEET_ROW_OFFSET) - 1
    );
    var rows = await worksheet.getRows();
    for (const row of rows) {
        const {
            enabled,
            description,
            amount,
            purchaser,
            category,
            frequency,
            lastRunDate,
        }: RecurringPurchase = {
            enabled: row.get("Disabled") === "FALSE",
            description: String(row.get("Description")).trim(),
            amount: Number(purchaseAmountRegExp.exec(row.get("Amount"))?.[0]),
            purchaser: String(row.get("Purchaser")).trim(),
            category: row.get("Category"),
            frequency: row.get("Frequency") as RecurringPurchaseFrequency,
            lastRunDate: row.get("Last time added")
                ? new Date(row.get("Last time added"))
                : null,
        };

        if (
            !enabled ||
            !description ||
            !amount ||
            !purchaser ||
            !category ||
            !frequency
        ) {
            continue;
        }

        if (!lastRunDate) {
            console.log(`Purchase ${description} has never been made`);
            row.assign({ "Last time added": new Date() });
            row.save();
            continue;
        }

        const difference = differenceInDays(new Date(), lastRunDate);
        if (difference >= Number(RecurringPurchaseFrequency[frequency])) {
            // Make purchase
            console.log(`Purchase ${description} is due`);
        }
    }
}
