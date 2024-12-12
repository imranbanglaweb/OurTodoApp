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
    Button,
    Platform ,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DateTimePicker from '@react-native-community/datetimepicker';
export default function TodoScreen({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
  

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
  
    const onChange = (event, selectedDate) => {
        if (event.type === 'set') {
          setDate(selectedDate || date);
        }
        if (Platform.OS === 'android') {
          setShow(false);  // Hide the picker on Android
        }
      };


    const fetchTodos = async () => {
        setLoading(true);
        
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get('https://demoapi.uhrlbd.com/public/api/todos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.data && Array.isArray(response.data)) {
                setTodos(response.data); 
            } else {
                setTodos([]); 
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch todos.');
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) {
            Toast.show({
              type: 'error',
              text1: 'Validation',
              text2: 'Please enter a todo title.',
              onHide: () => Toast.hide(),  // Corrected
            });
            return;
          }
        // if (!todoDate.trim() || !todoTime.trim()) {
        //     Alert.alert('Validation', 'Please select a date and time.');
        //     return;
        // }
        try {

            const newTodoData = {
                title: newTodo,
                date: date.toISOString(), // Correct Date Formatting
            };
            await axios.post('https://demoapi.uhrlbd.com/public/api/todos', newTodoData);
            setNewTodo('');
            setDate(new Date()); // Reset Date
            fetchTodos();
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Todo added successfully!',
                position: 'bottom',
                onHide: () => Toast.hide(),  // Corrected
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to add todo!',
                position: 'bottom',
                onHide: () => Toast.hide(),  // Corrected
            });
        }
    };
    const toggleCompleteTodo = async (id, completed) => {
        const completedAt = !completed ? new Date().toISOString() : null;
    
        try {
            await axios.put(`https://demoapi.uhrlbd.com/public/api/todos/${id}`, {
                completed: !completed,
                completedAt,
            });
            fetchTodos();
            Toast.show({
                type: 'success',
                text1: 'Task Updated',
                text2: 'Task completion status updated!',
                onHide: () => Toast.hide(),  // Corrected
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to update task status.');
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
                onHide: () => Toast.hide(),  // Corrected
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
            // <TouchableOpacity onPress={() => deleteTodo(item.id)}>
            //     <Icon name="delete" size={24} color="#e74c3c" />
            // </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Todo App</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Icon name="log-out-outline" size={16} color="#fff" style={styles.buttonIcon} />
                    {/* <Text style={styles.logoutText}>Logout</Text> */}
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Your Todos</Text>

            <TextInput
                placeholder="Add a new todo"
                value={newTodo}
                onChangeText={setNewTodo}
                style={styles.input}
            />
            <Button onPress={() => setShow(true)} title="Select Date & Time" />
      <Text>Selected Date: {date.toLocaleString()}</Text>
      
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          is24Hour={true}
          onChange={onChange}
        />
      )}
           <TouchableOpacity onPress={addTodo} style={styles.addButton}>
    <Icon name="add-circle" size={25} color="#fff" style={styles.buttonIcon} />
    {/* <Text style={styles.addButtonText}>Add Todo</Text> */}
</TouchableOpacity>


            {loading ? (
                <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                ListHeaderComponent={() => (
                    <View style={styles.headerRow}>
                        <Text style={styles.headerColumn}>Title</Text>
                        <Text style={styles.headerColumn}>Date Time</Text>
                        <Text style={styles.headerColumn}>Status</Text>
                    </View>
                )}
                data={todos}
                keyExtractor={(item) => item.id.toString()} // Ensure keys are unique
                renderItem={({ item }) => (
                    <View style={styles.todoItem}>
                        <Text style={styles.todoText}>{item.title}</Text>
    {/* <Text style={styles.todoColumn}>
                {item.created_at
                    ? new Date(item.updated_at).toLocaleString()
                    : 'Not Completed'}
            </Text> */}
            <Text style={styles.todoColumn}>
    {item.updated_at
        ? new Date(item.updated_at).toLocaleString('en-US', {
            //   weekday: 'long', // e.g., Monday
              year: 'numeric', // e.g., 2024
            //   month: 'long', // e.g., November
              day: 'numeric', // e.g., 26
              hour: '2-digit', // e.g., 08
              minute: '2-digit', // e.g., 45
              hour12: true, // AM/PM format
          })
        : 'No Date'}
</Text>
            <TouchableOpacity
                onPress={() => toggleCompleteTodo(item.id, item.completed)}
                style={[
                    styles.statusButton,
                    item.completed
                        ? styles.completedButton
                        : styles.incompleteButton,
                ]}
            >
                <Text style={styles.statusButtonText}>
                    {/* {item.completed ? 'Done' : 'Pending'} */}
                    <Icon
                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color="#fff"
            />
                </Text>
            </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity> */}
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
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#3498db',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#e74c3c',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteText: {
        color: '#e74c3c',
        fontWeight: '600',
        marginLeft: 8,
    },
    logoutText: {
        color: '#fff',
        fontWeight: '600',
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ddd',
    },
    headerRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerColumn: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    todoRow: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    todoColumn: {
        flex: 1,
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    statusButton: {
        padding: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: '#27ae60',
    },
    incompleteButton: {
        backgroundColor: '#e74c3c',
    },
    statusButtonText: {
        color: '#fff',
        fontWeight: '300',
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: '#555',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
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
