import express from "express";
import config from "./config";
import router from "./routes";
import { errorHandler } from "./middlewares/ErrorHandling";
import { requestLogger } from "./middlewares/logger";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const app = express();
const port = config.port;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many requests",
});

app.use(helmet());

app.use(limiter);

const allowedOrigins = ["https://example.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not allowed"));
      }
    },
  })
);

app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
