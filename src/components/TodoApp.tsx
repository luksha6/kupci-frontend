import React, { useState } from 'react';
import type { Todo } from '../models/Todo';
import TodoItem from './TodoItem';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [nextId, setNextId] = useState(1);

  const addTodo = () => {
    const title = inputValue.trim();
    if (!title) return;
    setTodos([...todos, { id: nextId, title, completed: false }]);
    setNextId(nextId + 1);
    setInputValue('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') addTodo();
  };

  const remaining = todos.filter(t => !t.completed).length;

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <div className="todo-input-row">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
      </div>

      {todos.length > 0 && (
        <p className="todo-summary">
          {remaining} of {todos.length} task{todos.length !== 1 ? 's' : ''} remaining
        </p>
      )}

      <ul className="todo-list">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-message">No tasks yet. Add one above!</p>
      )}
    </div>
  );
};

export default TodoApp;
