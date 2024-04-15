import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { config } from "../config";

const credentials = require(config.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH);

const serviceAccountAuth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const spreadsheet = new GoogleSpreadsheet(
    config.GOOGLE_SHEETS_SPREADSHEET_ID,
    serviceAccountAuth
);

export async function initializeSpreadsheet() {
    await spreadsheet.loadInfo();
}
