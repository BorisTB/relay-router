export interface UserData {
  id: string
  city: string
  email: string
  company: string
  country: string
  username: string
}

export interface PostData {
  id: string
  userId: string
  body: string
}

export interface Data {
  users: UserData[]
  posts: PostData[]
}
