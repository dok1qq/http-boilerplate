import { isString } from './utils';
import { BodyParser } from './body-parser';
import { ErrorType, HttpNetworkErrorResponse, HttpResponse } from './request';

const UNEXPECTED_ERROR = 'Unexpected error';

export enum BaseHeader {
  ACCEPT = 'Accept',
  AUTHORIZATION = 'Authorization',
  CONTENT_TYPE = 'Content-Type',
  // Add needed headers
}

export enum MIME {
  JSON = 'application/json',
  X_NDJSON = 'application/x-ndjson',
  TEXT_EVENT_STREAM = 'text/event-stream',
  TEXT_PLAIN = 'text/plain',
  // Add needed mime types
}

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal | null;
}

const HttpBodyParser: Record<MIME, (r: Response) => Promise<unknown>> = {
  [MIME.JSON]: BodyParser.json,
  [MIME.X_NDJSON]: BodyParser.ndjson,
  [MIME.TEXT_EVENT_STREAM]: BodyParser.textEventStream,
  [MIME.TEXT_PLAIN]: BodyParser.text,
};

class Http {
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  removeHeader(key: string): void {
    if (this.headers[key]) {
      delete this.headers[key];
    }
  }

  get<Res>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<Res>> {
    const { headers = {}, signal = null } = options;

    return fetch(url, {
      method: 'GET',
      headers: this.initHeaders(headers),
      signal,
    })
      .then((r) => this.parseResponse<Res>(r))
      .catch((e) => this.parseNetworkError(e));
  }

  post<Data, Res>(
    url: string,
    data: Data,
    options: HttpRequestOptions = {},
  ): Promise<HttpResponse<Res>> {
    const { headers = {}, signal = null } = options;

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this.initHeaders(headers),
      signal,
    })
      .then((r) => this.parseResponse<Res>(r))
      .catch((e) => this.parseNetworkError(e));
  }

  put<Data, Res>(
    url: string,
    data: Data,
    options: HttpRequestOptions = {}
  ): Promise<HttpResponse<Res>> {
    const { headers = {}, signal = null } = options;

    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: this.initHeaders(headers),
      signal,
    })
      .then((r) => this.parseResponse<Res>(r))
      .catch((e) => this.parseNetworkError(e));
  }

  delete<Res>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<Res>> {
    const { headers = {}, signal = null } = options;

    return fetch(url, {
      method: 'DELETE',
      headers: this.initHeaders(headers),
      signal,
    })
      .then((r) => this.parseResponse<Res>(r))
      .catch((e) => this.parseNetworkError(e));
  }

  private initHeaders(custom: Record<string, string>) {
    return {
      ...this.headers,
      ...custom,
    };
  }

  private parseNetworkError(error: unknown): HttpNetworkErrorResponse {
    if (error instanceof Error) {
      return { success: false, type: ErrorType.NETWORK, message: error.message };
    }
    if (isString(error)) {
      return { success: false, type: ErrorType.NETWORK, message: error };
    }

    return { success: false, type: ErrorType.NETWORK, message: UNEXPECTED_ERROR };
  }

  private async parseResponse<R>(response: Response): Promise<HttpResponse<R>> {
    const type = response.headers.get(BaseHeader.CONTENT_TYPE);
    if (!type) {
      return { success: false, type: ErrorType.BACKEND, data: `Response doesn't contain Content-Type header` };
    }

    let body: R | null = null;
    const parser = HttpBodyParser[type as MIME];

    if (parser) {
      body = (await parser(response)) as R;
      if (response.ok) {
        return { success: true, data: body };
      } else {
        return { success: false, type: ErrorType.BACKEND, data: body };
      }
    } else {
      console.error(`Add http body parser for type ${type}`);
      return { success: false, type: ErrorType.BACKEND, data: UNEXPECTED_ERROR };
    }
  }
}

export const http = new Http();
