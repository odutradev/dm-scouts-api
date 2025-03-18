const loggerConfig = {
    usePrefix: true,
    prefix: '[DM SCOUTS API]',
    prefixColor: 'magenta',
    info: {
        prefix: '(info)',
        prefixColor: 'cyan',
        messageColor: 'white',
    },
    error: {
        prefix: '(error)',
        prefixColor: 'redBright',
        messageColor: 'red',
    },
    warning: {
        prefix: '(warn)',
        prefixColor: 'yellowBright',
        messageColor: 'yellow',
    },
    success: {
        prefix: '(success)',
        prefixColor: 'green',
        messageColor: 'white',
    }
};

export default loggerConfig;