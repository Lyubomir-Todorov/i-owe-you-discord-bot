import { config } from "src/config";
import getWorksheet from "../get-worksheet";
import getRecurringPayments from "./get-recurring-payments";

export default async function processRecurringPayments() {
    const worksheet = await getWorksheet(config.RECURRING_WORKSHEET_NAME);
    await worksheet.loadCells("A1:Z1000");

    await getRecurringPayments(worksheet);

    worksheet.resetLocalCache(true);
}