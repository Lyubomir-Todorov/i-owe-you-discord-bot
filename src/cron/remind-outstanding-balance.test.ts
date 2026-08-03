import {Purchase} from "@app/models/purchase";
import {Computations} from "@app/spreadsheet/enums/computations";
import {Preferences} from "@app/spreadsheet/enums/preferences";
import {addMonths} from "date-fns";

jest.mock("@app/config", () => ({
    config: {
        DISCORD_CHANNEL_ID: "channel-id",
        TIMEZONE_OFFSET: -4,
        OUTSTANDING_BALANCE_REMINDER_HOUR_TO_EXECUTE: 11,
    },
}));

jest.mock("@app/discord/discord-client", () => ({
    discordClient: {
        channels: {
            cache: {
                get: jest.fn(),
            },
        },
    },
}));

jest.mock("@app/spreadsheet/computations/computation-sheet", () => ({
    computationSheet: {
        getById: jest.fn(),
    },
}));

jest.mock("@app/spreadsheet/people/people-sheet", () => ({
    peopleSheet: {
        getAll: jest.fn(),
    },
}));

jest.mock("@app/spreadsheet/preferences/preference-sheet", () => ({
    preferenceSheet: {
        getById: jest.fn(),
    },
}));

jest.mock("@app/spreadsheet/purchases/purchases-sheet", () => ({
    purchasesSheet: {
        getAll: jest.fn(),
    },
}));

import {discordClient} from "@app/discord/discord-client";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";
import {preferenceSheet} from "@app/spreadsheet/preferences/preference-sheet";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {
    buildReminderMessage,
    getAveragePurchasePrice,
    getPurchasesForMonth,
    resolveMaxPurchasesToShow,
    sendOutstandingBalanceReminder,
    truncateDescription,
} from "@app/cron/remind-outstanding-balance";

function makePurchase(overrides: Partial<Purchase> = {}): Purchase {
    return {
        date: addMonths(new Date(), -1),
        description: "Groceries",
        amount: 20,
        category: "Food",
        paidBy: "Alice",
        splitMethod: "50/50",
        transactionId: "tx-1",
        ...overrides,
    };
}

describe("getPurchasesForMonth", () => {
    it("keeps only purchases in the same month/year as the reference date", () => {
        const referenceDate = new Date(2026, 6, 20);
        const purchases = [
            makePurchase({description: "In month", date: new Date(2026, 6, 1)}),
            makePurchase({description: "Different month", date: new Date(2026, 5, 30)}),
            makePurchase({description: "Different year", date: new Date(2025, 6, 1)}),
        ];

        const result = getPurchasesForMonth(purchases, referenceDate);

        expect(result.map(p => p.description)).toEqual(["In month"]);
    });

    it("excludes payment entries", () => {
        const referenceDate = new Date(2026, 6, 20);
        const purchases = [
            makePurchase({description: "#PAYMENT#", date: new Date(2026, 6, 1)}),
            makePurchase({description: "Real purchase", date: new Date(2026, 6, 2)}),
        ];

        const result = getPurchasesForMonth(purchases, referenceDate);

        expect(result.map(p => p.description)).toEqual(["Real purchase"]);
    });

    it("sorts purchases by amount descending", () => {
        const referenceDate = new Date(2026, 6, 20);
        const purchases = [
            makePurchase({description: "Cheap", amount: 5, date: new Date(2026, 6, 1)}),
            makePurchase({description: "Expensive", amount: 50, date: new Date(2026, 6, 2)}),
        ];

        const result = getPurchasesForMonth(purchases, referenceDate);

        expect(result.map(p => p.description)).toEqual(["Expensive", "Cheap"]);
    });
});

describe("getAveragePurchasePrice", () => {
    it("averages the purchase amounts", () => {
        const purchases = [makePurchase({amount: 10}), makePurchase({amount: 30})];

        expect(getAveragePurchasePrice(purchases)).toBe(20);
    });

    it("returns NaN for an empty list", () => {
        expect(getAveragePurchasePrice([])).toBeNaN();
    });
});

