type AnyObject = Record<string, any>;

const objectService = {
    filterObject: (obj: AnyObject, excludedKeys: string[]): AnyObject => {
        return Object.keys(obj)
            .filter(key => !excludedKeys.includes(key))
            .reduce((filteredObj, key) => {
                filteredObj[key] = obj[key];
                return filteredObj;
            }, {} as AnyObject);
    },
    getObject: (obj: AnyObject, includedKeys: string[]): AnyObject => {
        return Object.keys(obj)
            .filter(key => includedKeys.includes(key))
            .reduce((filteredObj, key) => {
                filteredObj[key] = obj[key];
                return filteredObj;
            }, {} as AnyObject);
    },
};

export default objectService;
