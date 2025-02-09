import React, { useEffect, useState } from "react";
import { Text, FlatList, Pressable, View } from "react-native";
import axios from "axios";
import { router } from "expo-router";

function yourQuizzes() {
  const [customQuizzes, setCustomQuizzes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getcustomquiz"
      );
      console.log(response.data);
      setCustomQuizzes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      <View className="h-20 w-full bg-[#83d8af] flex items-center justify-center rounded-b-2xl border-2 border-black relative">
        <Text className="font-extrabold text-2xl">Testlerin</Text>
      </View>
      <View className="h-5/6 w-full flex items-center justify-start">
        {customQuizzes.length > 0 ? (
          customQuizzes.map((quiz, index) => (
            <View
              key={index}
              className="flex justify-center w-80 h-24 rounded-xl border-2 mt-4 pl-2 bg-[#F2C00F]"
            >
              <Pressable onPress={() => router.push(`/customQuiz/${quiz.id}`)}>
                <Text className="font-bold text-center">{quiz.title}</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <View className="flex justify-center w-80 h-24 rounded-xl border-2 mt-4 bg-[#F2C00F]">
            <Text className="font-bold text-center">
              Henüz burada gösterilecek bir şey yok...
            </Text>
          </View>
        )}
      </View>
      <View className="flex h-16 justify-center items-center bg-[#83d8af] w-full rounded-t-2xl border-2 border-black">
        <Pressable
          className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10"
          onPress={() => router.push("/(tabs)")}
        >
          <Text className="font-bold">Ana Menü</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default yourQuizzes;
