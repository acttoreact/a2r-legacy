export interface Session {
  id: string;
}

export type CookieKeyProvider = () => Promise<string>;