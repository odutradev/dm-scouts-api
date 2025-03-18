const randomService = {
    chooseRandomItems: <T>(array: T[], count: number = 1): T[] => {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(count, array.length));
    },

    getRandomNumberInRange: (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomBoolean: (): boolean => {
        return Math.random() < 0.5;
    }
};

export default randomService;