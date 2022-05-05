const readableDate = (timestamp) => {
    const now = Date.now();
    const date = new Date(Date.parse(timestamp));
    const millis = now - date;
    const mins = Math.floor(millis / (1000 * 60));
    if (mins < 1) {
        return 'just now';
    }
    if (2 < mins < 60) {
        return `${mins} mins ago`
    }
    const hours = Math.max(1, Math.floor(mins/60));
    if (mins >= 60 && hours < 23) {
        return `${hours} ${getDateSuffix('hour', hours)}`;
    }
    const days = Math.max(Math.floor(hours/24));
    if (hours >= 23 && days < 7) {
        return `${days} ${getDateSuffix('day', hours)}`;
    }
    const weeks = Math.max(1, Math.floor(days/7));
    if (days >= 7 && weeks < 2) {
        return `${weeks} ${getDateSuffix('week', weeks)}`;
    }
    const months = Math.max(1, Math.floor(days/30));
    if (weeks >= 2 && months < 12) {
        return `${months} ${getDateSuffix('month', weeks)}`;
    }
    return `a while ago`
};

const getDateSuffix = (unit, value) => {
    return `${unit}${value>1?'s' : ''} ago`;
}

// exposing Ramda object as well for use along with recipes if needed.
module.exports = {
    readableDate
};
