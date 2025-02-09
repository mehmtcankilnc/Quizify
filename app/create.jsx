import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { router } from "expo-router";
import axios from "axios";

const validationSchema = yup.object().shape({
  quizTitle: yup.string().required("Zorunlu Alan!"),
  questions: yup.array().of(
    yup.object().shape({
      questionText: yup.string().required("Zorunlu Alan!"),
      options: yup.array().of(yup.string().required("Zorunlu Alan!")),
      correctAnswer: yup.number().nullable().required("Zorunlu Alan!"),
    })
  ),
});

function CreatePage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const initialValues = {
    quizTitle: "",
    questions: [
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: null,
      },
    ],
  };

  const handleSubmit = async (values) => {
    console.log("Submitted Values:", values);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/createquiz",
        values
      );
      console.log("Data sended!", response.data);

      router.push("/yourQuizzes");
    } catch (error) {
      console.error("Data sending error!", error);
    }
  };

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setValues,
        }) => (
          <>
            {/* Test Başlığı */}
            <View className="h-2/6 w-full bg-[#83d8af] flex gap-8 items-center justify-center rounded-b-2xl border-2 border-black relative">
              <Text className="font-extrabold text-2xl">Test Oluştur</Text>
              <TextInput
                onChangeText={handleChange("quizTitle")}
                onBlur={handleBlur("quizTitle")}
                value={values.quizTitle}
                placeholder={
                  touched.quizTitle && errors.quizTitle
                    ? `Test Başlığı ${errors.quizTitle}`
                    : "Test Başlığı"
                }
                placeholderTextColor={
                  touched.quizTitle && errors.quizTitle ? "#eb1c1c" : "black"
                }
                className="h-16 w-4/5 bg-[#F2C00F] text-center font-bold text-[#0f0f0f] rounded-2xl border-2 border-black"
              />
            </View>
            {/* Orta Konteynır */}
            <View className="flex justify-center items-center gap-3">
              {/* Soru Metni */}
              <TextInput
                onChangeText={handleChange(
                  `questions[${currentQuestionIndex}].questionText`
                )}
                onBlur={handleBlur(
                  `questions[${currentQuestionIndex}].questionText`
                )}
                value={values.questions[currentQuestionIndex].questionText}
                placeholder={
                  touched.questions?.[currentQuestionIndex]?.questionText &&
                  errors.questions?.[currentQuestionIndex]?.questionText
                    ? `${currentQuestionIndex + 1}. Soru Metni ${
                        errors.questions?.[currentQuestionIndex]?.questionText
                      }`
                    : `${currentQuestionIndex + 1}. Soru Metni`
                }
                placeholderTextColor={
                  touched.quizTitle && errors.quizTitle ? "#eb1c1c" : "black"
                }
                className="h-16 w-60 bg-[#F2C00F] text-center font-bold text-[#0f0f0f] rounded-2xl border-2 border-black"
              />
              {/* Seçenekler */}
              {values.questions[currentQuestionIndex].options.map(
                (option, optionIndex) => (
                  <View key={optionIndex}>
                    <TextInput
                      onChangeText={handleChange(
                        `questions[${currentQuestionIndex}].options.${optionIndex}`
                      )}
                      onBlur={handleBlur(
                        `questions[${currentQuestionIndex}].options.${optionIndex}`
                      )}
                      value={option}
                      placeholder={
                        touched.questions?.[currentQuestionIndex]?.options?.[
                          optionIndex
                        ] &&
                        errors.questions?.[currentQuestionIndex]?.options?.[
                          optionIndex
                        ]
                          ? `${optionIndex + 1}. Seçenek ${
                              errors.questions?.[currentQuestionIndex]
                                ?.options?.[optionIndex]
                            }`
                          : `${optionIndex + 1}. Seçenek`
                      }
                      placeholderTextColor={
                        touched.quizTitle && errors.quizTitle
                          ? "#eb1c1c"
                          : "black"
                      }
                      className="w-80 h-10 rounded-lg flex items-center justify-center mb-3 border-2 border-[#15451F]"
                      style={{ fontWeight: "bold" }}
                    />
                  </View>
                )
              )}
              {/* Doğru Seçenek */}
              <View className="flex items-center gap-2">
                <View className="flex-row justify-center gap-2">
                  {values.questions[currentQuestionIndex].options.map(
                    (_, optionIndex) => (
                      <TouchableOpacity
                        className={`h-10 w-18 rounded-lg flex items-center justify-center mb-2 p-1 border-2 border-[#15451F] ${
                          values.questions[currentQuestionIndex]
                            .correctAnswer === optionIndex
                            ? "bg-green-400"
                            : ""
                        }`}
                        key={optionIndex}
                        onPress={() => {
                          const updatedQuestions = [...values.questions];
                          updatedQuestions[currentQuestionIndex].correctAnswer =
                            optionIndex;
                          setValues({ ...values, questions: updatedQuestions });
                        }}
                      >
                        <Text className="font-medium">
                          Seçenek {optionIndex + 1}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
                {touched.questions?.[currentQuestionIndex]?.correctAnswer &&
                  errors.questions?.[currentQuestionIndex]?.correctAnswer && (
                    <Text className="text-red-500">
                      {errors.questions[currentQuestionIndex].correctAnswer}
                    </Text>
                  )}
              </View>
              {/* Soru Ekle,Sil - Önceki,Sonraki Soru */}
              <View className="flex-row justify-center gap-4 mt-4">
                {currentQuestionIndex > 0 && (
                  <Pressable
                    onPress={() =>
                      setCurrentQuestionIndex(currentQuestionIndex - 1)
                    }
                    className="bg-[#28c928] rounded-lg items-center justify-center border-2 border-[#080808] w-28 h-10"
                  >
                    <Text className="font-bold">Önceki Soru</Text>
                  </Pressable>
                )}
                {values.questions.length > 1 && (
                  <Pressable
                    onPress={() => {
                      const updatedQuestions = values.questions.filter(
                        (_, index) => index !== currentQuestionIndex
                      );
                      setValues({ ...values, questions: updatedQuestions });
                      setCurrentQuestionIndex(
                        Math.max(0, currentQuestionIndex - 1)
                      );
                    }}
                    className="bg-[#ff0000] rounded-lg items-center justify-center border-2 border-[#080808] w-28 h-10"
                  >
                    <Text className="font-bold">Soruyu Sil</Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={() => {
                    if (currentQuestionIndex === values.questions.length - 1) {
                      setValues({
                        ...values,
                        questions: [
                          ...values.questions,
                          {
                            questionText: "",
                            options: ["", "", "", ""],
                            correctAnswer: null,
                          },
                        ],
                      });
                    }
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                  }}
                  className="bg-[#28c928] rounded-lg items-center justify-center border-2 border-[#080808] w-28 h-10"
                >
                  <Text className="font-bold">
                    {currentQuestionIndex === values.questions.length - 1
                      ? "Yeni Soru Ekle"
                      : "Sonraki Soru"}
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* Geri, Oluştur */}
            <View className="flex-row h-16 justify-center items-center gap-4 bg-[#83d8af] w-full rounded-t-2xl border-2 border-black">
              <Pressable
                className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10"
                onPress={() => router.push("/(tabs)")}
              >
                <Text className="font-bold">Geri</Text>
              </Pressable>
              <Pressable
                className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10"
                onPress={handleSubmit}
              >
                <Text className="font-bold">Oluştur</Text>
              </Pressable>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
}

export default CreatePage;
