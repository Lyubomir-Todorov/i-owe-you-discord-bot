import dotenv from "dotenv";

dotenv.config();

const {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,

    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,

    GOOGLE_SHEETS_SPREADSHEET_ID,

    CONFIG_WORKSHEET_NAME = "Configuration",
    CONFIG_WORKSHEET_PERSON_1_NAME_CELL = "A4",
    CONFIG_WORKSHEET_PERSON_1_DISCORD_ID_CELL = "B4",
    CONFIG_WORKSHEET_PERSON_1_ALIASES_RANGE = "C4:4",
    CONFIG_WORKSHEET_PERSON_2_NAME_CELL = "A7",
    CONFIG_WORKSHEET_PERSON_2_DISCORD_ID_CELL = "B7",
    CONFIG_WORKSHEET_PERSON_2_ALIASES_RANGE = "C7:7",
    CONFIG_WORKSHEET_DEFAULT_CATEGORY_CELL = "A13",
    CONFIG_WORKSHEET_BLACKLIST_RANGE = "A16:16",
    CONFIG_WORKSHEET_CATEGORY_RANGE = "A19:Z",

    RECURRING_WORKSHEET_NAME = "Recurring Purchases",
    RECURRING_WORKSHEET_ROW_OFFSET = "4",
    RECURRING_WORKSHEET_DISABLED_COLUMN = "Disabled",
    RECURRING_WORKSHEET_DESCRIPTION_COLUMN = "Description",
    RECURRING_WORKSHEET_AMOUNT_COLUMN = "Amount",
    RECURRING_WORKSHEET_PURCHASER_COLUMN = "Purchaser",
    RECURRING_WORKSHEET_CATEGORY_COLUMN = "Category",
    RECURRING_WORKSHEET_FREQUENCY_COLUMN = "Frequency",
    RECURRING_WORKSHEET_LAST_PURCHASED_COLUMN = "Last time added",
    RECURRING_WORKSHEET_CRON = "0 12 * * *",

    WORKSHEET_DATE_COLUMN = "A",
    WORKSHEET_DESCRIPTION_COLUMN = "B",
    WORKSHEET_CATEGORY_COLUMN = "C",
    WORKSHEET_PERSON_1_AMOUNT_COLUMN = "D",
    WORKSHEET_PERSON_2_AMOUNT_COLUMN = "E",
    WORKSHEET_SPLIT_AMOUNT_COLUMN = "F",
    WORKSHEET_TOTAL_OWING_CELL = "A2",
    WORKSHEET_PERSON_1_TOTAL_SPENT_CELL = "D1",
    WORKSHEET_PERSON_2_TOTAL_SPENT_CELL = "E1",
    WORKSHEET_COMBINED_TOTAL_SPENT_CELL = "H2",
    WORKSHEET_PURCHASE_ROW_OFFSET = "4",
} = process.env;

if (
    !GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL ||
    !GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    !DISCORD_TOKEN ||
    !DISCORD_CLIENT_ID ||
    !GOOGLE_SHEETS_SPREADSHEET_ID
) {
    throw new Error("Missing required environment variables");
}

const privateKeyModified = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
    /\\n/g,
    "\n"
);

export const config = {
    GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: privateKeyModified,
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    GOOGLE_SHEETS_SPREADSHEET_ID,
    CONFIG_WORKSHEET_NAME,
    CONFIG_WORKSHEET_PERSON_1_NAME_CELL,
    CONFIG_WORKSHEET_PERSON_1_DISCORD_ID_CELL,
    CONFIG_WORKSHEET_PERSON_1_ALIASES_RANGE,
    CONFIG_WORKSHEET_PERSON_2_NAME_CELL,
    CONFIG_WORKSHEET_PERSON_2_DISCORD_ID_CELL,
    CONFIG_WORKSHEET_PERSON_2_ALIASES_RANGE,
    CONFIG_WORKSHEET_DEFAULT_CATEGORY_CELL,
    CONFIG_WORKSHEET_BLACKLIST_RANGE,
    CONFIG_WORKSHEET_CATEGORY_RANGE,
    RECURRING_WORKSHEET_NAME,
    RECURRING_WORKSHEET_ROW_OFFSET,
    RECURRING_WORKSHEET_DISABLED_COLUMN,
    RECURRING_WORKSHEET_DESCRIPTION_COLUMN,
    RECURRING_WORKSHEET_AMOUNT_COLUMN,
    RECURRING_WORKSHEET_PURCHASER_COLUMN,
    RECURRING_WORKSHEET_CATEGORY_COLUMN,
    RECURRING_WORKSHEET_FREQUENCY_COLUMN,
    RECURRING_WORKSHEET_LAST_PURCHASED_COLUMN,
    RECURRING_WORKSHEET_CRON,
    WORKSHEET_DATE_COLUMN,
    WORKSHEET_DESCRIPTION_COLUMN,
    WORKSHEET_CATEGORY_COLUMN,
    WORKSHEET_PERSON_1_AMOUNT_COLUMN,
    WORKSHEET_PERSON_2_AMOUNT_COLUMN,
    WORKSHEET_SPLIT_AMOUNT_COLUMN,
    WORKSHEET_TOTAL_OWING_CELL,
    WORKSHEET_PERSON_1_TOTAL_SPENT_CELL,
    WORKSHEET_PERSON_2_TOTAL_SPENT_CELL,
    WORKSHEET_COMBINED_TOTAL_SPENT_CELL,
    WORKSHEET_PURCHASE_ROW_OFFSET,
};
