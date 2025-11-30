/**
 * Data grouping utilities
 */

/**
 * Group items by a key function
 * @param {Array} items - Items to group
 * @param {Function} keyFn - Function that returns the grouping key
 * @returns {Map} Map with keys and grouped items
 */
export const groupBy = (items, keyFn) => {
    const groups = new Map();

    items.forEach((item) => {
        const key = keyFn(item);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    });

    return groups;
};

/**
 * Group classes by year
 * @param {Array} classes - Classes to group
 * @returns {Array} Array of [year, classes] tuples, sorted by year descending
 */
export const groupClassesByYear = (classes) => {
    const groups = groupBy(classes, (klass) => klass.year ?? 'No year');

    const sortedGroups = Array.from(groups.entries()).sort((a, b) => {
        const [yearA] = a;
        const [yearB] = b;

        // "No year" always goes last
        if (yearA === 'No year') return 1;
        if (yearB === 'No year') return -1;

        // Sort years in descending order (newest first)
        return Number(yearB) - Number(yearA);
    });

    return sortedGroups;
};

/**
 * Group items by date period (day, week, month)
 * @param {Array} items - Items to group
 * @param {Function} dateFn - Function that returns the date from an item
 * @param {string} period - Grouping period: 'day', 'week', 'month'
 * @returns {Map} Map with period keys and grouped items
 */
export const groupByDatePeriod = (items, dateFn, period = 'day') => {
    const getKey = (date) => {
        const d = new Date(date);

        if (period === 'day') {
            return d.toISOString().split('T')[0];
        }

        if (period === 'week') {
            const weekStart = new Date(d);
            weekStart.setDate(d.getDate() - d.getDay());
            return weekStart.toISOString().split('T')[0];
        }

        if (period === 'month') {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        }

        return d.toISOString();
    };

    return groupBy(items, (item) => getKey(dateFn(item)));
};

/**
 * Sort groups by key
 * @param {Map} groups - Groups to sort
 * @param {Function} compareFn - Comparison function for keys
 * @returns {Array} Sorted array of [key, items] tuples
 */
export const sortGroups = (groups, compareFn) => {
    return Array.from(groups.entries()).sort((a, b) => compareFn(a[0], b[0]));
};
