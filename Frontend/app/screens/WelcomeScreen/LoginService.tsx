import axios from "axios"
import { toast } from "@baronha/ting"
import { translate } from "app/i18n"

class UserService {
  userUrl = process.env.EXPO_PUBLIC_USERS

  // List of common temporary email domains
  private tempEmailDomains = [
    "tempmail.com",
    "temp-mail.org",
    "disposablemail.com",
    "mailinator.com",
    "guerrillamail.com",
    "sharklasers.com",
    "yopmail.com",
    "10minutemail.com",
    "throwawaymail.com",
    "tempinbox.com",
    "fakeinbox.com",
    "tempmail.net",
    "trashmail.com",
    "mailnesia.com",
  ]

  validateEmail(email: string): { isValid: boolean; message: string } {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, message: translate("auth.validation.invalidEmail") }
    }

    // Check for temporary email domains
    const domain = email.split("@")[1].toLowerCase()
    if (this.tempEmailDomains.includes(domain)) {
      return { isValid: false, message: translate("auth.validation.tempEmailNotAllowed") }
    }

    // Additional email validations can be added here
    // For example, checking for business domains, specific TLDs, etc.

    return { isValid: true, message: translate("auth.validation.emailValid") }
  }

  async registerUser(username: string, email: string, role: string, premium: boolean) {
    try {
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

      const response = await axios.post(`${this.userUrl}/register`, {
        username,
        email,
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
}

export default UserService
