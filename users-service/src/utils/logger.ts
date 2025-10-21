export const logger = {
  info: (message: string, meta?: any) => {
    console.log(
      JSON.stringify({
        level: "info",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
  error: (message: string, error?: Error, meta?: any) => {
    console.error(
      JSON.stringify({
        level: "error",
        message,
        error: error?.message,
        stack: error?.stack,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
  warn: (message: string, meta?: any) => {
    console.warn(
      JSON.stringify({
        level: "warn",
        message,
        meta,
        timestamp: new Date().toISOString(),
      })
    );
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(
        JSON.stringify({
          level: "debug",
          message,
          meta,
          timestamp: new Date().toISOString(),
        })
      );
    }
  },
};
