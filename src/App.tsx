import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import LoginScreen from './components/pages/LoginScreen';
import TodoScreen from './components/pages/TodoScreen';
import SignUp from './components/pages/Signup';
import ProfileScreen from './components/pages/ProfileScreen'; 
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Stack and Drawer Navigators
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer Screens
function DrawerScreens() {
    return (
        <Drawer.Navigator
            initialRouteName="Todos"
            screenOptions={{
                drawerStyle: {
                    backgroundColor: '#f8f9fa',
                    width: 240,
                },
                drawerActiveTintColor: '#3498db',
                drawerInactiveTintColor: '#555',
                headerStyle: {
                    backgroundColor: '#3498db',
                },
                headerTintColor: '#fff',
            }}
        >
            <Drawer.Screen 
                name="Todos" 
                component={TodoScreen} 
                options={{ headerShown: true }} 
            />
            <Drawer.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{ headerShown: true }} 
            />
        </Drawer.Navigator>
    );
}

// App Component
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Public Screens */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUp} />
                
                {/* Drawer Navigator */}
                <Stack.Screen 
                    name="Main" 
                    component={DrawerScreens} 
                    options={{ headerShown: false }} 
                />
            </Stack.Navigator>
            <Toast />
        </NavigationContainer>
    );
}
