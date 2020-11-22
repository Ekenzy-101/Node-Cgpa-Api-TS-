// import winston,  from "winston";

// export default () => {
//   winston.ExceptionHandler.handle([
//     new winston.transports.Console({ colorize: true, prettyPrint: true }),
//     new winston.transports.File({ filename: "uncaughtExceptions.log" })
//   ]);

//   process.on("unhandledRejection", (ex) => {
//     throw ex;
//   });

//   winston.add(winston.transports.File, { filename: "logfile.log" });
// };
