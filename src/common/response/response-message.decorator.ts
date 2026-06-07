import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'response_message';

/**
 * Đặt message tuỳ chỉnh cho response thành công của 1 route.
 * VD: @ResponseMessage('Tạo sản phẩm thành công')
 * Không dùng thì mặc định message = 'Success'.
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
