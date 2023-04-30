// text fields

const inputTask = document.getElementById("task");
const inputAssignee = document.getElementById("assignee");
const todoListForm = document.getElementById("todoListForm");
const inputFields = document.querySelectorAll("#todoListForm input");
const TodoListContainer = document.querySelector(".TodoListContainer");

// buttons
const addTaskBtn = document.getElementById("addTask");

// Arrays for validations

const inputsRegex = {
  task: /^[A-Za-z 0-9]{3,32}$/,
  assignee: /^[A-Z][A-Za-z 0-9]{2,20}$/,
};

const inputsErrorMessage = {
  task: "Task should start with a capital letter & with a length of 3-25",
  assignee:
    "Assignee should start with a capital letter & with a length of 3-25",
};

let inputsError = [];

// Decelerations for the application

let tasks = [];
// const filters = { All: "" };

// Start Implementing Functionalities

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
};

const fetchLocalStorage = () => {
  const LocalTasks = JSON.parse(localStorage.getItem("tasks"));
  if (LocalTasks) tasks = LocalTasks;

  displayTasks();
};

window.addEventListener("load", () => {
  fetchLocalStorage();
  console.log(tasks);
});

todoListForm.addEventListener("keyup", (event) => {
  if (event.target.tagName !== "INPUT") return;

  checkInput(event.target);
});

TodoListContainer.addEventListener("click", (event) => {
  if (event.target.tagName !== "I") return;

  const taskCard = event.target.closest(".taskCard");
  const { ariaLabel } = event.target;

  if (ariaLabel == "Delete task") {
    deleteTask(taskCard);
  } else if (ariaLabel == "Toggle Task Completed") {
    toggleDone(taskCard);
  }
});

function checkInput(input) {
  const { id, value } = input;

  if (!inputsRegex[id].exec(value)) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");

    addTaskBtn.setAttribute("disabled", "true");

    //These next lines is used to add a paragraph with the error message
    if (input.parentElement.childElementCount < 3) {
      const para = document.createElement(`p`);
      const node = document.createTextNode(inputsErrorMessage[id]);

      para.appendChild(node);
      para.classList.add("alert", "alert-danger", "w-100");

      input.parentElement.appendChild(para);
    }
  } else {
    checkAllInputs();
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (input.parentElement.childElementCount == 3) {
      //This next lines is used to remove the paragraph with the error message
      input.parentElement.removeChild(input.parentElement.children[2]);
    }
  }
}

function checkAllInputs() {
  for (let i = 0; i < inputFields.length; i++) {
    let { id, value } = inputFields[i];
    if (!inputsRegex[id].exec(value)) {
      addTaskBtn.setAttribute("disabled", "true");
      inputsError.push(inputsErrorMessage[id]);
      checkInput(inputFields[i]);
      return;
    }
  }
  inputsError = [];
  addTaskBtn.removeAttribute("disabled");
}

function clearForm() {
  for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].value = "";
    inputFields[i].classList.remove("is-valid");
    inputFields[i].classList.remove("is-invalid");
    if (inputFields[i].parentElement.childElementCount == 3) {
      //This next lines is used to remove the paragraph with the error message
      inputFields[i].parentElement.removeChild(
        inputFields[i].parentElement.children[2],
      );
    }
  }

  addTaskBtn.setAttribute("disabled", "true");
}

const addTask = () => {
  const task = { completed: false };
  for (let i = 0; i < inputFields.length; i++) {
    let { id, value } = inputFields[i];
    task[id] = value;
  }
  tasks.push(task);
};

const deleteTask = (taskCardNode) => {
  const parentNode = taskCardNode.parentElement;
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Delete!",
  }).then((result) => {
    if (result.isConfirmed) {
      const index = taskCardNode.ariaRowIndex;
      parentNode.removeChild(taskCardNode);
      tasks.splice(index, 1);

      updateLocalStorage();

      Swal.fire("Deleted!", "Your file has been deleted.", "success");
    }
  });
};

const toggleDone = (taskCardNode) => {
  const index = taskCardNode.ariaRowIndex;
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
};

const displayTasks = () => {
  let tasksCards = "";

  for (let i = 0; i < tasks.length; i++) {
    tasksCards += `
        <div class="taskCard" aria-rowindex="${i}">
          <div class="taskCardContent">
            <p class="${
              tasks[i].completed
                ? "opacity-50 text-decoration-line-through"
                : ""
            }">${tasks[i].task}</p>
            <p class="${
              tasks[i].completed
                ? "opacity-50 text-decoration-line-through"
                : ""
            }">${tasks[i].assignee}</p>
          </div>
          <div class="taskCardButtons">
            <i
              class="fa-solid fa-trash"
              style="color: #df0c0c"
              aria-label="Delete task"
            ></i>
            <i 
                class='${
                  tasks[i].completed
                    ? "fa-solid fa-circle-xmark"
                    : "fa-solid fa-circle-check"
                }'
                style='${
                  tasks[i].completed ? "color: #df0c0c" : "color: #207e44"
                }'
                aria-label="Toggle Task Completed"
            ></i>
          </div>
        </div>`;
  }

  TodoListContainer.innerHTML = tasksCards;
};

addTaskBtn.onclick = function (event) {
  event.preventDefault();
  checkAllInputs();

  if (inputsError.length !== 0) return;

  // Here I add the new task to the list and then clear the form

  addTask();
  updateLocalStorage();
  clearForm();
};
