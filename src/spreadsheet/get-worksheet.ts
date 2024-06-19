import { spreadsheet } from "./spreadsheet";

export default async function getWorksheet(name: string) {
    const worksheet = spreadsheet.sheetsByTitle[name];

    if (!worksheet) {
        throw new Error(`Worksheet with the name "${name}" was not found`);
    }

    return worksheet;
}
