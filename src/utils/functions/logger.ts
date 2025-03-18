import chalk from "chalk";

import loggerConfig from "@assets/config/logger";

interface FieldTypes {
  messageColor?: string;
  prefixColor?: string;
  prefix?: string;
}

const applyColor = (color: string | undefined, text: string): string => {
  const colorFunction = (chalk as any)[color as string];
  return typeof colorFunction === "function" ? colorFunction(text) : text;
};

const generalPrefix = (): string => {
  return loggerConfig.usePrefix
    ? applyColor(loggerConfig.prefixColor, loggerConfig.prefix)
    : "";
};

const formatMessage = (
  message: string,
  { messageColor, prefixColor, prefix }: FieldTypes
): string => {
  const typePrefix = applyColor(prefixColor, prefix || "");
  const formattedMessage = applyColor(messageColor, message);
  return `${generalPrefix()} ${typePrefix} ${formattedMessage}`;
};

const logger = {
  error: (message: string, field?: FieldTypes): void =>
    console.log(formatMessage(message, field || loggerConfig.error)),

  info: (message: string, field?: FieldTypes): void =>
    console.log(formatMessage(message, field || loggerConfig.info)),

  warning: (message: string, field?: FieldTypes): void =>
    console.log(formatMessage(message, field || loggerConfig.warning)),

  success: (message: string, field?: FieldTypes): void =>
    console.log(formatMessage(message, field || loggerConfig.success)),
};

export default logger;