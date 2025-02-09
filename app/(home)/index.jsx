import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { Text, View, Button, Image, Pressable } from "react-native";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <View>
      <SignedIn>
        <View className="flex justify-center gap-10 items-center h-screen bg-[#e4e4e4]">
          <Image
            style={{ width: 300, height: 300 }}
            source={require("../../assets/images/appLogo/logo.png")}
          />
          <View className="flex items-center ml-4 pt-8 gap-2">
            <Text className="font-extrabold text-2xl">Hoşgeldin,</Text>
            <Text className="font-semibold text-xl">{user?.fullName}</Text>
          </View>
          <Pressable
            onPress={signOut}
            className="flex items-center justify-center h-16 w-60 bg-[#F2C00F] rounded-2xl border-2 pl-2 border-black"
          >
            <Text className="font-extrabold text-xl">Çıkış Yap</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.replace("/(tabs)");
            }}
            className="flex items-center justify-center h-16 w-60 bg-[#F2C00F] rounded-2xl border-2 pl-2 border-black"
          >
            <Text className="font-extrabold text-xl">Ana Menü</Text>
          </Pressable>
        </View>
      </SignedIn>
      <SignedOut>
        <View className="flex justify-center gap-8 items-center h-screen bg-[#e4e4e4]">
          <Text
            className="font-extrabold text-6xl color-[#F2C00F]"
            style={{
              WebkitTextStroke: "3px black",
              WebkitTextFillColor: "#F2C00F",
            }}
          >
            QUIZIFY
          </Text>
          <Image
            style={{ width: 300, height: 300 }}
            source={require("../../assets/images/appLogo/logo.png")}
          />
          <Text className="font-bold text-xl mb-4">
            Bilgini Konuştur, Testini Oluştur!
          </Text>
          <Link
            className="flex items-center justify-center h-16 w-72 bg-[#83d8af] rounded-2xl border-2 border-black"
            href="/(auth)/sign-in"
          >
            <Text className="font-extrabold text-2xl">Giriş Yap</Text>
          </Link>
          <Link
            className="flex items-center justify-center h-16 w-72 bg-[#83d8af] rounded-2xl border-2 border-black"
            href="/(auth)/sign-up"
          >
            <Text className="font-extrabold text-2xl">Kaydol</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  );
}
