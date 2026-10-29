import PropTypes from 'prop-types';
import { useState } from 'react';

const Input = ({ getTodos }) => {
    const [action, setAction] = useState('');

    const addTodo = (e) => {
        if (e) e.preventDefault();
        const trimmed = action.trim();
        if (!trimmed) return;

        fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: trimmed }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data && !data.error) {
                    getTodos();
                    setAction('');
                }
            })
            .catch((error) => console.error('Error:', error));
    };

    const handleChange = (e) => {
        setAction(e.target.value);
    };

    return (
        <form onSubmit={addTodo} className="input-container">
            <input
                type="text"
                placeholder="What needs to be done?"
                onChange={handleChange}
                value={action}
            />
            <button type="submit">Add Task</button>
        </form>
    );
};

Input.propTypes = {
    getTodos: PropTypes.func.isRequired,
};

export default Input;