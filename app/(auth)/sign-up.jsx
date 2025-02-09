import * as React from "react";
import { Text, TextInput, Button, View, Pressable } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="bg-[#e4e4e4]">
        <View className="flex justify-start gap-14 h-screen mx-12">
          <View className="ml-4 pt-20 ">
            <Text
              className="font-black text-3xl color-[#F2C00F]"
              style={{
                WebkitTextStroke: "2px black",
                WebkitTextFillColor: "#F2C00F",
              }}
            >
              Quizify
            </Text>
          </View>
          <View className="ml-4 pt-8 gap-2">
            <Text className="font-extrabold text-2xl">E-postanı Onayla</Text>
          </View>
          <View className="flex items-center justify-center gap-14">
            <TextInput
              style={{ fontWeight: "bold" }}
              className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
              value={code}
              placeholder="Doğrulama kodunu girin"
              onChangeText={(code) => setCode(code)}
            />
            <Pressable
              onPress={onVerifyPress}
              className="flex items-center justify-center h-16 w-60 bg-[#F2C00F] rounded-2xl border-2 pl-2 border-black"
            >
              <Text className="font-extrabold text-xl">Doğrula</Text>
            </Pressable>
            <View className="flex-row gap-2">
              <Text className="font-medium">Kod Gelmedi Mi?</Text>
              <Pressable className="underline" onPress={onVerifyPress}>
                <Text className="font-semibold">Tekrar Gönder</Text>{" "}
                {/* burası çalışmıyo olabilir */}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-[#e4e4e4]">
      <View className="flex justify-start gap-14 h-screen mx-12">
        <View className="ml-4 pt-20 ">
          <Text
            className="font-black text-3xl color-[#F2C00F]"
            style={{
              WebkitTextStroke: "2px black",
              WebkitTextFillColor: "#F2C00F",
            }}
          >
            Quizify
          </Text>
        </View>
        <View className="ml-4 pt-8 gap-2">
          <Text className="font-extrabold text-2xl">Quizify'a Katıl!</Text>
          <Text className="font-semibold text-xl">
            Kayıt ol ve keşfetmeye başla
          </Text>
        </View>
        <View className="flex items-center justify-center gap-5">
          <TextInput
            style={{ fontWeight: "bold" }}
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            autoCapitalize="none"
            value={firstName}
            placeholder="Ad"
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          <TextInput
            style={{ fontWeight: "bold" }}
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            autoCapitalize="none"
            value={lastName}
            placeholder="Soyad"
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <TextInput
            style={{ fontWeight: "bold" }}
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="E-posta"
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            value={password}
            placeholder="Şifre"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Pressable
            onPress={onSignUpPress}
            className="flex items-center justify-center h-16 w-60 bg-[#F2C00F] rounded-2xl border-2 pl-2 border-black"
          >
            <Text className="font-extrabold text-xl">Giriş Yap</Text>
          </Pressable>
          <View className="flex-row gap-2">
            <Text className="font-medium">Zaten Hesabın Var Mı?</Text>
            <Link className="underline" href="/sign-in">
              <Text className="font-semibold">Giriş Yap</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
