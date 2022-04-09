import axios from 'axios'
import { PostData, UserData } from './data.types'

export const db = {
  getUsers: async (): Promise<UserData[]> => {
    const res = await axios.get<UserData[]>(`http://localhost:3000/users`)
    return res.data
  },
  getUser: async (id: string): Promise<UserData> => {
    const res = await axios.get<UserData>(`http://localhost:3000/users/${id}`)
    return res.data
  },
  getUserPosts: async (id: string): Promise<PostData[]> => {
    const res = await axios.get<PostData[]>(
      `http://localhost:3000/users/${id}/posts`
    )
    return res.data
  },
  getPost: async (id: string): Promise<PostData> => {
    const res = await axios.get<PostData>(
      `http://localhost:3000/profiles/${id}`
    )
    return res.data
  }
}
