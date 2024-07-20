const crypto = require('crypto');

const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

const jwtSecret = generateRandomString(32); // Adjust length as needed (e.g., 32 for a 256-bit key)

console.log(jwtSecret);
