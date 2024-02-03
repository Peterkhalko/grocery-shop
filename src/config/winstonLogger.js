const winston = require('winston');

const loggerSetup  = {
     create : ()=> {
       const logger =  winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
              new winston.transports.File({ filename: 'winstonLogger.log', level: 'error' }),
            ],
          });
          return logger;
    }


}

module.exports = loggerSetup;
