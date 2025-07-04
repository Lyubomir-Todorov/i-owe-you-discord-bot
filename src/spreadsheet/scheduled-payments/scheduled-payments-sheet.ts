import {googleSheetsClient} from "@app/google-sheets/google-sheets-client";
import {ScheduledPayment} from "@app/models/scheduled-payment";
import {config} from "@app/config";
import {GoogleSpreadsheetRow} from "google-spreadsheet";

export const scheduledPaymentsSheet = {
    async getAll(): Promise<GoogleSpreadsheetRow[]> {
        const sheet = googleSheetsClient.sheetsByTitle[config.SCHEDULED_PAYMENTS_SHEET_NAME];
        await sheet.loadCells();
        return await sheet.getRows();
    },
    toScheduledPayment(row: GoogleSpreadsheetRow): ScheduledPayment {
        return {
            enabled: row.get(config.SCHEDULED_PAYMENTS_COL_DISABLED) === 'FALSE',
            purchase: row.get(config.SCHEDULED_PAYMENTS_COL_DESCRIPTION) as string,
            amount: parseFloat((row.get(config.SCHEDULED_PAYMENTS_COL_AMOUNT) as string).replace(/[^0-9.-]+/g, "")),
            category: row.get(config.SCHEDULED_PAYMENTS_COL_CATEGORY) as string,
            paidBy: row.get(config.SCHEDULED_PAYMENTS_COL_PAID_BY) as string,
            frequency: row.get(config.SCHEDULED_PAYMENTS_COL_FREQUENCY) as string,
            lastPaid: row.get(config.SCHEDULED_PAYMENTS_COL_LAST_PAID) ? new Date(row.get(config.SCHEDULED_PAYMENTS_COL_LAST_PAID) as string) : undefined,
        }
    }
}