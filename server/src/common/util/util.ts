import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

/**
 * HMAC-SHA256 인코딩 함수
 * @param signingKey - HMAC을 위한 서명 키 (16진수 문자열)
 * @param requestBody - 서명할 요청 본문
 * @returns Base64로 인코딩된 HMAC SHA-256 서명 문자
 */
export function generateSignature(
  signingKey: string,
  requestBody: string,
): string {
  const keyBuffer = Buffer.from(signingKey, 'hex');
  const hmac = crypto.createHmac('sha256', keyBuffer);
  hmac.update(requestBody, 'utf8');
  return hmac.digest('base64');
}

/**
 * X-Signature 헤더를 생성하여 요청에 추가하는 미들웨어
 * @param signingKey - HMAC 서명을 위한 Signing Key (16진수 문자열)
 * @returns Express 미들웨어 함수
 */
export function addSignatureHeader(signingKey: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Request body를 문자열로 변환 (예: JSON.stringify 등)
    const requestBody = JSON.stringify(req.body);

    // 1. signingKey를 hexadecimal bytes로 변환
    const keyBuffer = Buffer.from(signingKey, 'hex');

    // 2. requestBody를 UTF-8 bytes로 변환 후 HMAC SHA-256 해싱
    const hmac = crypto.createHmac('sha256', keyBuffer);
    hmac.update(requestBody, 'utf8');
    const digest = hmac.digest();

    // 3. 다이제스트를 Base64로 인코딩
    const signature = digest.toString('base64');

    // 4. X-Signature 헤더에 시그니처 추가
    req.headers['X-Signature'] = signature;

    next();
  };
}
