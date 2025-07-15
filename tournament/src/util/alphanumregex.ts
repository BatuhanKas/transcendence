export async function isAlphanumeric(name: string) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(name);
}