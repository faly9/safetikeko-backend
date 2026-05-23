export interface JwtPayload {
  sub: number
  pseudo: string
  role: string
  iat?: number
  exp?: number
}
