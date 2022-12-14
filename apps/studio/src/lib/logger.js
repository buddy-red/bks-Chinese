// Copyright (c) 2015 The SQLECTRON Team

import debug from 'debug';

const loggers = {};

export default function createLogger(namespace) {
  if (!namespace) { throw new Error('缺失日志命名空间'); }
  if (loggers[namespace]) { throw new Error('该记录器已经注册'); }

  // default logger
  const debugLogger = debug(`beekeeper:${namespace}`);
  loggers[namespace] = {
    debug: debugLogger.bind(debugLogger),
    error: debugLogger.bind(debugLogger),
  };

  // The logger is load through a function
  // so is possible to access a new logger
  // defined with setLogger
  return () => loggers[namespace];
}

/**
 * Allow use a different logger
 */
export function setLogger(customLogger) {
  Object.keys(loggers).forEach((logger) => {
    loggers[logger] = customLogger(logger);
  });
}
