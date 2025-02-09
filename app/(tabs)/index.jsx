import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Home() {
  const { user } = useUser();

  return (
    <View className="flex-1 items-center justify-start bg-[#e4e4e4]">
      <View className="h-52 w-full bg-[#83d8af] flex-row items-center px-10 justify-between rounded-b-2xl border-2 border-black relative">
        {/* Metin Alanı */}
        <View className="flex-1">
          <Text className="font-extrabold text-2xl">Hoşgeldin,</Text>
          <Text
            className="font-extrabold text-2xl mt-2 truncate"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user?.firstName}
          </Text>
        </View>
        {/* Resim Alanı */}
        <View className="w-36 h-36 flex justify-center items-center">
          <Image
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
            source={require("../../assets/images/appLogo/logo.png")}
          />
        </View>
      </View>
      <View className="flex w-full h-3/5 justify-center items-center">
        {/* Kategori seç butonu */}
        <View className="w-5/6 h-24 bg-[#F2C00F] rounded-xl border-2 mt-6">
          <Pressable
            className="flex h-full justify-center items-center"
            onPress={() => router.push("/(tabs)/categories")}
          >
            <Text className="font-bold">Kategoriler</Text>
          </Pressable>
        </View>
        {/* Diğer butonlar */}
        <View className="flex flex-row justify-between w-5/6 h-24 mt-6">
          <View className="w-[48%] bg-[#F2C00F] rounded-xl border-2">
            <Pressable
              className="flex h-full justify-center items-center"
              onPress={() => router.push("/create")}
            >
              <Text className="font-bold">Test Oluştur</Text>
            </Pressable>
          </View>
          <View className="w-[48%] bg-[#F2C00F] rounded-xl border-2">
            <Pressable
              className="flex h-full justify-center items-center"
              onPress={() => router.push("../yourQuizzes")}
            >
              <Text className="font-bold">Testlerin</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

{
  /* <Pressable onPress={() => router.push("/quiz/0")}>
        <Text className="text-red-600">Go to Quiz</Text>
      </Pressable> */
}
