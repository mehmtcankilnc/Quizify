import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="../(tabs)"></Stack.Screen>
      <Stack.Screen name="../quiz/[id]"></Stack.Screen>
    </Stack>
  );
}
