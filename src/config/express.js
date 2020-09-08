const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const cors = require("cors");
const consign = require("consign");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Security
const helmet = require('helmet');

module.exports = () => {
  const app = express();
  const port = process.env.PORT || config.get("server.port");

  app.set("port", port);

  app.use(helmet());
  app.disable('x-powered-by');
  
  // MIDDLEWARES
  app.use(bodyParser.json());
  app.use(cors());
  consign({ cwd: "api" })
    .then("data")
    .then("controllers")
    .then("routes")
    .into(app);

//   // Serve Swagger
//   const swaggerOptions = {
//     swaggerDefinition: {
//       info: {
//         title: "MPMG API Painel de BI",
//         description: "API para o Painel de BI",
//         contact: {
//           name: "",
//         },
//         servers: [
//           "http://localhost:" + port,
//         ],
//       },
//     },
//     swagger: "2.0",
//     basePath: "/v1",
//     schemes: ["http", "https"],
//     consumes: ["application/json"],
//     produces: ["application/json"],
//     apis: ["./routes/*.js"],
//   };
  
//   const swaggerDocs = swaggerJsDoc(swaggerOptions);
//   app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
//   app.get("/swagger.json", function (req, res) {
//     res.setHeader("Content-Type", "application/json");
//     res.send(swaggerDocs);
//   });
  return app;
};
