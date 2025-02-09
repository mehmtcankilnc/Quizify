import { useLocalSearchParams, router } from "expo-router";
import React from "react";
import { View, Text, Pressable } from "react-native";

function ResultPage() {
  const { totalCorrect, totalWrong, unanswered } = useLocalSearchParams();

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      <View className="h-20 w-full bg-[#83d8af] flex items-center justify-center rounded-b-2xl border-2 border-black relative">
        <Text className="font-extrabold text-2xl">Results</Text>
      </View>
      <View className="h-4/6 w-full flex items-center justify-center">
        <Text className="flex justify-start w-80 h-40 rounded-xl border-2 pl-2 pt-3 bg-[#F2C00F] font-medium">
          Correct Answers: {totalCorrect}
          {"\n"}
          {"\n"}
          Wrong Answers: {totalWrong}
          {"\n"}
          {"\n"}
          Unanswered Questions: {unanswered}
          {"\n"}
          {"\n"}
          Total Questions:{" "}
          {parseInt(totalCorrect) + parseInt(totalWrong) + parseInt(unanswered)}
        </Text>
      </View>
      <View className="flex h-16 justify-center items-center bg-[#83d8af] w-full rounded-t-2xl border-2 border-black">
        <Pressable
          className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10"
          onPress={() => router.push("/yourQuizzes")}
        >
          <Text className="font-bold">Main Menu</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default ResultPage;
