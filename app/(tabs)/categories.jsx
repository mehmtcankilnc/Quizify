import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlatList, Pressable, Text, View, Image } from "react-native";
import { router } from "expo-router";

const categoryImages = {
  1: require("../../assets/images/categoryImages/1.png"),
  2: require("../../assets/images/categoryImages/2.png"),
  3: require("../../assets/images/categoryImages/3.png"),
  4: require("../../assets/images/categoryImages/4.png"),
  5: require("../../assets/images/categoryImages/5.png"),
  6: require("../../assets/images/categoryImages/6.png"),
  7: require("../../assets/images/categoryImages/7.png"),
};

function categories() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      setData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      <View className="h-52 w-full bg-[#83d8af] flex items-center justify-center rounded-b-2xl border-2 border-black relative">
        <Text className="font-extrabold text-2xl">Kategori Seç</Text>
      </View>
      <View className="h-auto w-full flex-1 justify-center items-center mb-14">
        <FlatList
          data={data}
          keyExtractor={(item) => item.categoryId.toString()}
          renderItem={({ item }) => (
            <View className="flex justify-center w-full h-24 rounded-xl border-2 mt-4 pl-2 bg-[#F2C00F]">
              <Pressable
                className="flex-row gap-2 items-center"
                onPress={() => router.push(`/quiz/${item.categoryId}`)}
              >
                <Image
                  style={{ width: 60, height: 60 }}
                  source={categoryImages[item.categoryId]}
                  resizeMode="cover"
                />
                <View className="w-60">
                  <Text className="font-bold">{item.categoryName}</Text>
                  <Text className="font-medium">{item.categoryDesc}</Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      </View>
    </View>
  );
}

export default categories;
