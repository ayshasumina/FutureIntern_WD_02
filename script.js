const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const pendingTodoListUL = document.getElementById('pending-todo-list');
const completedTodoListUL = document.getElementById('completed-todo-list');

let allTodos = getTodos();
updateTodoLists();

todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    const timestamp = new Date().toLocaleString();
    
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
            createdAt: timestamp,
            completedAt: null
        };
        allTodos.push(todoObject);
        updateTodoLists();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoLists() {
    pendingTodoListUL.innerHTML = "";
    completedTodoListUL.innerHTML = "";

    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        if (todo.completed) {
            completedTodoListUL.append(todoItem);
        } else {
            pendingTodoListUL.append(todoItem);
        }
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    const timestamp = todo.completed ? todo.completedAt : todo.createdAt;
    
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">${todoText}</label>
        <span class="timestamp">(${timestamp})</span>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;

    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked;
        if (checkbox.checked) {
            allTodos[todoIndex].completedAt = new Date().toLocaleString();
        } else {
            allTodos[todoIndex].completedAt = null;
        }
        saveTodos();
        updateTodoLists();
    });
    
    checkbox.checked = todo.completed;
    return todoLI;
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoLists();
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos() {
    localStorage.removeItem("todos");  // Clears the localStorage every time the page is refreshed
    return [];  // Return an empty array so the todo list starts fresh
}


