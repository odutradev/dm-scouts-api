import badWords from "@assets/content/badwords";

const stringService = {
    normalizeString: (str: string): string => {
        return str
            .trim()
            .replace(/\s+/g, ' ')
            .toLowerCase();
    },
    capitalizeFirstLetters: (str: string): string => {
        return str
            .toLowerCase()
            .replace(/(^|\.\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    },
    removeSpacesAndLowerCase: (str: string): string => {
        return str.replace(/\s+/g, '').toLowerCase();
    },
    filterBadwords: (str: string): string => {
        return str
            .split(' ')
            .map(word => {
                if (badWords.includes(word.toLowerCase())) {
                    return '****';
                }
                return word;
            })
            .join(' ');
    },
    containsBadwords: (str: string): boolean => {
        return str
            .split(' ')
            .some(word => badWords.includes(word.toLowerCase()));
    }
};

export default stringService;