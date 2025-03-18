import packageJson from "../../../package.json";

interface DefaultConfig {
    mode: 'developing' | 'production';
    useLogRequest: boolean;
    clusterName?: string,
    version: string;
    logError: {
        message: boolean;
        data: boolean;
    };
};

const production = process.env.PRODUCTION == 'true';

let defaultConfig: DefaultConfig = production ? {
    version: packageJson.version,
    useLogRequest: false,
    logError: {
        message: false,
        data: false
    },
    mode: 'production',
}  : {
    version: packageJson.version,
    useLogRequest: true,
    logError: {
        message: true,
        data: true
    },
    mode: 'developing',
};

export default defaultConfig;