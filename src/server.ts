import { app } from "./app";

const port = process.env.PORT || 3000;

// listen to routes
const server = app.listen(port, () =>
  console.log(`App listening on port: ${port}`)
);

process.on("SIGINT", () => {
  server.close(), console.log("App closed");
});
