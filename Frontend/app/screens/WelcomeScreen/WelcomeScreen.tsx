import React, { FC, useState } from "react"
import { View, TextStyle, ViewStyle, SafeAreaView } from "react-native"
import { Button, Text, TextField } from "../../components"
import { colors, spacing } from "../../theme"
import { useAuthenticationStore } from "app/store"
import { DemoTabScreenProps } from "app/navigators/DemoNavigator"

interface WelcomeScreenProps extends DemoTabScreenProps<"WelcomeScreen"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = (_props) => {
  const [username, setUsername] = useState("")

  const { setAuthToken, setAuthEmail } = useAuthenticationStore()

  function login() {
    // Implement your login logic here
    console.log("adsadsads")
    setAuthToken(Number(Date.now()))
    setAuthEmail(username)
    _props.navigation.navigate("Demo" as never)
  }

  return (
    <SafeAreaView style={$container}>
      <Text style={$welcomeText}>Welcome Back!</Text>
      <Text style={$instructionText}>Please enter your username to continue.</Text>

      <View style={$inputContainer}>
        <TextField
          label="Username"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          containerStyle={$textField}
          placeholderTextColor={colors.palette.neutral500}
        />
      </View>

      <Button
        text="Log In"
        style={$loginButton}
        textStyle={$loginButtonText}
        onPress={() => login()}
      />
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
}

const $instructionText: TextStyle = {
  textAlign: "center",
  color: colors.text,
  fontSize: 16,
  marginBottom: spacing.md,
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
