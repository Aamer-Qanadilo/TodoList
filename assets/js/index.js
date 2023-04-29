// text fields

const inputTask = document.getElementById("task");
const inputAssignee = document.getElementById("assignee");
const todoListForm = document.getElementById("todoListForm");
const inputFields = document.querySelectorAll("#todoListForm input");

// buttons
const addTaskBtn = document.getElementById("addTask");

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

// function updateLocalStorage() {
//   localStorage.setItem("specialProducts", JSON.stringify(products));
// }

todoListForm.addEventListener("keyup", (event) => {
  if (event.target.tagName !== "INPUT") return;

  checkInput(event.target);
});

function checkInput(input) {
  console.log(input);
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

addTaskBtn.onclick = function () {
  checkAllInputs();

  if (inputsError.length !== 0) return;
};
