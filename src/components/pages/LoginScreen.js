import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const clearErrors = () => {
    setTimeout(() => {
      setErrors({ email: '', password: '' });
    }, 3000);
  };

  const validateInputs = () => {
    let isValid = true;
    let newErrors = { email: '', password: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) clearErrors();
    return isValid;
  };

  const login = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://demoapi.uhrlbd.com/public/api/login', {
        email,
        password,
      });
      await AsyncStorage.setItem('authToken', response.data.token);
      setEmail('');
      setPassword('');
      Alert.alert('Success', 'Login successful!');
      navigation.replace('Todos');
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data) {
        Alert.alert('Login Failed', error.response.data.message || 'Something went wrong.');
      } else {
        Alert.alert('Login Failed', 'Unable to connect to the server.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark-circle" size={80} color="#4CAF50" style={styles.iconShadow} />
      </View>
      <Text style={styles.title}>Welcome Back!</Text>

      <View
        style={[
          styles.inputContainer,
          focusedInput === 'email' && { borderColor: '#4CAF50', borderWidth: 2 },
        ]}
      >
        <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput('')}
          style={styles.input}
          autoCapitalize="none"
          placeholderTextColor="#bbb"
        />
      </View>
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          focusedInput === 'password' && { borderColor: '#4CAF50', borderWidth: 2 },
        ]}
      >
        <Icon name="lock-closed" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput('')}
          style={styles.input}
          placeholderTextColor="#bbb"
        />
      </View>
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

      <TouchableOpacity
        style={[styles.loginButton, loading && { backgroundColor: '#9E9E9E' }]}
        onPress={login}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6F61',
    alignSelf: 'flex-start',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});