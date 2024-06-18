import { Purchaser } from "./purchaser";

/**
 * Person, represents one of the users in the spreadsheet.
 */
export type Person = {
    /**
     * The name of the person.
     */
    name: string;
    /**
     * The Discord ID of the person.
     * This is used to correctly identify the purchaser if no name is mentioned in the message.
     */
    discordId: string;
    /**
     * The aliases / nicknames of the person.
     * This is used to correctly identify the purchaser if an alias is mentioned in the message.
     */
    aliases: string[];

    /**
     * The position of the person.
     * This is used to determine the order of the people in the spreadsheet.
     */
    position: Purchaser;
};
