import axios from "axios"
import { toast } from "@baronha/ting"
import { translate } from "app/i18n"

class UserService {
  private userUrl: string

  constructor() {
    this.userUrl = `${process.env.EXPO_PUBLIC_API}users`
    console.log("UserService initialized with URL:", this.userUrl)
  }

  private validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return {
        isValid: false,
        message: translate("auth.registration.error.message.emptyEmail"),
      }
    }
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: translate("auth.registration.error.message.invalidEmail"),
      }
    }
    return { isValid: true, message: "" }
  }

  private validatePassword(password: string) {
    if (!password) {
      return {
        isValid: false,
        message: translate("auth.registration.error.message.emptyPassword"),
      }
    }
    if (password.length < 6) {
      return {
        isValid: false,
        message: translate("auth.registration.error.message.passwordTooShort"),
      }
    }
    return { isValid: true, message: "" }
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
    role: string,
    premium: boolean,
  ) {
    try {
      console.log("usernameee", username, email, password, role, premium)
      console.log("Attempting to register user at:", `${this.userUrl}/register`)
      // First validate email format and type
      const emailValidation = this.validateEmail(email)
      if (!emailValidation.isValid) {
        toast({
          title: translate("auth.registration.error.title.invalidEmail"),
          message: emailValidation.message,
          preset: "error",
          duration: 3000,
        })
        throw new Error(emailValidation.message)
      }

      // Validate password
      const passwordValidation = this.validatePassword(password)
      if (!passwordValidation.isValid) {
        toast({
          title: translate("auth.registration.error.title.invalidPassword"),
          message: passwordValidation.message,
          preset: "error",
          duration: 3000,
        })
        throw new Error(passwordValidation.message)
      }

      const response = await axios.post(`${this.userUrl}/register`, {
        username,
        email,
        password,
        role,
        premium,
      })

      if (response.status === 201) {
        toast({
          title: translate("auth.registration.success.title"),
          message: translate("auth.registration.success.message"),
          preset: "done",
          duration: 3000,
        })
        return response.data
      }
    } catch (error: any) {
      console.error("Registration request failed:", {
        url: `${this.userUrl}/register`,
        error: error.response || error,
      })

      // Handle specific error cases
      if (error.response?.status === 400) {
        if (error.response.data.error === "Username or email already exists") {
          toast({
            title: translate("auth.registration.error.title.registrationFailed"),
            message: translate("auth.registration.error.message.userExists"),
            preset: "error",
            duration: 3000,
          })
          throw new Error("Email or username is already registered")
        }
      }

      // Generic error toast
      toast({
        title: translate("auth.registration.error.title.error"),
        message: error.message || translate("auth.registration.error.message.registrationFailed"),
        preset: "error",
        duration: 3000,
      })

      console.error("Failed to register user", error)
      throw error
    }
  }

  async loginUser(email: string, password: string) {
    try {
      // Validate email
      const emailValidation = this.validateEmail(email)
      if (!emailValidation.isValid) {
        toast({
          title: translate("auth.login.error.title.invalidEmail"),
          message: emailValidation.message,
          preset: "error",
          duration: 3000,
        })
        throw new Error(emailValidation.message)
      }

      // Validate password
      const passwordValidation = this.validatePassword(password)
      if (!passwordValidation.isValid) {
        toast({
          title: translate("auth.login.error.title.invalidPassword"),
          message: passwordValidation.message,
          preset: "error",
          duration: 3000,
        })
        throw new Error(passwordValidation.message)
      }

      const response = await axios.post(`${this.userUrl}/login`, {
        email,
        password,
      })

      if (response.status === 200) {
        toast({
          title: translate("auth.login.success.title"),
          message: translate("auth.login.success.message"),
          preset: "done",
          duration: 3000,
        })
        return response.data
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast({
          title: translate("auth.login.error.title.userNotFound"),
          message: translate("auth.login.error.message.userNotFound"),
          preset: "error",
          duration: 3000,
        })
        throw new Error("User not found")
      }

      if (error.response?.status === 401) {
        toast({
          title: translate("auth.login.error.title.invalidCredentials"),
          message: translate("auth.login.error.message.invalidCredentials"),
          preset: "error",
          duration: 3000,
        })
        throw new Error("Invalid credentials")
      }

      toast({
        title: translate("auth.login.error.title.error"),
        message: error.message || translate("auth.login.error.message.loginFailed"),
        preset: "error",
        duration: 3000,
      })

      console.error("Failed to login", error)
      throw error
    }
  }
}

export default UserService
