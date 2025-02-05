import { NextResponse } from "next/server";

const response = {
  /**
   * @description なるこ在炫技 其實根本不用這樣搞
   * @author 星月なるこ
   * @date 2025-01-22 22:50:11
   * @param {string} message
   * @return {NextResponse}
   */
  badRequest: (message: string): NextResponse => {
    return new NextResponse(message, { status: 400 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:50:03
   * @param {string} message
   * @return {NextResponse}
   */
  conflict: (message: string): NextResponse => {
    return new NextResponse(message, { status: 409 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:50:02
   * @return {NextResponse}
   */
  created: (): NextResponse => {
    return new NextResponse(null, { status: 201 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:50:00
   * @param {string} message
   * @return {NextResponse}
   */
  forbidden: (message?: string): NextResponse => {
    return new NextResponse(message ? message : null, { status: 403 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:49:58
   * @return {NextResponse}
   */
  internalServerError: (): NextResponse => {
    return new NextResponse(null, { status: 500 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:49:56
   * @param {string} message
   * @return {NextResponse}
   */
  notFound: (message: string): NextResponse => {
    return new NextResponse(message, { status: 404 });
  },

  /**
   * @description
   * @author 星月なるこ
   * @date 2025-01-22 22:49:44
   * @param {object} data
   * @return {NextResponse}
   */
  success: (data: object): NextResponse => {
    return new NextResponse(JSON.stringify(data), { status: 200 });
  },
};

export const {
  badRequest,
  conflict,
  created,
  forbidden,
  internalServerError,
  notFound,
  success,
} = response;
