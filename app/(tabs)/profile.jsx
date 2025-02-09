import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { UserProfile } from "@clerk/clerk-react";

function profile() {
  const { user, isLoaded } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [visibleAccModal, setVisibleAccModal] = useState(false);
  const [visibleSecModal, setVisibleSecModal] = useState(false);
  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!isLoaded) return null;

  const openAccModal = () => setVisibleAccModal(true);
  const closeAccModal = () => setVisibleAccModal(false);
  const openSecModal = () => setVisibleSecModal(true);
  const closeSecModal = () => setVisibleSecModal(false);
  const openDeleteModal = () => setVisibleDeleteModal(true);
  const closeDeleteModal = () => setVisibleDeleteModal(false);

  const updateProfile = async () => {
    try {
      await user?.update({ firstName, lastName });
      console.log("Profil bilgileri güncellendi.");
    } catch (error) {
      console.error(error);
    }
  };

  const changePassword = async () => {
    try {
      await user?.updatePassword({
        currentPassword: currentPassword,
        newPassword,
      });
      console.log("Şifre Değiştirildi.");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAccount = async () => {
    try {
      await user?.delete();
      console.log("Hesabınız kalıcı olarak silindi.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex flex-col justify-between items-center h-screen bg-[#e4e4e4]">
      {/* üst konteynır */}
      <View className="h-52 w-full bg-[#83d8af] flex-row items-center px-10 justify-between rounded-b-2xl border-2 border-black relative">
        {/* profile image */}
        <View className="flex justify-center items-center mt-12">
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderWidth: 2,
            }}
            source={{ uri: user?.imageUrl }}
            resizeMode="contain"
          />
        </View>
        {/* profile name */}
        <View className="flex-1 mt-10">
          <Text className="font-extrabold text-2xl mt-2 mx-5" numberOfLines={2}>
            {user?.fullName}
          </Text>
        </View>
      </View>
      {/* alt konteynır */}
      <View className="h-4/6 w-full flex items-center justify-start">
        {/* hesap modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={visibleAccModal}
          onRequestClose={closeAccModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="flex w-4/5 h-3/5 bg-[#e4e4e4] justify-start items-center rounded-2xl border-2">
              <Text className="mt-10 font-extrabold text-xl">
                Hesap Ayarları
              </Text>
              <View className="flex items-center">
                <TextInput
                  className="w-[%88] h-10 rounded-lg flex items-center justify-center mt-20 mb-5 pl-2 border-2 border-[#15451F]"
                  style={{ fontWeight: "bold" }}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Adı"
                  placeholderTextColor="#3c3c3c"
                />
                <TextInput
                  className="w-[%88] h-10 rounded-lg flex items-center justify-center pl-2 border-2 border-[#15451F]"
                  style={{ fontWeight: "bold" }}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Soyadı"
                  placeholderTextColor="#3c3c3c"
                />
                <View className="flex-row gap-6">
                  <Pressable
                    onPress={closeAccModal}
                    className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-20 h-10 mt-32"
                  >
                    <Text className="font-bold">Geri</Text>
                  </Pressable>
                  <Pressable
                    onPress={updateProfile}
                    className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-20 h-10 mt-32"
                  >
                    <Text className="font-bold">Kaydet</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* güvenlik modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={visibleSecModal}
          onRequestClose={closeSecModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="flex w-4/5 h-3/5 bg-[#e4e4e4] justify-start items-center rounded-2xl border-2">
              <Modal
                transparent={true}
                animationType="fade"
                visible={visibleDeleteModal}
                onRequestClose={closeDeleteModal}
              >
                <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="flex w-4/5 h-3/5 bg-[#e4e4e4] justify-center items-center rounded-2xl border-2">
                    <Text className="font-bold text-xl text-center mb-20">
                      Hesabı silmek isteğine emin misin?
                    </Text>
                    <View className="flex-row gap-5">
                      <Pressable
                        onPress={closeDeleteModal}
                        className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-20 h-10 mt-5"
                      >
                        <Text className="font-bold">Hayır</Text>
                      </Pressable>
                      <Pressable
                        onPress={deleteAccount}
                        className="bg-[#eb1c1c] rounded-lg items-center justify-center border-2 border-[#080808] w-20 h-10 mt-5"
                      >
                        <Text className="font-bold">Evet</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
              <Text className="mt-10 font-extrabold text-xl">
                Güvenlik Ayarları
              </Text>
              <View className="flex items-center">
                <TextInput
                  className="w-[%88] h-10 rounded-lg flex items-center justify-center mt-20 mb-5 pl-2 border-2 border-[#15451F]"
                  style={{ fontWeight: "bold" }}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Mevcut Şifre"
                  placeholderTextColor="#3c3c3c"
                  secureTextEntry
                />
                <TextInput
                  className="w-[%88] h-10 rounded-lg flex items-center justify-center pl-2 border-2 border-[#15451F]"
                  style={{ fontWeight: "bold" }}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Yeni Şifre"
                  placeholderTextColor="#3c3c3c"
                  secureTextEntry
                />
                <Pressable
                  onPress={changePassword}
                  className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10 mt-5"
                >
                  <Text className="font-bold">Şifreyi Değiştir</Text>
                </Pressable>
                <Pressable
                  onPress={openDeleteModal}
                  className="bg-[#eb1c1c] rounded-lg items-center justify-center border-2 border-[#080808] w-40 h-10 mt-5"
                >
                  <Text className="font-bold">Hesabı Sil</Text>
                </Pressable>
                <Pressable
                  onPress={closeSecModal}
                  className="bg-[#F2C00F] rounded-lg items-center justify-center border-2 border-[#080808] w-20 h-10 mt-10"
                >
                  <Text className="font-bold">Geri</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View className="flex-row w-80 justify-between">
          <Text className="font-bold text-2xl">Hesap</Text>
          <TouchableOpacity onPress={openAccModal}>
            <FontAwesome5 name="pencil-alt" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex justify-evenly w-80 h-32 rounded-xl border-2 mt-4 pl-2 bg-[#F2C00F]">
          <View className="flex-row">
            <Text className="font-bold w-14">Ad</Text>
            <Text className="font-bold">: {user?.firstName}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold w-14">Soyad</Text>
            <Text className="font-bold">: {user?.lastName}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold w-14">E-Posta</Text>
            <Text className="font-bold">
              : {user?.emailAddresses[0].emailAddress}
            </Text>
          </View>
        </View>
        <View className="flex-row w-80 mt-5 justify-between">
          <Text className="font-bold text-2xl">Güvenlik</Text>
          <TouchableOpacity onPress={openSecModal}>
            <FontAwesome5 name="pencil-alt" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex justify-evenly w-80 h-32 rounded-xl border-2 mt-4 pl-2 bg-[#F2C00F]">
          <View className="flex-row">
            <Text className="font-bold w-14">Şifre</Text>
            <Text className="font-bold">: ********</Text>
          </View>
          <Text className="font-bold">Şifre Değiştir</Text>
          <Text className="font-bold">Hesabı Sil</Text>
        </View>
      </View>
    </View>
  );
}

export default profile;
