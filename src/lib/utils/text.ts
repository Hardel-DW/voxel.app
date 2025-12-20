/**
 * Replace underscores with spaces and capitalize the first letter of each word
 * @param str - The input string
 * @returns The string with spaces and capitalized first letters
 */
export function ruwsc(str: string): string {
    return str
        .replace(/[_/]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
        .trim();
}

/**
 * Sanitize a string to match GitHub repository naming rules
 * @param value - The input string to sanitize
 * @returns A valid GitHub repository name
 */
export function sanitizeRepoName(value: string): string {
    let sanitized = value.replace(/[^a-zA-Z0-9._-]/g, "-");
    if (sanitized.startsWith(".")) sanitized = sanitized.slice(1);
    return sanitized.slice(0, 100);
}
