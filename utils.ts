import { ErrorType, HttpBackendErrorResponse, HttpErrorResponse, HttpNetworkErrorResponse } from './request';

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isHttpNetworkErrorResponse(response: HttpErrorResponse): response is HttpNetworkErrorResponse {
  return response.type === ErrorType.NETWORK;
}

export function isHttpBackendErrorResponse(response: HttpErrorResponse): response is HttpBackendErrorResponse {
  return response.type === ErrorType.BACKEND;
}
