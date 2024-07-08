/**
 * Generates a UUID in the version 4 format.
 * @returns {string} A UUID string.
 */
export function getRandomUUID() {
    // Create an array of hexadecimal digits
    const hexDigits = '0123456789abcdef'.split('');

    // Create an array of 36 characters
    const chars = new Array(36);

    // Loop through the characters array
    for (let i = 0; i < 36; i++) {
    // If the index is 8, 13, 18, or 23, insert a hyphen
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            chars[i] = '-';
        } else {
            // Otherwise, insert a random hexadecimal digit
            chars[i] = hexDigits[Math.floor(Math.random() * 16)];
        }
    }

    return chars.join('');
}

/**
 * Returns a clamp expression for fluid typography based on the given parameters.
 * @param {string} minFontSize - The minimum font size in pixels.
 * @param {string} maxFontSize - The maximum font size in pixels.
 * @param {string} [minViewport='768px'] - The minimum viewport width in pixels.
 * @param {string} [maxViewport='1400px'] - The maximum viewport width in pixels.
 * @returns {string} A clamp expression that can be used in CSS.
 */
export function getFluidFontSize(
    minFontSize,
    maxFontSize,
    minViewport = '768px',
    maxViewport = '1400px'
) {
    // Convert the parameters to numbers
    minFontSize = parseFloat(minFontSize);
    maxFontSize = parseFloat(maxFontSize);
    minViewport = parseFloat(minViewport);
    maxViewport = parseFloat(maxViewport);

    let fontSizeInRem = minFontSize / 16;
    let fontSizeDiff = maxFontSize - minFontSize;
    let viewportDiff = maxViewport - minViewport;

    // Return the clamp expression as a string
    return `clamp(${minFontSize}px, calc(${fontSizeInRem}rem + ${fontSizeDiff} * ((100vw - ${minViewport}px) / ${viewportDiff})), ${maxFontSize}px)`;
}

export const fontSizes = {
    text140: getFluidFontSize('70px', '140px'),
    text100: getFluidFontSize('50px', '100px'),
    text90: getFluidFontSize('45px', '90px'),
    text80: getFluidFontSize('40px', '80px'),
    text70: getFluidFontSize('35px', '70px'),
    text60: getFluidFontSize('30px', '60px'),
    text50: getFluidFontSize('25px', '50px'),
    text40: getFluidFontSize('22px', '40px'),
    text30: getFluidFontSize('20px', '30px'),
    text20: getFluidFontSize('18px', '20px'),
    text16: getFluidFontSize('15px', '16px'),
    text14: '14px',
};
