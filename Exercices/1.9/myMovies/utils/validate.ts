export const containsOnlyExpectedKeys = ( body: object, expectedKeys: string[]): boolean => {
    return Object.keys(body).every(key => expectedKeys.includes(key));
};