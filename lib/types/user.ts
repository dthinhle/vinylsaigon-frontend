export interface IUser {
  id: number
  email: string
  name: string
  accessToken?: string
  refreshToken?: string
  exp?: number
  phoneNumber?: string

  subscribeNewsletter?: boolean
}
