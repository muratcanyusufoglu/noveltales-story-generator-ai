import axios from "axios"

class UserService {
  userUrl = process.env.EXPO_PUBLIC_USERS

  async registerUser(username: string, email: string, role: string, premium: boolean) {
    try {
      const response = await axios.post(`${this.userUrl}/register`, {
        username,
        email,
        role,
        premium,
      })

      if (response.status === 201) {
        console.log("User registered successfully", response.data)
        return response.data
      }
    } catch (error) {
      console.error("Failed to register user", error)
      throw error
    }
  }
}

export default UserService
