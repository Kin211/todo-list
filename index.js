function createElement(tag, attributes, children, callbacks = {}) {
    const element = document.createElement(tag);

    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }

    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === "string") {
        element.appendChild(document.createTextNode(children));
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }

    if (callbacks) {
        Object.keys(callbacks).forEach((eventName) => {
            element.addEventListener(eventName, callbacks[eventName]);
        })
    }

    return element;
}

class TodoItem {
    constructor(name) {
        this.name = name;
        this.completed = false;
    }

    get Name(){
        return this.name;
    }

    get Completed(){
        return this.completed;
    }

    toggleCompleted(){
        this.completed = !this.completed;
    }
}

class Component {
    constructor() {
    }

    getDomNode() {
        this._domNode = this.render();
        return this._domNode;
    }
}

class Task extends Component{
    constructor(item, onDelete, onToggle){
        super();
        this.item = item;
        this.onDelete = onDelete;
        this.onToggle = onToggle;
    }

    render(){
        const labelStyle = this.item.completed ? "color: gray;" : "";
        return createElement("li", {}, [
            createElement("input", 
                !this.item.completed ? {type: "checkbox"} : {type: "checkbox", checked: true},
                null,
                {
                    change: () => {
                        this.   onToggle(this.item);
                    }
                }),
            createElement("label", {style: labelStyle}, this.item.name),
            createElement("button", {}, "🗑️", {
                click: () => this.onDelete(this.item.name)
            }),
        ]);
    }
}

class AddTask extends Component {
    constructor(inputValue, onInputChange, onAddTask) {
        super();
        this.inputValue = inputValue;
        this.onInputChange = onInputChange;
        this.onAddTask = onAddTask;
    }

    render() {
        return createElement("div", {class: "add-todo"}, [
            createElement("input", {
                id: "new-todo",
                type: "text",
                placeholder: "Задание",
                value: this.inputValue
            }, null, {
                input: this.onInputChange
            }),
            createElement("button", {id: "add-btn"}, "+", {
                click: this.onAddTask
            }), 
        ]);
    }
}



class TodoList extends Component {
    constructor() {
        super();
        this.state = {
            tasks : [
                new TodoItem("Сделать домашку"),
                new TodoItem("Сделать практику"),
                new TodoItem("Пойти домой"),
            ],
            newTaskInput: "",
        };
    }

    update(){
        const newDom = this.render();
        this._domNode.replaceWith(newDom);
        this._domNode = newDom;
    }

    onAddTask(){
        if (this.state.newTaskInput.trim() !== ""){
            this.state.tasks.push(new TodoItem(this.state.newTaskInput));
            this.update();
        }
    }

    onAddInputChange(event){
        this.state.newTaskInput = event.target.value; 
    }

    onDeleteTask(elemName){
        this.state.tasks = this.state.tasks.filter(task => task.name !== elemName);
        this.update();
    }

    render() {
        const renderedTasks = this.state.tasks.map((item) => {
            const labelStyle = item.completed ? "color: gray;" : "";
            return new Task(
                item,
                (taskName) => this.onDeleteTask(taskName),
                (task) => {
                    task.toggleCompleted();
                    this.update();
                }
            ).getDomNode();
        });
        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            new AddTask(
                this.state.newTaskInput,
                (event) => this.onAddInputChange(event),
                () => this.onAddTask(),
            ).getDomNode(), createElement("ul", {id : "todos"}, renderedTasks) 
        ])
    }    
}

document.addEventListener("DOMContentLoaded", () => {
    const todoList = new TodoList();
    const domNode = todoList.getDomNode();
    document.body.appendChild(domNode);
});
