/**
 * Retrieves the purchase amount from a given message.
 * 
 * @param message - The message containing the purchase amount.
 * @returns The purchase amount as a string, or undefined if not found.
 */
export default function getPurchaseAmount(message: string): string | undefined {
    const purchaseAmountRegExp = new RegExp(/\d+(\.\d+)?/);
    return purchaseAmountRegExp.exec(message)?.[0];
}
