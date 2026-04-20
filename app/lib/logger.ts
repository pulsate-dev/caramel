import { Logger } from "tslog";

// TODO: change type to "json" when we get ready to use log collection service
export const logger = new Logger({ type: "pretty" });
