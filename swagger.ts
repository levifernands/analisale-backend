import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger.json";
const endpointsFiles = ["./src/routes/route.ts"];

const doc = {
  info: {
    title: "Analisale Documentation",
    description:
      "This is the documentation for the Analisale API (in development)",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

swaggerAutogen()(outputFile, endpointsFiles, doc);
