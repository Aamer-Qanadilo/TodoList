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

let updateTaskField = null;
let updateTaskCard;
let tasks = [];
// const filters = { All: "" };

// Start Implementing Functionalities

const updateLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
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

document.addEventListener("click", (event) => {
  const { tagName } = event.target;

  if (updateTaskField) {
    if (tagName !== "INPUT") {
      const updateTaskInput = updateTaskCard.querySelector("input");
      updateTaskField.innerText = updateTaskInput.value;
      updateTaskInput.replaceWith(updateTaskField);

      const index = updateTaskCard.ariaRowIndex;
      const { ariaLabel } = updateTaskField;

      tasks[index][ariaLabel] = updateTaskInput.value;
      updateLocalStorage();

      updateTaskField = null;
    }
  }
});

todoListForm.addEventListener("keyup", (event) => {
  if (event.target.tagName !== "INPUT") return;

  checkInput(event.target);
});

TodoListContainer.addEventListener("click", (event) => {
  const { tagName } = event.target;
  const taskCard = event.target.closest(".taskCard");

  if (tagName === "I") {
    const { ariaLabel } = event.target;

    if (ariaLabel == "Delete task") {
      deleteTask(taskCard);
    } else if (ariaLabel == "Toggle Task Completed") {
      toggleDone(taskCard);
    }
  } else if (tagName === "P") {
    if (!updateTaskField) {
      const { innerText } = event.target;
      const inputField = document.createElement(`input`);
      inputField.type = "text";
      inputField.classList.add("mb-2");
      inputField.value = innerText;

      // This will save a reference to the replaced Node's Card
      updateTaskCard = taskCard;

      // This will save a reference to the replaced Node
      updateTaskField = event.target.cloneNode(true);

      event.target.replaceWith(inputField);

      event.stopPropagation();
    }
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
      const alertParagraph = document.createElement(`p`);
      const alertParagraphText = document.createTextNode(
        inputsErrorMessage[id],
      );

      alertParagraph.appendChild(alertParagraphText);
      alertParagraph.classList.add("alert", "alert-danger", "full-width");

      input.parentElement.appendChild(alertParagraph);
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
  inputFields.forEach((input) => {
    let { id, value } = input;
    if (!inputsRegex[id].exec(value)) {
      addTaskBtn.setAttribute("disabled", "true");
      inputsError.push(inputsErrorMessage[id]);
      checkInput(input);
      return;
    }
  });

  inputsError = [];
  addTaskBtn.removeAttribute("disabled");
}

function clearForm() {
  inputFields.forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid");
    input.classList.remove("is-invalid");
    if (input.parentElement.childElementCount == 3) {
      //This next lines is used to remove the paragraph with the error message
      input.parentElement.removeChild(input.parentElement.children[2]);
    }
  });

  addTaskBtn.setAttribute("disabled", "true");
}

const addTask = () => {
  const task = { completed: false };
  inputFields.forEach((input, index) => {
    let { id, value } = input;
    task[id] = value;
  });
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
      displayTasks();

      Swal.fire("Deleted!", "Task has been deleted.", "success");
    }
  });
};

const toggleDone = (taskCardNode) => {
  const index = taskCardNode.ariaRowIndex;
  tasks[index].completed = !tasks[index].completed;
  updateLocalStorage();
  displayTasks();
};

const displayTasks = () => {
  let tasksCardsTemplate = "";

  tasks.forEach((task, index) => {
    tasksCardsTemplate += `
        <div class="taskCard ${
          task.completed ? "completed" : ""
        }" aria-rowindex="${index}">
          <div class="taskCardContent">
            <p class="${
              task.completed ? "text-decoration-line-through" : ""
            }" aria-label="task">${task.task}</p>
            <p class="${
              task.completed ? "text-decoration-line-through" : ""
            }" aria-label="assignee">${task.assignee}</p>
          </div>
          <div class="taskCardButtons">
            <i
              class="fa-solid fa-trash"
              style="color: #FF1E00"
              aria-label="Delete task"
            ></i>
            <i 
                class='${
                  task.completed
                    ? "fa-solid fa-circle-xmark"
                    : "fa-solid fa-circle-check"
                }'
                style='${task.completed ? "color: #FF1E00" : "color: #207e44"}'
                aria-label="Toggle Task Completed"
            ></i>
          </div>
        </div>`;
  });

  TodoListContainer.innerHTML = tasksCardsTemplate;
};

addTaskBtn.onclick = function (event) {
  event.preventDefault();
  checkAllInputs();

  if (inputsError.length !== 0) return;

  // Here I add the new task to the list and then clear the form

  addTask();
  updateLocalStorage();
  displayTasks();
  clearForm();
};
