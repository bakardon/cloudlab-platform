require("dotenv").config();
const express = require("express");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const statusRoutes = require("./routes/statusRoutes");
const { initializeDatabase } = require("./config/db");
const { connectRabbitMQ } = require("./config/rabbitmq");
const { startEventConsumer } = require("./services/eventConsumer");
const requestLogger = require("./middleware/requestLogger");
const { fail } = require("./utils/apiResponse");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/", authRoutes);
app.use("/", eventRoutes);
app.use("/", statusRoutes);

// Global error handler to keep API responses clean.
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  fail(res, 500, "Internal server error", err.message);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryOperation(operationName, operationFn, maxAttempts, delayMs) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await operationFn();
      console.log(`${operationName} initialized.`);
      return;
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts;
      console.error(
        `${operationName} attempt ${attempt}/${maxAttempts} failed: ${error.message}`
      );

      if (isLastAttempt) {
        throw error;
      }

      await sleep(delayMs);
    }
  }
}

async function startServer() {
  try {
    // Retry to handle first-time container startup race conditions.
    await retryOperation("Database", initializeDatabase, 10, 3000);
    await retryOperation("RabbitMQ", connectRabbitMQ, 10, 3000);
    await startEventConsumer();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
