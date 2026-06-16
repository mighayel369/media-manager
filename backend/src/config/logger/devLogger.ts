import  { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf, errors } = format;

const myFormat = printf(({ level, message, stack, timestamp, label }) => {
    return `${timestamp} ${label} [${level}]: ${stack || message}`;
})

export const devLogger = () => {
    return createLogger({
        level: "info",
        format: combine(
            label({ label: 'dev' }),
            errors({ stack: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
        ),
        transports: [
            new transports.Console({
                format: combine(
                    format.colorize(),
                    myFormat
                )
            })
        ]
    })
}