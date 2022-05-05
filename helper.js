/**
 * Returns a human readable version of the DB timestamp
 * @param timestamp
 * @returns {string}
 */
const readableDate = (timestamp) => {
    const now = Date.now();
    const date = new Date(Date.parse(timestamp));
    const millis = now - date;
    const mins = Math.floor(millis / (1000 * 60));
    if (mins <= 1) {
        return 'just now';
    }
    if (mins < 60) {
        return `${mins} mins ago`
    }
    const hours = Math.max(1, Math.floor(mins/60));
    if (hours < 23) {
        return `${hours} ${getDateSuffix('hour', hours)}`;
    }
    const days = Math.max(Math.floor(hours/24));
    if (days < 7) {
        return `${days} ${getDateSuffix('day', hours)}`;
    }
    const weeks = Math.max(1, Math.floor(days/7));
    if (weeks < 2) {
        return `${weeks} ${getDateSuffix('week', weeks)}`;
    }
    const months = Math.max(1, Math.floor(days/30));
    if (months < 12) {
        return `${months} ${getDateSuffix('month', weeks)}`;
    }
    return `a while ago`
};

/**
 * Support function for readableDate
 * Returns the correct singular/plural suffix
 * @param unit
 * @param value
 * @returns {string}
 */
const getDateSuffix = (unit, value) => {
    return `${unit}${value>1?'s' : ''} ago`;
}

/**
 * Makes text DB safe
 * @param unsafe
 * @returns {string}
 */
const escapeText = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// exposing Ramda object as well for use along with recipes if needed.
module.exports = {
    readableDate,
    escapeText
};