describe("truncateDescription", () => {
    it("leaves short descriptions untouched", () => {
        expect(truncateDescription("Groceries")).toBe("Groceries");
    });

    it("truncates descriptions longer than the max length and appends an ellipsis", () => {
        const description = "A".repeat(100);

        const result = truncateDescription(description);

        expect(result).toBe(`${"A".repeat(72)}...`);
        expect(result).toHaveLength(75);
    });

    it("respects a custom max length", () => {
        expect(truncateDescription("Groceries", 5)).toBe("Gr...");
    });
});

describe("resolveMaxPurchasesToShow", () => {
    it("defaults to 10 when no value is set", () => {
        expect(resolveMaxPurchasesToShow(undefined)).toBe(10);
    });

    it("defaults to 10 when the value isn't a positive integer", () => {
        expect(resolveMaxPurchasesToShow("not-a-number")).toBe(10);
        expect(resolveMaxPurchasesToShow("0")).toBe(10);
        expect(resolveMaxPurchasesToShow("-5")).toBe(10);
        expect(resolveMaxPurchasesToShow("3.5")).toBe(10);
    });

    it("uses the configured value when it's a positive integer", () => {
        expect(resolveMaxPurchasesToShow("5")).toBe(5);
    });
});

describe("buildReminderMessage", () => {
    it("includes the payee, balance, average and expensive purchases", () => {
        const message = buildReminderMessage({
            monthDate: new Date(2026, 6, 1),
            purchasesThisMonth: [makePurchase(), makePurchase()],
            averagePurchasePrice: 20,
            purchasesAboveThreshold: [makePurchase({
                description: "#RECURRING# Rent",
                amount: 100,
                paidBy: "Bob",
                date: new Date(2026, 6, 31),
            })],
            payeeDiscordId: "123456789",
            outstandingBalanceAmount: "42.50",
        });

        expect(message).toContain("July");
        expect(message).toContain("2 purchases were made this month");
        expect(message).toContain("$20.00");
        expect(message).toContain("<@123456789>");
        expect(message).toContain("42.50");
        expect(message).toContain("- Rent: $100.00 (Bob, Jul, 31) 🔁");
    });

    it("omits the recurring emoji for non-recurring purchases", () => {
        const message = buildReminderMessage({
            monthDate: new Date(2026, 6, 1),
            purchasesThisMonth: [makePurchase()],
            averagePurchasePrice: 20,
            purchasesAboveThreshold: [makePurchase({
                description: "Groceries",
                amount: 30,
                paidBy: "Alice",
                date: new Date(2026, 6, 5),
            })],
            payeeDiscordId: "123456789",
            outstandingBalanceAmount: "42.50",
        });

        expect(message).toContain("- Groceries: $30.00 (Alice, Jul, 5)");
        expect(message).not.toContain("🔁");
    });

    it("truncates long descriptions", () => {
        const longDescription = "A very long and detailed description of a purchase that goes on and on and on and on";
        const message = buildReminderMessage({
            monthDate: new Date(2026, 6, 1),
            purchasesThisMonth: [makePurchase()],
            averagePurchasePrice: 20,
            purchasesAboveThreshold: [makePurchase({
                description: longDescription,
                amount: 30,
                paidBy: "Alice",
                date: new Date(2026, 6, 5),
            })],
            payeeDiscordId: "123456789",
            outstandingBalanceAmount: "42.50",
        });

        const truncated = truncateDescription(longDescription);
        expect(truncated).not.toBe(longDescription);
        expect(message).toContain(`- ${truncated}: $30.00 (Alice, Jul, 5)`);
    });

    it("omits the purchases heading when no purchases are above the threshold", () => {
        const message = buildReminderMessage({
            monthDate: new Date(2026, 6, 1),
            purchasesThisMonth: [makePurchase()],
            averagePurchasePrice: 20,
            purchasesAboveThreshold: [],
            payeeDiscordId: "123456789",
            outstandingBalanceAmount: "42.50",
        });

        expect(message).not.toContain("Here were some of the most expensive purchases made");
        expect(message).toContain("<@123456789>");
    });
});

