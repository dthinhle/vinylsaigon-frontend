import { apiClient } from '@/lib/axios'
import { IUser } from '@/lib/types/user'

export const getUser = async (): Promise<IUser> => {
  try {
    const res = await apiClient.get('/user/profile')
    return res.data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw new Error('Failed to fetch user profile')
  }
}

export const updateUser = async (data: Partial<IUser>): Promise<IUser> => {
  try {
    const res = await apiClient.put('/user', data)
    return res.data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw new Error('Failed to update user profile')
  }
}
