export type ApiErrorBody = {
  message: string | string[];
  statusCode: number;
  error?: string;
};

function isApiErrorBody(v: unknown): v is ApiErrorBody {
  return (
    typeof v === "object" &&
    v !== null &&
    ("message" in v || "error" in v)
  );
}

export function parseApiError(body: unknown, status: number): ApiErrorBody {
  if (isApiErrorBody(body)) {
    const message = Array.isArray(body.message)
      ? body.message[0] ?? "Erreur serveur"
      : body.message ?? body.error ?? "Erreur serveur";
    return { message, statusCode: status };
  }
  return { message: "Erreur serveur", statusCode: status };
}

export function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (isApiErrorBody(e)) {
    return Array.isArray(e.message) ? e.message[0] ?? "Erreur" : e.message;
  }
  return "Une erreur inattendue est survenue";
}
