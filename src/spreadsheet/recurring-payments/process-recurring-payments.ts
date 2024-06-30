import { differenceInDays } from "date-fns";
import { config } from "src/config";
import { insertNewPurchase } from "src/insert-new-purchase";
import { RecurringPurchase, RecurringPurchaseFrequency } from "src/types";
import { getConfiguration } from "../configuration";
import getWorksheet from "../get-worksheet";

export default async function processRecurringPayments(): Promise<
    RecurringPurchase[]
> {
    console.info(
        `Starting processing recurring payments at ${new Date().toISOString()}...`
    );
    const worksheet = await getWorksheet(config.RECURRING_WORKSHEET_NAME);
    const configuration = await getConfiguration();

    const nonMatchingDigitRegExp = new RegExp(/[^\d|\.]/g);

    await worksheet.loadHeaderRow(
        Number(config.RECURRING_WORKSHEET_ROW_OFFSET) - 1
    );

    const successfulRecurringPayments: RecurringPurchase[] = [];
    var rows = await worksheet.getRows();
    for (const row of rows) {
        const rowEnabled =
            row.get(config.RECURRING_WORKSHEET_DISABLED_COLUMN) === "FALSE";

        const rowDescription = String(
            row.get(config.RECURRING_WORKSHEET_DESCRIPTION_COLUMN)
        ).trim();

        const rowAmount = String(
            row.get(config.RECURRING_WORKSHEET_AMOUNT_COLUMN)
        ).replace(nonMatchingDigitRegExp, "");

        const rowPurchaser = String(
            row.get(config.RECURRING_WORKSHEET_PURCHASER_COLUMN)
        ).trim();

        const rowCategory = row.get(config.RECURRING_WORKSHEET_CATEGORY_COLUMN);

        const rowFrequency = row.get(
            config.RECURRING_WORKSHEET_FREQUENCY_COLUMN
        ) as RecurringPurchaseFrequency;

        const rowLastRunDate = row.get(
            config.RECURRING_WORKSHEET_LAST_PURCHASED_COLUMN
        )
            ? new Date(
                  row.get(config.RECURRING_WORKSHEET_LAST_PURCHASED_COLUMN)
              )
            : null;

        const recurringPurchase: RecurringPurchase = {
            enabled: rowEnabled,
            description: rowDescription,
            amount: Number(rowAmount),
            purchaser: rowPurchaser,
            category: rowCategory,
            frequency: rowFrequency,
            lastRunDate: rowLastRunDate,
        };

        const {
            enabled,
            description,
            amount,
            purchaser,
            category,
            frequency,
            lastRunDate,
        } = recurringPurchase;

        if (!enabled) {
            console.log(`Purchase ${description} is disabled, skipping...`);
            continue;
        }

        if (!description || !amount || !purchaser || !category || !frequency) {
            continue;
        }

        const purchaserAsPosition = configuration.people.find(
            (x) => x.name === purchaser
        )?.position;

        if (!purchaserAsPosition) {
            console.error(`Person ${purchaser} not found in the configuration`);
            continue;
        }

        const descriptionWithRecurringLabel =
            "#RECURRING PURCHASE# " + description;

        const purchaseNeverMade = !lastRunDate;
        const purchaseDue = lastRunDate
            ? differenceInDays(new Date(), lastRunDate) >=
              Number(RecurringPurchaseFrequency[frequency])
            : false;

        if (!purchaseNeverMade && !purchaseDue) {
            console.log(`Purchase ${description} is not due, skipping...`);
            continue;
        }

        await insertNewPurchase({
            description: descriptionWithRecurringLabel,
            category,
            purchaser: purchaserAsPosition,
            amount: String(amount),
        });

        row.assign({
            "Last time added": new Date(),
            Purchaser: purchaser.trim(),
        });

        row.save();

        console.log(
            `Successfully added purchase ${description} to the purchases sheet`
        );

        successfulRecurringPayments.push(recurringPurchase);
    }

    worksheet.resetLocalCache(true);
    return successfulRecurringPayments;
}
