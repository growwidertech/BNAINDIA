type PrismaClientType = import("@prisma/client").PrismaClient;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientType | null;
};

export function isCloudflareWorker() {
  return (
    (typeof navigator !== "undefined" &&
      typeof navigator.userAgent === "string" &&
      navigator.userAgent.includes("Cloudflare-Workers")) ||
    typeof (globalThis as { HTMLRewriter?: unknown }).HTMLRewriter === "function"
  );
}

function unavailable(): never {
  throw new Error("PRISMA_UNAVAILABLE");
}

function loadPrisma(): PrismaClientType | null {
  if (isCloudflareWorker()) {
    return null;
  }
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }
  try {
    // Loaded only on Node (local/dev/build). Cloudflare Workers cannot run SQLite engines.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client") as typeof import("@prisma/client");
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch {
    return null;
  }
}

export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, model) {
    const client = loadPrisma();
    if (!client) {
      return new Proxy(
        {},
        {
          get() {
            return unavailable;
          },
        }
      );
    }
    const value = client[model as keyof PrismaClientType];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default prisma;
