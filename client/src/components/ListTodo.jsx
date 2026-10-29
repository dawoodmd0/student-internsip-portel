import PropTypes from 'prop-types';

const ListTodo = ({ todos, deleteTodo }) => {
    return (
        <ul className="todo-list">
            {todos && todos.length > 0 ? (
                todos.map((todo) => {
                    return (
                        <li key={todo._id} className="todo-item">
                            <span className="todo-text">{todo.action}</span>
                            <button
                                className="delete-btn"
                                onClick={() => deleteTodo(todo._id)}
                                aria-label="Delete todo"
                            >
                                Delete
                            </button>
                        </li>
                    );
                })
            ) : (
                <li className="empty-state">No todos left! You&apos;re all caught up.</li>
            )}
        </ul>
    );
};

ListTodo.propTypes = {
    todos: PropTypes.array.isRequired,
    deleteTodo: PropTypes.func.isRequired
};

export default ListTodo;