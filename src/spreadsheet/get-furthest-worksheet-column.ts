/**
 * Get the furthest column index from an array of columns.
 * Used to load the worksheet cells up to the furthest column.
 * @param columns - An array of columns
 * @returns The furthest column index
 */
export default function getFurthestWorksheetColumn(columns: string[]): string {
    return columns.reduce((a, b) => (a > b ? a : b));
}
