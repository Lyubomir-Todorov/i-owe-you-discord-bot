import { spreadsheet } from "./spreadsheet";
import { config } from "../config";

export default async function getConfigurationWorksheet() {
    try {
        const worksheetConfig =
            spreadsheet.sheetsByTitle[config.CONFIG_WORKSHEET_NAME];

        if (!worksheetConfig) {
            throw new Error(
                `Configuration worksheet with the name "${config.CONFIG_WORKSHEET_NAME}" was not found`
            );
        }

        return worksheetConfig;
    } catch (error) {
        console.error(error);
    }
}
