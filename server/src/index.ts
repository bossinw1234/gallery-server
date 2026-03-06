import express from "express";
import cors from "cors";
import { createImageRoutes } from "./routes/image.routes.js";
import { createTagRoutes } from "./routes/tag.routes.js";
import { ImageController } from "./controllers/Image.controller.js";
import { TagController } from "./controllers/tag.controller.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class App {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || "3001");
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET"],
        credentials: true,
      }),
    );
    this.app.use(express.json());

    this.app.use((req, _res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  private initializeRoutes(): void {
    const imageController = new ImageController();
    const tagController = new TagController();

    this.app.use("/api", createImageRoutes(imageController));
    this.app.use("/api", createTagRoutes(tagController));

    this.app.get("/api/health", (_req, res) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use((_req, res) => {
      res.status(404).json({ error: "Not found" });
    });
    this.app.use(
      (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        console.error("Unhandled error:", err);
        res.status(500).json({
          error: "Internal server error",
          message:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        });
      },
    );
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`
Running on http://localhost:${this.port}  
Environment: ${process.env.NODE_ENV}
      `);
    });
  }
}

const app = new App();
app.listen();

process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await prisma.$disconnect();
  process.exit(0);
});
