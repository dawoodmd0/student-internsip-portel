import { useEffect, useState } from 'react';
import ListTodo from './ListTodo';
import Input from './Input';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getTodos = () => {
        fetch('/api/todos')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load todos (HTTP ${response.status})`);
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setTodos(data);
                }
                setError(null);
            })
            .catch((err) => {
                console.error('Error fetching todos:', err);
                setError(err.message || 'Unable to connect to server');
            })
            .finally(() => setLoading(false));
    };

    const deleteTodo = (id) => {
        fetch(`/api/todos/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to delete todo (HTTP ${response.status})`);
                }
                return response.json();
            })
            .then(() => {
                getTodos();
            })
            .catch((err) => {
                console.error('Error deleting todo:', err);
                setError(err.message || 'Unable to delete todo');
            });
    };

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="todo-container">
            <header className="todo-header">
                <h1>Task Flow</h1>
                <p className="todo-subtitle">Stay organized and accomplish more every day</p>
            </header>

            {error && (
                <div className="alert-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={getTodos}>Retry</button>
                </div>
            )}

            <Input getTodos={getTodos} />

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your tasks...</p>
                </div>
            ) : (
                <ListTodo todos={todos} deleteTodo={deleteTodo} />
            )}
        </div>
    );
};

export default Todo;