describe("sendOutstandingBalanceReminder", () => {
    const send = jest.fn();
    const channelsGet = discordClient.channels.cache.get as jest.Mock;

    beforeEach(() => {
        channelsGet.mockReturnValue({isTextBased: () => true, send});
        (preferenceSheet.getById as jest.Mock).mockResolvedValue(null);
    });

    it("does nothing when there is no outstanding balance computation", async () => {
        (computationSheet.getById as jest.Mock).mockResolvedValue(null);
        (peopleSheet.getAll as jest.Mock).mockResolvedValue([]);

        await sendOutstandingBalanceReminder();

        expect(send).not.toHaveBeenCalled();
    });

    it("does nothing when the payee cannot be matched to a discord id", async () => {
        (computationSheet.getById as jest.Mock).mockImplementation(async (id: Computations) => {
            if (id === Computations.OUTSTANDING_BALANCE_AMOUNT) return {id, description: "", value: "42.50"};
            if (id === Computations.OUTSTANDING_BALANCE_PAYEE) return {id, description: "", value: "Unknown Person"};
            return null;
        });
        (peopleSheet.getAll as jest.Mock).mockResolvedValue([]);

        await sendOutstandingBalanceReminder();

        expect(send).not.toHaveBeenCalled();
    });

    it("sends a reminder message to the matched payee's channel", async () => {
        (computationSheet.getById as jest.Mock).mockImplementation(async (id: Computations) => {
            if (id === Computations.OUTSTANDING_BALANCE_AMOUNT) return {id, description: "", value: "42.50"};
            if (id === Computations.OUTSTANDING_BALANCE_PAYEE) return {id, description: "", value: "Alice"};
            return null;
        });
        (peopleSheet.getAll as jest.Mock).mockResolvedValue([
            {name: "Alice", discordId: "123456789", aliases: []},
        ]);
        (purchasesSheet.getAll as jest.Mock).mockResolvedValue([makePurchase()]);

        await sendOutstandingBalanceReminder();

        expect(send).toHaveBeenCalledTimes(1);
        expect(send.mock.calls[0][0]).toContain("<@123456789>");
    });

    it("limits the number of purchases shown to the configured maximum", async () => {
        (computationSheet.getById as jest.Mock).mockImplementation(async (id: Computations) => {
            if (id === Computations.OUTSTANDING_BALANCE_AMOUNT) return {id, description: "", value: "42.50"};
            if (id === Computations.OUTSTANDING_BALANCE_PAYEE) return {id, description: "", value: "Alice"};
            return null;
        });
        (preferenceSheet.getById as jest.Mock).mockImplementation(async (id: Preferences) => {
            if (id === Preferences.MAX_PURCHASES_TO_SHOW) return {id, description: "", expectedValue: "", value: "2"};
            return null;
        });
        (peopleSheet.getAll as jest.Mock).mockResolvedValue([
            {name: "Alice", discordId: "123456789", aliases: []},
        ]);
        const fillers = Array.from({length: 4}, () => makePurchase({description: "Filler", amount: 1}));
        const aboveAverage = [100, 90, 80, 70, 60].map(amount => makePurchase({
            description: `Purchase ${amount}`,
            amount,
        }));
        (purchasesSheet.getAll as jest.Mock).mockResolvedValue([...fillers, ...aboveAverage]);

        await sendOutstandingBalanceReminder();

        const message = send.mock.calls[0][0] as string;
        expect(message.match(/^- /gm)).toHaveLength(2);
        expect(message).toContain("Purchase 100");
        expect(message).toContain("Purchase 90");
        expect(message).not.toContain("Purchase 80");
    });
});
