import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TodoScreen({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://demoapi.uhrlbd.com/public/api/todos');
            console.log("Todos State:", todos);

            // Ensure data is correctly set
                if (response.data && Array.isArray(response.data)) {
                    setTodos(response.data); 
                } else {
                    setTodos([]); // Clear list if unexpected response
                }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch todos.');
        } finally {
            setLoading(false);
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

            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Todo added successfully!',
                position: 'bottom',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add todo!',
                position: 'bottom',
            });
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`https://demoapi.uhrlbd.com/public/api/todos/${id}`);
            fetchTodos();
            Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Todo deleted successfully!',
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to delete todo.');
        }
    };

    const handleLogout = () => {
        Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => navigation.replace('Login') },
        ]);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchTodos();
        setRefreshing(false);
    };

    const renderTodo = ({ item }) => (
        <View style={styles.todoItem}>
            <View style={styles.todoTextContainer}>
                <Icon name="check-circle" size={24} color="#27ae60" />
                <Text style={styles.todoText}>{item.title}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Icon name="delete" size={24} color="#e74c3c" />
            </TouchableOpacity>
        </View>
    );

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

            {loading ? (
                <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()} // Ensure keys are unique
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text style={styles.todoText}>{item.title}</Text>
                        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>No todos available.</Text>
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            
            )}

            <Toast />
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
        fontSize: 28,
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
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 8,
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
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    todoTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    deleteText: {
        color: '#e74c3c',
        fontWeight: '600',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: '#555',
    },
});
