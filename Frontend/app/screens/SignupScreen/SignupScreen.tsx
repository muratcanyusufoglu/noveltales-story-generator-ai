import React, { FC, useState } from "react"
import { View, TextStyle, ViewStyle, SafeAreaView, TouchableOpacity } from "react-native"
import { Button, Text, TextField } from "../../components"
import { colors, spacing } from "../../theme"
import { useAuthenticationStore } from "app/store"
import { AppStackScreenProps } from "app/navigators"
import { translate } from "../../i18n"
import UserService from "../WelcomeScreen/LoginService"
import { toast } from "@baronha/ting"

interface SignupScreenProps extends AppStackScreenProps<"SignupScreen"> {}

export const SignupScreen: FC<SignupScreenProps> = (_props) => {
  const [mail, setMail] = useState("")
  const [uName, setUName] = useState("")
  const [password, setPassword] = useState("")

  const { setAuthToken, setAuthEmail, setUsername } = useAuthenticationStore()

  async function signup() {
    try {
      const userService = new UserService()
      const role = "user"
      const premium = false

      const user = await userService.registerUser(uName, mail, password, role, premium)

      setAuthToken(Number(Date.now()))
      setUsername(user.username)
      setAuthEmail(user.email)

      _props.navigation.navigate("Demo" as never)
    } catch (error) {
      console.error("Signup failed", error)
      toast({
        title: translate("alerts.error"),
        message: translate("toast.registrationFailed"),
        preset: "error",
        duration: 3000,
      })
    }
  }

  const handleSubmit = () => {
    if (!uName.trim() || !mail.trim() || !password.trim()) {
      toast({
        title: translate("alerts.error"),
        message: translate("toast.emptyFields"),
        preset: "done",
        duration: 3000,
      })
      return
    }
    signup()
  }

  const navigateToLogin = () => {
    _props.navigation.navigate("WelcomeScreen" as never)
  }

  return (
    <SafeAreaView style={$container}>
      <Text style={$welcomeText}>{translate("signupScreen.createAccount")}</Text>
      <Text style={$instructionText}>{translate("signupScreen.fillDetails")}</Text>

      <View style={$inputContainer}>
        <TextField
          label={translate("signupScreen.usernameLabel")}
          placeholder={translate("signupScreen.usernamePlaceholder")}
          value={uName}
          onChangeText={setUName}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
        />
        <TextField
          label={translate("signupScreen.emailLabel")}
          placeholder={translate("signupScreen.emailPlaceholder")}
          value={mail}
          onChangeText={setMail}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
        />
        <TextField
          label={translate("signupScreen.passwordLabel")}
          placeholder={translate("signupScreen.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
          secureTextEntry
        />
      </View>

      <Button
        text={translate("signupScreen.signUp")}
        style={$signupButton}
        textStyle={$signupButtonText}
        onPress={handleSubmit}
      />

      <TouchableOpacity style={$loginLink} onPress={navigateToLogin}>
        <Text style={$loginLinkText}>{translate("signupScreen.alreadyHaveAccount")}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
}

const $welcomeText: TextStyle = {
  textAlign: "center",
  color: colors.text,
  fontSize: 28,
  fontWeight: "bold",
  marginVertical: spacing.md,
  paddingTop: spacing.md,
}

const $instructionText: TextStyle = {
  textAlign: "center",
  color: colors.text,
  fontSize: 16,
  marginBottom: spacing.md,
  marginHorizontal: spacing.md,
}

const $inputContainer: ViewStyle = {
  marginVertical: spacing.md,
  marginHorizontal: spacing.md,
  borderRadius: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: spacing.md,
}

const $signupButton: ViewStyle = {
  backgroundColor: colors.appPrimary,
  borderRadius: spacing.md,
  paddingVertical: spacing.md,
  alignItems: "center",
  marginHorizontal: spacing.md,
}

const $signupButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "bold",
}

const $loginLink: ViewStyle = {
  marginTop: spacing.xl,
  alignItems: "center",
}

const $loginLinkText: TextStyle = {
  color: colors.appPrimary,
  fontSize: 16,
  textDecorationLine: "underline",
}
