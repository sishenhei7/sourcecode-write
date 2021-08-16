declare module 'delegates'

// declare 到底怎么合并 module 和 interface ？
declare module 'http' {
  interface ServerResponse {
    _headers: Record<string, unknown>
  }
}

declare interface NumberConstructor {
  isInteger(number: unknown): number is number
}
