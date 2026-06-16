
import { Logger } from "winston";
import { devLogger } from "./devLogger.js";

const logger: Logger = devLogger()

export default logger