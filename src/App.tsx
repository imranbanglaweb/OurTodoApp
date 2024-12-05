import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/pages/LoginScreen';
import TodoScreen from './components/pages/TodoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Todos" component={TodoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
