export interface A2RSession {
  id: string;
}

export type CookieKeyProvider = () => Promise<string>;