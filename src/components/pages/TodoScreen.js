import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function TodoScreen({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const fetchTodos = async () => {
        try {
            const response = await axios.get('https://demoapi.uhrlbd.com/public/api/todos');
            setTodos(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch todos.');
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) {
            Alert.alert('Validation', 'Please enter a todo title.');
            return;
        }
        try {
            await axios.post('https://demoapi.uhrlbd.com/public/api/todos', { title: newTodo });
            setNewTodo('');
            fetchTodos();
        } catch (error) {
            Alert.alert('Error', 'Failed to add todo.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`https://demoapi.uhrlbd.com/public/api/todos/${id}`);
            fetchTodos();
        } catch (error) {
            Alert.alert('Error', 'Failed to delete todo.');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => navigation.replace('Login') }
            ]
        );
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Todo App</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Your Todos</Text>

            <TextInput
                placeholder="Add a new todo"
                value={newTodo}
                onChangeText={setNewTodo}
                style={styles.input}
            />
            <TouchableOpacity onPress={addTodo} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add Todo</Text>
            </TouchableOpacity>

            <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text style={styles.todoText}>{item.title}</Text>
                        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        padding: 8,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 5,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    todoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    todoText: {
        fontSize: 16,
        color: '#333',
    },
    deleteText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
});
