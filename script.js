class StorageManager {
  constructor(propertyKey) {
    this.propertyKey = propertyKey;
    this.itemsList = this.readDataFromStorage();
  }
  readDataFromStorage() {
    let list;
    if (localStorage.getItem(this.propertyKey)) {
      list = JSON.parse(localStorage.getItem(this.propertyKey));
    } else list = [];
    return list;
  }
  saveList(list) {
    localStorage.setItem(this.propertyKey, JSON.stringify(list));
  }
  addItemToList(title, priority) {
    let list = this.readDataFromStorage();
    list.push({
      id: new Date().getTime(),
      title,
      priority,
    });
    this.saveList(list);
  }
  removeItem(itemId) {
    let list = this.readDataFromStorage();
    let updatedList = list.filter((item) => item.id !== itemId);
    this.saveList(updatedList);
  }
}
class ToDoListManager {
  constructor(propertyKey) {
    this.storage = new StorageManager(propertyKey);
  }
  //========================================================
  createFormItem(title, placeholder, type, btnText) {
    let formItemContainer = document.createElement("div");
    formItemContainer.className = "form_item_container";
    let label = document.createElement("label");
    label.innerText = title;
    formItemContainer.append(label);
    let input = document.createElement("input");
    input.setAttribute("placeholder", placeholder);
    input.setAttribute("type", type);
    formItemContainer.append(input);

    return { formItemContainer, input };
  }
  //========================================================
  renderForm() {
    let formContainer = document.createElement("div");
    formContainer.className = "form_container";
    let { formItemContainer, input } = this.createFormItem(
      "Add Task",
      "Add Your Task",
      "text"
    );
    this.input = input;
    formContainer.append(formItemContainer);

    let { formItemContainer: formItemContainerPriority, input: inputPriority } =
      this.createFormItem("Task Priority", "Set Priority", "number");
    this.inputPriority = inputPriority;
    formContainer.append(formItemContainerPriority);

    let formButton = document.createElement("button");
    formButton.className = "button form_button";
    formButton.innerText = "Add";
    formButton.onclick = this.onAdd.bind(this);
    formContainer.append(formButton);

    return formContainer;
  }
  //========================================================
  onAdd() {
    this.storage.addItemToList(this.input.value, this.inputPriority.value);
    this.input.value = "";
    this.inputPriority.value = "";
    this.refresh();
  }
  //========================================================
  renderTaskItem({ id, title, priority }) {
    let taskContainer = document.createElement("div");
    taskContainer.className = "task_container";

    let taskTitle = document.createElement("span");
    taskTitle.className = "task_title";
    taskTitle.innerText = title;
    taskContainer.append(taskTitle);

    let taskPriority = document.createElement("span");
    taskPriority.className = "task_priority";
    taskPriority.innerText = priority;
    taskContainer.append(taskPriority);

    let deleteButton = document.createElement("button");
    deleteButton.className = "button delete_button";
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => this.onDelete(id);
    taskContainer.append(deleteButton);

    return taskContainer;
  }
  //========================================================
  onDelete(id) {
    this.storage.removeItem(id);
    this.refresh();
  }
  //========================================================
  renderList(tasksList) {
    let tasksContainer = document.createElement("div");
    tasksContainer.className = "tasks_list_container";
    for (const item of tasksList) {
      let task = this.renderTaskItem(item);
      tasksContainer.append(task);
    }
    return tasksContainer;
  }
  //========================================================

  refresh() {
    this.listContainer.remove();
    this.listContainer = this.renderList(this.storage.readDataFromStorage());
    this.globalContainer.append(this.listContainer);
  }
  //========================================================

  render() {
    let mainContainer = document.querySelector(".main_container");
    mainContainer.append(this.renderForm());
    this.listContainer = this.renderList(this.storage.readDataFromStorage());
    mainContainer.append(this.listContainer);
    this.globalContainer = mainContainer;
  }
}
// let storage = new StorageManager("tasks");
// storage.addItemToList("drink tee", 2);
let toDo = new ToDoListManager("tasks");
toDo.render();
