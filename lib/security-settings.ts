export const disallowedDomains = ['example-phishing.com', 'malicious-site.net']

export const disposableDomains = new Set([
    "mailinator.com",
    "guerrillamail.com",
    "10minutemail.com",
    "tempmail.com",
    "throwawaymail.com",
]);

export const spamPatterns = [
    /\bviagra\b/i,
    /\bcasino\b/i,
    /\bcrypto investment\b/i,
    /\bseo service\b/i,
    /\bbuy backlinks\b/i,
    /\btelegram\b.*\bcontact\b/i,
    /\bwhatsapp\b.*\bcontact\b/i,
    /\bguaranteed traffic\b/i,
    /\bincrease your ranking\b/i,
];

export const allowedHostnames = new Set([
    "sbacoustics.com",
    "www.sbacoustics.com",
    "sbaudience.com",
    "www.sbaudience.com",
    "webdemosbe.xyz",
    "www.webdemosbe.xyz",
    "localhost",
]);