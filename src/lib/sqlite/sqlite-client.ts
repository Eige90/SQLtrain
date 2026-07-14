import type {
  DatabaseTableSummary,
  QueryResult,
} from "@/types/database";

type WorkerRequest =
  | { id: string; type: "initialize" }
  | { id: string; type: "execute"; sql: string }
  | { id: string; type: "listTables" }
  | { id: string; type: "reset" };

type WorkerRequestWithoutId =
  | { type: "initialize" }
  | { type: "execute"; sql: string }
  | { type: "listTables" }
  | { type: "reset" };

type WorkerResponse =
  | { id: string; ok: true; result: unknown }
  | { id: string; ok: false; error: string };

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
};

class SqliteClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, PendingRequest>();

  private getWorker(): Worker {
    if (typeof window === "undefined") {
      throw new Error("SQLite is only available in the browser.");
    }

    if (this.worker) {
      return this.worker;
    }

    this.worker = new Worker(new URL("./sqlite.worker.ts", import.meta.url), {
      type: "module",
    });

    this.worker.addEventListener(
      "message",
      (event: MessageEvent<WorkerResponse>) => {
        const response = event.data;
        const pendingRequest = this.pendingRequests.get(response.id);

        if (!pendingRequest) {
          return;
        }

        this.pendingRequests.delete(response.id);

        if (response.ok) {
          pendingRequest.resolve(response.result);
        } else {
          pendingRequest.reject(new Error(response.error));
        }
      },
    );

    this.worker.addEventListener("error", (event) => {
      const error = new Error(event.message || "The SQLite worker failed.");

      for (const pendingRequest of this.pendingRequests.values()) {
        pendingRequest.reject(error);
      }

      this.pendingRequests.clear();
      this.worker?.terminate();
      this.worker = null;
    });

    return this.worker;
  }

  private request<T>(request: WorkerRequestWithoutId): Promise<T> {
    const worker = this.getWorker();
    const id = crypto.randomUUID();

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      worker.postMessage({ ...request, id } satisfies WorkerRequest);
    });
  }

  initialize(): Promise<{ ready: true }> {
    return this.request({ type: "initialize" });
  }

  execute(sql: string): Promise<QueryResult> {
    return this.request({ type: "execute", sql });
  }

  listTables(): Promise<DatabaseTableSummary[]> {
    return this.request({ type: "listTables" });
  }

  reset(): Promise<{ reset: true }> {
    return this.request({ type: "reset" });
  }
}

export const sqliteClient = new SqliteClient();
