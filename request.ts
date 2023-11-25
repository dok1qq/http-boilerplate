export interface HttpSuccessResponse<R> {
  success: true;
  data: R;
}

export enum ErrorType {
  NETWORK = 'network',
  BACKEND = 'backend',
}

export interface HttpErrorResponseBase {
  success: false;
}

export interface HttpBackendErrorResponse extends HttpErrorResponseBase {
  type: ErrorType.BACKEND;
  data: unknown;
}

export interface HttpNetworkErrorResponse extends HttpErrorResponseBase {
  type: ErrorType.NETWORK;
  message: string;
}

export type HttpErrorResponse = HttpBackendErrorResponse | HttpNetworkErrorResponse;
export type HttpResponse<R> = HttpSuccessResponse<R> | HttpErrorResponse;
