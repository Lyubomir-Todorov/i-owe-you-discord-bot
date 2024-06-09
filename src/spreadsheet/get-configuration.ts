import { Person, PurchaseCategory, WorksheetConfiguration } from "src/types";
import { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { config } from "../config";
import getConfigurationWorksheet from "./get-configuration-worksheet";

export async function getConfiguration() {
    const worksheetConfig = await getConfigurationWorksheet();

    if (!worksheetConfig) {
        throw new Error("Configuration worksheet not found");
    }

    await worksheetConfig.loadCells();

    const firstPerson = await assignPerson(
        worksheetConfig,
        config.CONFIG_WORKSHEET_PERSON_1_NAME_CELL,
        config.CONFIG_WORKSHEET_PERSON_1_DISCORD_ID_CELL,
        config.CONFIG_WORKSHEET_PERSON_1_ALIASES_RANGE
    );

    const secondPerson = await assignPerson(
        worksheetConfig,
        config.CONFIG_WORKSHEET_PERSON_2_NAME_CELL,
        config.CONFIG_WORKSHEET_PERSON_2_DISCORD_ID_CELL,
        config.CONFIG_WORKSHEET_PERSON_2_ALIASES_RANGE
    );

    const defaultPurchaseCategory = assignDefaultPurchaseCategory(
        worksheetConfig,
        config.CONFIG_WORKSHEET_DEFAULT_CATEGORY_CELL
    );

    const purchaseCategories = await assignPurchaseCategories(
        worksheetConfig,
        config.CONFIG_WORKSHEET_CATEGORY_RANGE
    );

    const blacklistedKeywords = await assignBlacklistedKeywords(
        worksheetConfig,
        config.CONFIG_WORKSHEET_BLACKLIST_RANGE
    );

    worksheetConfig.resetLocalCache(true);

    if (
        !firstPerson ||
        !secondPerson ||
        !defaultPurchaseCategory ||
        !purchaseCategories
    ) {
        throw new Error("Configuration file error: missing data");
    }

    return {
        people: [firstPerson, secondPerson],
        purchaseCategories: purchaseCategories,
        defaultPurchaseCategory: defaultPurchaseCategory,
        blacklistedKeywords: blacklistedKeywords,
    } as WorksheetConfiguration;
}

async function assignPerson(
    worksheet: GoogleSpreadsheetWorksheet,
    nameCell: string,
    discordIdCell: string,
    aliasesRange: string
) {
    const name = worksheet.getCellByA1(nameCell);
    const discordId = worksheet.getCellByA1(discordIdCell);
    const aliases = await worksheet.getCellsInRange(aliasesRange);

    return {
        name: name.value,
        discordId: discordId.value,
        aliases: aliases.flatMap((alias: string) => alias),
    } as Person;
}

function assignDefaultPurchaseCategory(
    worksheet: GoogleSpreadsheetWorksheet,
    defaultPurchaseCategoryCell: string
) {
    const data = worksheet.getCellByA1(defaultPurchaseCategoryCell);
    return data.value;
}

async function assignPurchaseCategories(
    worksheet: GoogleSpreadsheetWorksheet,
    range: string
) {
    const data = await worksheet.getCellsInRange(range);
    return data.map((row: string[]) => {
        const keywordsRaw = row.slice(1);
        const keywords = keywordsRaw
            .flatMap((keyword) => {
                const formattedKeyword = keyword.includes(" ")
                    ? keyword.replaceAll(" ", "")
                    : "";
                return [keyword, formattedKeyword];
            })
            .filter((x) => x !== "");

        return {
            name: row[0],
            keywords: keywords,
        } as PurchaseCategory;
    });
}

async function assignBlacklistedKeywords(
    worksheet: GoogleSpreadsheetWorksheet,
    keywordRange: string
) {
    const keywords = await worksheet.getCellsInRange(keywordRange);

    return keywords ? keywords.flatMap((keyword: string) => keyword) : [];
}
