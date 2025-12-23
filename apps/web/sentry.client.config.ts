// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://ecf16cfa508a4ca22072f590909d1606@o4509919022546944.ingest.us.sentry.io/4510538093625344",
//   integrations: [
//     // send console.log, console.warn, and console.error calls as logs to Sentry
//     Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
//     Sentry.replayIntegration({
//       maskAllText: true,
//       blockAllMedia: true,
//     }),
//   ],
//   enableLogs: true,

//   tracesSampleRate: 1.0,
//   replaysSessionSampleRate: 0.1,
//   replaysOnErrorSampleRate: 1.0,
//   debug: false,

//   beforeSend(event) {
//     // Only send errors in production
//     if (process.env.NODE_ENV !== "production") {
//       console.log("Sentry event (dev mode):", event);
//       return null;
//     }
//     return event;
//   },
// });
