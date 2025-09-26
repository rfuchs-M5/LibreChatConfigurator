import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize storage before registering routes
  await storage.initializeStorage();
  log("Storage initialized successfully");
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const isWindows = process.platform === 'win32';
  
  // Allow host to be configurable via HOST env var, default to 0.0.0.0 for broader compatibility
  const preferredHost = process.env.HOST || "0.0.0.0";
  
  const createListenOptions = (host: string) => ({
    port,
    host,
    ...(isWindows ? {} : { reusePort: true })
  });
  
  // Try preferred host first, fallback to 127.0.0.1 if ENOTSUP (macOS Sequoia issue)
  const tryListen = (host: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const listenOptions = createListenOptions(host);
      
      server.listen(listenOptions, () => {
        log(`serving on port ${port} (host: ${host})`);
        resolve();
      }).on('error', (err: any) => {
        if (err.code === 'ENOTSUP' && host === '0.0.0.0') {
          log(`Host ${host} not supported, trying 127.0.0.1...`);
          tryListen('127.0.0.1').then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
    });
  };
  
  tryListen(preferredHost).catch((err) => {
    log(`Failed to start server: ${err.message}`);
    process.exit(1);
  });
})();
