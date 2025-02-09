import { View, Text, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const defaultTime = 20;

function CustomQuizPage() {
  const { id } = useLocalSearchParams();
  const parsedId = parseInt(id);

  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [currCusQuestionIndex, setCurrCusQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(defaultTime);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalWrong, setTotalWrong] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3000/api/getcustomquiz/${parsedId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        console.log(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let timeLeft;

    if (timer > 0) {
      timeLeft = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      currCusQuestionIndex === data.questions.length - 1
        ? handleFinish()
        : handleNext();
    }

    return () => clearInterval(timeLeft);
  }, [timer]);

  useEffect(() => {
    if (answer) {
      const correctAnswerIndex =
        data.questions[currCusQuestionIndex]?.correctAnswer;
      if (
        answer ===
        data.questions[currCusQuestionIndex]?.options[correctAnswerIndex]
      ) {
        setIsCorrect(true);
        console.log("correct");
        setTotalCorrect((prev) => prev + 1);
      } else {
        setIsCorrect(false);
        console.log("wrong");
        setTotalWrong((prev) => prev + 1);
      }
    }
  }, [answer]);

  const handleAnswer = (selectedOption) => {
    if (!isSelected) {
      setAnswer(selectedOption);
      setIsSelected(true);
    } else {
      console.log("you cant choose another option");
    }
  };

  const handleNext = () => {
    setCurrCusQuestionIndex((prev) => {
      const nextIndex = Math.min(prev + 1, data.questions.length - 1);
      return nextIndex;
    });

    if (answer !== "" || timer === 0) {
      if (currCusQuestionIndex < data.questions.length - 1) {
        setIsSelected(false);
        setIsCorrect(false);
        setAnswer("");
        setTimer(defaultTime);
      } else {
        console.log("Test completed");
        router.push("../resultPage");
      }
    }
  };

  const handleFinish = () => {
    console.log(
      `test completed with ${totalCorrect} correct answer out of ${data.questions.length} questions`
    );
    router.push({
      pathname: "../resultPage",
      params: {
        totalCorrect: totalCorrect,
        totalWrong: totalWrong,
        unanswered: data.questions.length - (totalCorrect + totalWrong),
      },
    });
  };

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      {/* Önce verinin yüklendiğinden emin ol */}
      {!data || !data.questions ? (
        <Text>Yükleniyor...</Text>
      ) : (
        <>
          {/* Soru Alanı */}
          <View className="h-2/6 w-full bg-[#83d8af] flex items-center justify-center rounded-b-2xl border-2 border-black relative">
            {/* ... (Geri butonu aynı) */}

            {/* Geri Butonu */}
            <Pressable
              className="absolute top-4 left-4 p-2"
              onPress={() => router.push("/yourQuizzes")}
            >
              <Ionicons name="arrow-back-circle" size={48} color="black" />
            </Pressable>

            {/* Soru */}
            <Text className="h-16 w-4/5 bg-[#F2C00F] text-center font-bold flex items-center justify-center text-[#0f0f0f] rounded-2xl border-2 border-black mt-16">
              {data.questions[currCusQuestionIndex]?.questionText}
            </Text>

            {/* Süre Sayacı */}
            <Text className="absolute top-4 right-4 text-black font-bold text-3xl p-2 border-2 rounded-full">
              {timer}
            </Text>
          </View>

          {/* Şıklar */}
          <View className="flex h-3/6 justify-center items-center">
            {data.questions[currCusQuestionIndex]?.options?.map(
              (option, index) => {
                // Null check ekle
                const currentQuestion = data.questions[currCusQuestionIndex];
                if (!currentQuestion) return null;

                const correctAnswerIndex = currentQuestion.correctAnswer;
                const isSelected = answer === option;

                let bgColorClass = "";
                if (answer && isSelected) {
                  if (index === correctAnswerIndex) {
                    bgColorClass = "bg-[#28c928]";
                  } else if (!isCorrect) {
                    bgColorClass = "bg-[#eb1c1c]";
                  }
                }

                return (
                  <Pressable
                    key={index}
                    className={`w-80 h-10 rounded-lg flex items-center justify-center mb-3 border-2 border-[#15451F] ${bgColorClass}`}
                    onPress={() => !answer && handleAnswer(option)}
                    disabled={!!answer}
                  >
                    <Text className="font-medium">
                      {option || "Geçersiz seçenek"}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </View>

          {/* İleri Butonu */}
          <View className="flex h-16 justify-center items-center bg-[#83d8af] w-full rounded-t-2xl border-2 border-black">
            <Pressable
              className={`${
                !answer ? "bg-[#83d8af]" : "bg-[#F2C00F]"
              } rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10`}
              onPress={
                currCusQuestionIndex === data.questions.length - 1
                  ? handleFinish
                  : handleNext
              }
              disabled={!answer}
            >
              <Text className="font-bold">
                {currCusQuestionIndex === (data.questions?.length || 0) - 1
                  ? "Finish"
                  : "Next"}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

export default CustomQuizPage;
