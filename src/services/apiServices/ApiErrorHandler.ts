export type ApiErrorData = Record<string, unknown>;

export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: ApiErrorData;

  constructor(
    message: string,
    status: number,
    statusText: string,
    data: ApiErrorData = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

class ApiErrorHandler {
  public async handleResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
      return (await response.json()) as T;
    }

    const errorData: ApiErrorData = await this.safeParseJson(response);

    throw new ApiError(
      `Failed to fetch data: ${response.status} ${response.statusText}`,
      response.status,
      response.statusText,
      errorData,
    );
  }

  public handleError(error: unknown): never {
    throw error;
  }

  private async safeParseJson(
    response: Response,
  ): Promise<ApiErrorData> {
    try {
      const data: unknown = await response.json();
      return this.isRecord(data) ? data : {};
    } catch {
      return {};
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}

export default ApiErrorHandler;
