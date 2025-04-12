import { Text } from 'react-native'
import { Home } from './src/modules/notes/ui/screens/Home/Home'
import { useFonts } from 'expo-font'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AddNote } from './src/modules/notes/ui/screens/AddNote/AddNote'
import { RootStackParamList } from './type'
import React from 'react'
import { EditNote } from './src/modules/notes/ui/screens/EditNote/EditNote'
import { NotesRepositoryProvider } from './src/modules/notes/providers/NotesRepository/NotesRepositoryProvider'
import { NotesProvider } from './src/modules/notes/providers/Notes/NotesProvider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetProvider } from './src/modules/notes/providers/BottomSheet/BottomSheetProvider'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

export default function App() {
  const [fontsLoaded] = useFonts({
    'mrt-regular': require('./assets/fonts/mrt-regular.ttf'),
    'mrt-bold': require('./assets/fonts/mrt-bold.ttf'),
    'mrt-extraBold': require('./assets/fonts/mrt-extraBold.ttf'),
    'mrt-light': require('./assets/fonts/mrt-light.ttf'),
    'mrt-medium': require('./assets/fonts/mrt-medium.ttf'),
  })

  if (!fontsLoaded) {
    return <Text>Cargando...</Text>
  }

  const Stack = createNativeStackNavigator<RootStackParamList>()

  const customTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <BottomSheetProvider>
          <NotesRepositoryProvider>
            <NotesProvider>
              <NavigationContainer theme={customTheme}>
                <Stack.Navigator initialRouteName="Notes">
                  <Stack.Screen
                    name="Notes"
                    component={Home}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="AddNote"
                    component={AddNote}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="EditNote"
                    component={EditNote}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </NotesProvider>
          </NotesRepositoryProvider>
        </BottomSheetProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}
