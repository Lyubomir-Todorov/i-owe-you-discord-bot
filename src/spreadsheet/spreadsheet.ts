import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { config } from "../config";

const serviceAccountAuth = new JWT({
    email: config.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: config.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const spreadsheet = new GoogleSpreadsheet(
    config.GOOGLE_SHEETS_SPREADSHEET_ID,
    serviceAccountAuth
);

export async function initializeSpreadsheet() {
    await spreadsheet.loadInfo();
}
