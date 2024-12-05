import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function TodoScreen() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const fetchTodos = async () => {
        const response = await axios.get('https://demoapi.uhrlbd.com/public/api/todos');
        setTodos(response.data);
    };

    const addTodo = async () => {
        await axios.post('https://demoapi.uhrlbd.com/public/api/todos', { title: newTodo });
        setNewTodo('');
        fetchTodos();
    };

    const deleteTodo = async (id) => {
        await axios.delete(`https://demoapi.uhrlbd.com/public/api/todos/${id}`);
        fetchTodos();
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <View className="p-4">
            <Text className="text-2xl font-bold mb-4">Your Todos</Text>
            <TextInput
                placeholder="Add a new todo"
                value={newTodo}
                onChangeText={setNewTodo}
                className="border p-2 mb-4 rounded"
            />
            <Button title="Add Todo" onPress={addTodo} />
            <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between p-2 border-b">
                        <Text>{item.title}</Text>
                        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                            <Text className="text-red-500">Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}
