import {
    WorksheetConfiguration
} from "src/types";
import { config } from "../../config";
import getWorksheet from "../get-worksheet";
import getBlacklistedKeywords from "./get-blacklisted-keywords";
import getDefaultPurchaseCategory from "./get-default-purchase-category";
import getPerson from "./get-person";
import getPurchaseCategories from "./get-purchase-categories";

export async function getConfiguration(): Promise<WorksheetConfiguration> {
    const worksheetConfig = await getWorksheet(config.CONFIG_WORKSHEET_NAME);

    if (!worksheetConfig) {
        throw new Error("Configuration worksheet not found");
    }

    await worksheetConfig.loadCells();

    const firstPerson = await getPerson(
        worksheetConfig,
        config.CONFIG_WORKSHEET_PERSON_1_NAME_CELL,
        config.CONFIG_WORKSHEET_PERSON_1_DISCORD_ID_CELL,
        config.CONFIG_WORKSHEET_PERSON_1_ALIASES_RANGE,
        "person1"
    );

    const secondPerson = await getPerson(
        worksheetConfig,
        config.CONFIG_WORKSHEET_PERSON_2_NAME_CELL,
        config.CONFIG_WORKSHEET_PERSON_2_DISCORD_ID_CELL,
        config.CONFIG_WORKSHEET_PERSON_2_ALIASES_RANGE,
        "person2"
    );

    const defaultPurchaseCategory = getDefaultPurchaseCategory(
        worksheetConfig,
        config.CONFIG_WORKSHEET_DEFAULT_CATEGORY_CELL
    );

    const purchaseCategories = await getPurchaseCategories(
        worksheetConfig,
        config.CONFIG_WORKSHEET_CATEGORY_RANGE
    );

    const blacklistedKeywords = await getBlacklistedKeywords(
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
