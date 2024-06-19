import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Person, Purchaser } from "src/types";

export default async function getPerson(
    worksheet: GoogleSpreadsheetWorksheet,
    nameCell: string,
    discordIdCell: string,
    aliasesRange: string,
    position: Purchaser
) {
    const name = worksheet.getCellByA1(nameCell);
    const discordId = worksheet.getCellByA1(discordIdCell);
    const aliases = await worksheet.getCellsInRange(aliasesRange);

    return {
        name: name.value,
        discordId: discordId.value,
        aliases: aliases.flatMap((alias: string) => alias),
        position: position,
    } as Person;
}
