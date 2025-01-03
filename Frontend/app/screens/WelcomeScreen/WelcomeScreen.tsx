import React, { FC, useState } from "react"
import { View, TextStyle, ViewStyle, SafeAreaView, TouchableOpacity } from "react-native"
import { Button, Text, TextField } from "../../components"
import { colors, spacing } from "../../theme"
import { useAuthenticationStore } from "app/store"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"
import { translate } from "../../i18n"
import UserService from "./LoginService"
import { toast } from "@baronha/ting"

interface WelcomeScreenProps extends DemoTabScreenProps<"WelcomeScreen"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = (_props) => {
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")

  const { setAuthToken, setAuthEmail, setUsername } = useAuthenticationStore()

  async function login() {
    try {
      const userService = new UserService()
      const user = await userService.loginUser(mail, password)

      setAuthToken(Number(Date.now()))
      setUsername(user.username)
      setAuthEmail(user.email)

      _props.navigation.navigate("Demo" as never)
    } catch (error) {
      console.error("Login failed", error)
      toast({
        title: translate("alerts.error"),
        message: translate("toast.loginFailed"),
        preset: "error",
        duration: 3000,
      })
    }
  }

  const handleSubmit = () => {
    if (!mail.trim() || !password.trim()) {
      toast({
        title: translate("alerts.error"),
        message: translate("toast.emptyFields"),
        preset: "done",
        duration: 3000,
      })
      return
    }
    login()
  }

  const navigateToSignup = () => {
    _props.navigation.navigate("SignupScreen" as never)
  }

  return (
    <SafeAreaView style={$container}>
      <Text style={$welcomeText}>{translate("welcomeScreen.welcomeBack")}</Text>
      <Text style={$instructionText}>{translate("welcomeScreen.enterCredentials")}</Text>

      <View style={$inputContainer}>
        <TextField
          label={translate("welcomeScreen.emailLabel")}
          placeholder={translate("welcomeScreen.emailPlaceholder")}
          value={mail}
          onChangeText={setMail}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
        />
        <TextField
          label={translate("welcomeScreen.passwordLabel")}
          placeholder={translate("welcomeScreen.passwordPlaceholder")}
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
          secureTextEntry
        />
      </View>

      <Button
        text={translate("welcomeScreen.logIn")}
        style={$loginButton}
        textStyle={$loginButtonText}
        onPress={handleSubmit}
      />

      <TouchableOpacity style={$signupLink} onPress={navigateToSignup}>
        <Text style={$signupLinkText}>{translate("welcomeScreen.noAccount")}</Text>
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

const $loginButton: ViewStyle = {
  backgroundColor: colors.appPrimary,
  borderRadius: spacing.md,
  paddingVertical: spacing.md,
  alignItems: "center",
  marginHorizontal: spacing.md,
}

const $loginButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "bold",
}

const $signupLink: ViewStyle = {
  marginTop: spacing.xl,
  alignItems: "center",
}

const $signupLinkText: TextStyle = {
  color: colors.appPrimary,
  fontSize: 16,
  textDecorationLine: "underline",
}
