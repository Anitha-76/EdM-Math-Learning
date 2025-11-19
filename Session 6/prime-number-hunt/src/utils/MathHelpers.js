/**
 * Check if a number is prime
 * @param {number} n - The number to check
 * @returns {boolean} True if prime, false otherwise
 */
export function isPrime(n) {
    // Handle edge cases
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    // Check odd divisors up to square root
    const sqrt = Math.sqrt(n);
    for (let i = 3; i <= sqrt; i += 2) {
        if (n % i === 0) return false;
    }

    return true;
}

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get all factors of a number
 * @param {number} n - The number to factorize
 * @returns {number[]} Array of factors
 */
export function getFactors(n) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factors.push(i);
            if (i !== n / i) {
                factors.push(n / i);
            }
        }
    }
    return factors.sort((a, b) => a - b);
}

/**
 * Get prime factorization of a number
 * @param {number} n - The number to factorize
 * @returns {number[]} Array of prime factors
 */
export function getPrimeFactorization(n) {
    const factors = [];
    let divisor = 2;

    while (n > 1) {
        while (n % divisor === 0) {
            factors.push(divisor);
            n = n / divisor;
        }
        divisor++;
    }

    return factors;
}

/**
 * Get a formatted string of prime factorization
 * @param {number} n - The number to factorize
 * @returns {string} Formatted factorization string (e.g., "12 = 2 × 2 × 3")
 */
export function getFactorizationString(n) {
    const factors = getPrimeFactorization(n);
    if (factors.length === 0) return `${n} = ${n}`;
    return `${n} = ${factors.join(' × ')}`;
}
