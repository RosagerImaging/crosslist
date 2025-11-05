/* eslint-disable @typescript-eslint/no-unused-vars */
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
    }
  }
}
