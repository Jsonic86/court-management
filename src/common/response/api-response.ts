/** Format envelope chuẩn cho mọi response của API. */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  /** Có khi success = true. */
  data?: T;
  /** Có khi success = false — chi tiết lỗi (vd Zod format). */
  error?: unknown;
}
