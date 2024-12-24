import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', email: '' });

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    // Fetch profile data on component mount
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get('https://demoapi.uhrlbd.com/public/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { name, email, profile_image } = response.data;
        setProfileData({ name, email });
        setProfileImage(profile_image); // Set profile image URL
        setValue('name', name); // Update form values dynamically
        setValue('email', email);
        // Alert.alert('Success', response.data.profile_image);
        console.log('Profile Image URL:', profile_image);

      } catch (error) {
        if (error.response) {
          console.log('Error response:', error.response.data);
          Alert.alert('Error', JSON.stringify(error.response.data.errors));
        } else {
          console.log('Error:', error.message);
          Alert.alert('Error', error.message);
        }
      }
    };

    fetchProfileData();
  }, [setValue]);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      (response) => {
        if (!response.didCancel && !response.error) {
          setProfileImage(response.assets[0]);
        }
      }
    );
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);

    if (profileImage?.uri) {
      formData.append('profile_image', {
        uri: profileImage.uri,
        type: profileImage.type,
        name: profileImage.fileName,
      });
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post('https://demoapi.uhrlbd.com/public/api/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Success', response.data.message);
    } catch (error) {
      if (error.response) {
        console.log('Error response:', error.response.data);
        Alert.alert('Validation Error', JSON.stringify(error.response.data.errors));
      } else {
        console.log('Error:', error.message);
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profileImage
              ? { uri: profileImage.uri  || profileImage } // Handles both local and API images
              : 'no image' // Default image
          }
          style={styles.image}
        />
        <Text style={styles.uploadText}>Tap to change profile picture</Text>
      </TouchableOpacity>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Name"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              setProfileData((prev) => ({ ...prev, name: text }));
            }}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="Email"
            value={value}
            onChangeText={(text) => {
              onChange(text);
              setProfileData((prev) => ({ ...prev, email: text }));
            }}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Button title="Update Profile" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: 'center',
    padding: 10,
  },
  uploadText: {
    color: '#007BFF',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
  },
});
