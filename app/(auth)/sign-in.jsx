import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, Button, View, Pressable } from "react-native";
import React from "react";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
          <Text className="font-extrabold text-2xl">Tekrar Hoşgeldin!</Text>
          <Text className="font-semibold text-xl">
            Devam etmek için giriş yap
          </Text>
        </View>
        <View className="flex items-center justify-center gap-14">
          <TextInput
            style={{ fontWeight: "bold" }}
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="E-posta"
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          />
          <TextInput
            className="h-16 w-72 rounded-2xl border-2 pl-2 border-black bg-[#83d8af] placeholder:font-bold"
            value={password}
            placeholder="Şifre"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Pressable
            onPress={onSignInPress}
            className="flex items-center justify-center h-16 w-60 bg-[#F2C00F] rounded-2xl border-2 pl-2 border-black"
          >
            <Text className="font-extrabold text-xl">Giriş Yap</Text>
          </Pressable>
          <View className="flex-row gap-2">
            <Text className="font-medium">Hesabın yok mu?</Text>
            <Link className="underline" href="/sign-up">
              <Text className="font-semibold">Kaydol</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
