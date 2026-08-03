import {CronJob} from "cron";
import {discordClient} from "@app/discord/discord-client";
import {config} from "@app/config";
import {bold, heading, HeadingLevel, inlineCode} from "discord.js";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {preferenceSheet} from "@app/spreadsheet/preferences/preference-sheet";
import {Preferences} from "@app/spreadsheet/enums/preferences";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {addMonths, format, isSameMonth, isSameYear} from "date-fns";
import {Purchase} from "@app/models/purchase";

const MAX_DESCRIPTION_LENGTH = 75;
const DEFAULT_MAX_PURCHASES_TO_SHOW = 10;

export function truncateDescription(description: string, maxLength: number = MAX_DESCRIPTION_LENGTH): string {
    return description.length > maxLength ? `${description.slice(0, maxLength - 3)}...` : description;
}

export function resolveMaxPurchasesToShow(rawValue: string | undefined): number {
    const parsed = Number(rawValue);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_PURCHASES_TO_SHOW;
}

export function getPurchasesForMonth(purchases: Purchase[], referenceDate: Date): Purchase[] {
    return purchases
        .filter(p => isSameMonth(referenceDate, p.date) && isSameYear(referenceDate, p.date) && p.description !== '#PAYMENT#')
        .sort((p1, p2) => p2.amount - p1.amount);
}

export function getAveragePurchasePrice(purchases: Purchase[]): number {
    return purchases.reduce((acc, p) => acc + p.amount, 0) / purchases.length;
}

export function buildReminderMessage(params: {
    monthDate: Date;
    purchasesThisMonth: Purchase[];
    averagePurchasePrice: number;
    purchasesAboveThreshold: Purchase[];
    payeeDiscordId: string;
    outstandingBalanceAmount: string;
}): string {
    const {monthDate, purchasesThisMonth, averagePurchasePrice, purchasesAboveThreshold, payeeDiscordId, outstandingBalanceAmount} = params;

    const messageHeading = heading(`Final balance summary for the month of ${format(monthDate, 'MMMM')}\n`, HeadingLevel.Two);
    const averageBody = `${purchasesThisMonth.length} purchases were made this month. The average cost was $${averagePurchasePrice.toFixed(2)}`;
    const messageBody = `<@${payeeDiscordId}>, you have an outstanding balance of $${bold(outstandingBalanceAmount)}\nPlease pay this using the ${inlineCode("/pay")} command`;
    const purchasesSection = purchasesAboveThreshold.length > 0 ? [
        "Here were some of the most expensive purchases made:",
        "",
        purchasesAboveThreshold.map(p => {
            const isRecurring = p.description.includes("#RECURRING#");
            const description = truncateDescription(p.description.replace("#RECURRING#", "").trim());
            const dateLabel = format(p.date, "MMM, d");
            return `- ${description}: $${p.amount.toFixed(2)} (${p.paidBy}, ${dateLabel})${isRecurring ? " 🔁" : ""}`;
        }).join('\n'),
        "",
    ].join('\n') : "";

    return `${messageHeading}\n${averageBody}\n${purchasesSection}\n${messageBody}\n`;
}

export async function sendOutstandingBalanceReminder(): Promise<void> {
    const people = await peopleSheet.getAll();
    const outstandingBalanceAmount = await computationSheet.getById(Computations.OUTSTANDING_BALANCE_AMOUNT);
    const outstandingBalancePayee = await computationSheet.getById(Computations.OUTSTANDING_BALANCE_PAYEE);

    if (!outstandingBalanceAmount || !outstandingBalancePayee) {
        return;
    }

    const payeeDiscordId = people.find(person => person.name === outstandingBalancePayee.value)?.discordId;
    if (!payeeDiscordId) {
        return;
    }

    const maxPurchasesToShowPreference = await preferenceSheet.getById(Preferences.MAX_PURCHASES_TO_SHOW);
    const maxPurchasesToShow = resolveMaxPurchasesToShow(maxPurchasesToShowPreference?.value);

    const lastMonth = addMonths(new Date(), -1);
    const purchases = await purchasesSheet.getAll();
    const purchasesThisMonth = getPurchasesForMonth(purchases, lastMonth);
    const averagePurchasePrice = getAveragePurchasePrice(purchasesThisMonth);
    const purchasesAboveThreshold = purchasesThisMonth
        .filter(p => p.amount > averagePurchasePrice)
        .slice(0, maxPurchasesToShow);

    const message = buildReminderMessage({
        monthDate: lastMonth,
        purchasesThisMonth,
        averagePurchasePrice,
        purchasesAboveThreshold,
        payeeDiscordId,
        outstandingBalanceAmount: outstandingBalanceAmount.value,
    });

    const textChannel = discordClient.channels.cache.get(config.DISCORD_CHANNEL_ID!)
    if (!!textChannel && textChannel.isTextBased()) {
        textChannel.send(message);
    }
}

export const remindOutstandingBalance = CronJob.from({
    cronTime: `0 ${config.OUTSTANDING_BALANCE_REMINDER_HOUR_TO_EXECUTE} 1 * *`,
    utcOffset: Number(config.TIMEZONE_OFFSET),
    onTick: sendOutstandingBalanceReminder,
    start: false,
});