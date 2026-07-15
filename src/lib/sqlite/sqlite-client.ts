import type {
  DatabaseInitializationResult,
  DatabaseTableData,
  DatabaseTableSummary,
  DeleteRowInput,
  InsertRowInput,
  QueryResult,
  UpdateRowInput,
} from "@/types/database";

import type {
  ImportRequest,
  ImportResult,
} from "@/types/import";

type WorkerRequest =
  | { id: string; type: "initialize" }
  | { id: string; type: "execute"; sql: string }
  | { id: string; type: "listTables" }
  | {
      id: string;
      type: "getTableData";
      tableName: string;
      limit: number;
      offset: number;
    }
  | { id: string; type: "insertRow"; input: InsertRowInput }
  | { id: string; type: "updateRow"; input: UpdateRowInput }
  | { id: string; type: "deleteRow"; input: DeleteRowInput }
  | { id: string; type: "importData"; input: ImportRequest }
  | { id: string; type: "reset" };

type WorkerRequestWithoutId =
  | { type: "initialize" }
  | { type: "execute"; sql: string }
  | { type: "listTables" }
  | {
      type: "getTableData";
      tableName: string;
      limit: number;
      offset: number;
    }
  | { type: "insertRow"; input: InsertRowInput }
  | { type: "updateRow"; input: UpdateRowInput }
  | { type: "deleteRow"; input: DeleteRowInput }
  | { type: "importData"; input: ImportRequest }
  | { type: "reset" };

type WorkerResponse =
  | { id: string; ok: true; result: unknown }
  | { id: string; ok: false; error: string };

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
};

type MutationResult = {
  affectedRows: number;
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

  initialize(): Promise<DatabaseInitializationResult> {
    return this.request({ type: "initialize" });
  }

  execute(sql: string): Promise<QueryResult> {
    return this.request({ type: "execute", sql });
  }

  listTables(): Promise<DatabaseTableSummary[]> {
    return this.request({ type: "listTables" });
  }

  getTableData(
    tableName: string,
    options: {
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<DatabaseTableData> {
    return this.request({
      type: "getTableData",
      tableName,
      limit: options.limit ?? 50,
      offset: options.offset ?? 0,
    });
  }

  insertRow(input: InsertRowInput): Promise<MutationResult> {
    return this.request({
      type: "insertRow",
      input,
    });
  }

  updateRow(input: UpdateRowInput): Promise<MutationResult> {
    return this.request({
      type: "updateRow",
      input,
    });
  }

  deleteRow(input: DeleteRowInput): Promise<MutationResult> {
    return this.request({
      type: "deleteRow",
      input,
    });
  }

  importData(input: ImportRequest): Promise<ImportResult> {
    return this.request({
      type: "importData",
      input,
    });
  }

  reset(): Promise<{ reset: true }> {
    return this.request({ type: "reset" });
  }
}

export const sqliteClient = new SqliteClient();
