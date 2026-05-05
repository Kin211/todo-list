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

    get name(){
        return this.name;
    }

    get completed(){
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
            return createElement("li", {}, [
                createElement("input", {type: "checkbox"},
                    null,
                    {
                        change: () => {
                            item.toggleCompleted();
                            this.update();
                        }
                    }),
                createElement("label", {style: labelStyle}, item.name),
                createElement("button", {}, "🗑️"),
            ]);
        });
        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            createElement("div", {class: "add-todo"}, [
                createElement("input", {
                    id: "new-todo",
                    type: "text",
                    placeholder: "Задание",
                    value : this.state.newTaskInput,
                }, null, {
                    input: this.onAddInputChange.bind(this)
                }),
                createElement("button", {id: "add-btn"}, "+", {
                    click: this.onAddTask.bind(this)
                },
                ),
            ]), createElement("ul", {id : "todos"}, renderedTasks) 
        ])
    }    
}

document.addEventListener("DOMContentLoaded", () => {
    const todoList = new TodoList();
    const domNode = todoList.getDomNode();
    document.body.appendChild(domNode);
});
