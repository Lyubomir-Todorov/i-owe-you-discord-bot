/**
 * Returns the description with the first letter capitalized.
 * @param message - The input message.
 * @returns The capitalized description.
 */
export default function getDescription(message: string): string {
    const description = message.trim();
    return description.charAt(0).toUpperCase() + description.slice(1);
}
