import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { pathToFileURL } from "url";
import type { IncomingMessage, ServerResponse } from "http";

type VercelLikeRequest = IncomingMessage & {
  body?: unknown;
  query?: Record<string, string | string[]>;
};

type VercelLikeResponse = ServerResponse & {
  status: (statusCode: number) => VercelLikeResponse;
  json: (payload: unknown) => VercelLikeResponse;
};

const parseRequestBody = async (req: IncomingMessage) => {
  if (req.method === "GET" || req.method === "HEAD") return undefined;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) return undefined;

  const rawBody = Buffer.concat(chunks).toString("utf8");
  const contentType = String(req.headers["content-type"] || "");

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(rawBody);
    } catch {
      return {};
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  return rawBody;
};

const toQueryObject = (searchParams: URLSearchParams) => {
  const query: Record<string, string | string[]> = {};

  searchParams.forEach((value, key) => {
    const existing = query[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else if (typeof existing === "string") {
      query[key] = [existing, value];
    } else {
      query[key] = value;
    }
  });

  return query;
};

const withVercelResponseHelpers = (res: ServerResponse): VercelLikeResponse => {
  const response = res as VercelLikeResponse;

  response.status = (statusCode: number) => {
    response.statusCode = statusCode;
    return response;
  };

  response.json = (payload: unknown) => {
    if (!response.headersSent) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
    }
    response.end(JSON.stringify(payload));
    return response;
  };

  return response;
};

const localApiMiddleware = () => ({
  name: "local-vercel-api",
  configureServer(server) {
    server.middlewares.use(async (req: VercelLikeRequest, res: ServerResponse, next) => {
      if (!req.url?.startsWith("/api/")) {
        next();
        return;
      }

      const requestUrl = new URL(req.url, "http://localhost");
      let apiName = requestUrl.pathname.replace(/^\/api\//, "");

      if (apiName.startsWith("admin-") && apiName !== "admin-router") {
        requestUrl.searchParams.set("action", apiName.replace("admin-", ""));
        apiName = "admin-router";
      } else if (apiName === "import-diamonds") {
        requestUrl.searchParams.set("action", "import-diamonds");
        apiName = "admin-router";
      } else if (["diamonds", "jewelry", "content", "model", "drive-proxy", "user-state"].includes(apiName)) {
        requestUrl.searchParams.set("action", apiName);
        apiName = "catalog-router";
      }

      if (!apiName || apiName.includes("/") || apiName.startsWith("_")) {
        next();
        return;
      }

      const apiPath = path.resolve(__dirname, "api", `${apiName}.js`);

      try {
        process.env.ADMIN_TOKEN ||= "vmora-admin-2026";

        req.query = toQueryObject(requestUrl.searchParams);
        req.body = await parseRequestBody(req);

        const moduleUrl = `${pathToFileURL(apiPath).href}?dev=${Date.now()}`;
        const handlerModule = await import(moduleUrl);
        const handler = handlerModule.default;

        if (typeof handler !== "function") {
          next();
          return;
        }

        await handler(req, withVercelResponseHelpers(res));
      } catch (error) {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
        }
        res.end(JSON.stringify({ message: "Local API handler failed" }));
        server.config.logger.error(error instanceof Error ? error.stack || error.message : String(error));
      }
    });
  },
});

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [localApiMiddleware(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
}));
