// cookie-utils.ts

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieManager {
  // Set cookie
  static setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return;

    const {
      expires,
      maxAge,
      path = '/',
      domain,
      secure = window.location.protocol === 'https:',
      sameSite = 'lax'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (maxAge !== undefined) {
      cookieString += `; max-age=${maxAge}`;
    }

    cookieString += `; path=${path}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    if (secure) {
      cookieString += `; secure`;
    }

    cookieString += `; samesite=${sameSite}`;

    document.cookie = cookieString;
  }

  // Get cookie
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  // Remove cookie
  static removeCookie(name: string, options: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): void {
    if (typeof document === 'undefined') return;

    const { path = '/', domain } = options;

    this.setCookie(name, '', {
      ...options,
      expires: new Date(0),
      path,
      domain
    });
  }

  // Check if cookies are enabled
  static areCookiesEnabled(): boolean {
    if (typeof document === 'undefined') return false;

    const testCookie = 'cookietest';
    this.setCookie(testCookie, 'test', { maxAge: 1 });
    const enabled = this.getCookie(testCookie) === 'test';
    this.removeCookie(testCookie);
    return enabled;
  }
}