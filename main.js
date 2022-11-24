const baseUrl = 'https://localhost:44316/api';
const taskInputField = document.querySelector('.taskInputField');
var allTasks; // this will contain all tasks after

let startPoint = 0; // for .skip().take() in C#
const amountOfTasks = 10;
var selected = []; // for multiple selection

//gets the entire task list from the API
function getAllTasks() {
    fetch(`${baseUrl}/TableTasksList`, {
        method: 'GET',
        mode: 'cors'
    })
        .then(function (response) {
            console.log(response);
            if (response.ok) {
                return response.json();
            } else {
                throw 'error while getting all tasks!';
            }
        })
        .then(function (array) {
            console.log(array);
            allTasks = array;
            mainRenderFunction(array.slice(startPoint, amountOfTasks));//calls the mainRenderFunction to start rendering the page
        })
        .catch(function (error) {
            console.log(error);
        })
}
getAllTasks();//on page start, this will get all tasks, but only print the first page(10 elements)

//this function gets a specified amount of tasks from a specified point, so it doesn't have to load the entire list every time you make a change.
function getTasks() {
    fetch(`${baseUrl}/TableTasksList/from=${startPoint}&take=${amountOfTasks}`, {
        method: 'GET',
        mode: 'cors'
    })
    .then(function (response) {
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            throw 'error while getting 10 tasks!';
        }
    })
    .then(function (array) {
        console.log(array);
        var fetchedData = array;
        mainRenderFunction(array);// every time we get tasks, we call the render function to refresh
    })
    .catch(function (error) {
        console.log(error);
    })
}

// selects 2 items in the pop up window - text area and checkbox
const taskInputFieldEdit = document.querySelector('#taskInputFieldEdit');
const isCompletedCheckbox = document.querySelector('#isCompletedCheckbox');

// sets checkbox in edit window to a falsy or truthy value, depending on it being clicked
isCompletedCheckbox.value = "";
isCompletedCheckbox.addEventListener('click', function(){
    if(isCompletedCheckbox.value == ""){
        isCompletedCheckbox.value = "true";
    } else {
        isCompletedCheckbox.value = "";
    }
});

function mainRenderFunction(dataArray){
    const taskList = document.querySelector('.taskList');
    taskList.innerHTML = '';
    //const cardColumns = document.querySelector('.card-columns');
    dataArray.forEach((element,index) => {
        //rootDiv is the parent of all the elements in 1 row
        const rootDiv = document.createElement('div');
        taskList.appendChild(rootDiv);
        rootDiv.id = index; // setting a HTML id property. These numbered IDs in HTML are not used for anything, even though I made them here
        rootDiv.classList = "row py-1 border-bottom";

        //a list counter, it does not correspond to ID in the database, it's just for show in this app, to see how many tasks you have.
        const listNumber = document.createElement('div');
        listNumber.textContent = index+1+startPoint;
        rootDiv.appendChild(listNumber);
        listNumber.classList = "col-1";
        listNumber.style.textAlign = "center";

        // checkbox for selecting items for multiple deletion/completion/uncompletion
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = false;
        checkbox.classList = "form-check mt-0 col-1";
        rootDiv.appendChild(checkbox);
        checkbox.addEventListener("click", function(){
            selectTask(element.id);
        })

        //task text is here
        const task = document.createElement('div');
        task.textContent = element.task;
        rootDiv.appendChild(task);
        task.classList = "col-2";

        // checkbox that shows if the task is completed or not. It cannot be clicked! Edit using buttons!
        const itemCheckbox = document.createElement('input');
        itemCheckbox.type = "checkbox";
        itemCheckbox.checked = element.isCompleted;
        itemCheckbox.classList = "form-check mt-0 col-1";
        itemCheckbox.disabled = true;
        rootDiv.appendChild(itemCheckbox);

        //truncating time because it should not matter much, it looks better and shorter
        var dateWithoutTime = new Date(element.entryDate).toDateString();
        //creating the date element on the page
        const entryDate = document.createElement('div');
        entryDate.textContent = dateWithoutTime;
        rootDiv.appendChild(entryDate);
        entryDate.classList = "col-2";

        //delete button creation and minimal css
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "delete";
        deleteBtn.style.backgroundColor = "red";
        deleteBtn.style.color = "white";
        rootDiv.appendChild(deleteBtn);
        deleteBtn.classList = "col-1 btn btn-danger";

        //Are you sure you want to delete? prompt
        deleteBtn.addEventListener("click", function(){
            if (confirm("Are you sure you want to delete? Press OK to proceed.") == true) {
                deleteTask(element.id);
                alert("task deleted successfully");//task failed successfully
                setTimeout(getTasks(), 500);
            } else {
                alert("deletion cancelled.");
            }
        })

        //complete(checked) button creation and minimal css
        const checkedBtn = document.createElement('button');
        checkedBtn.textContent = "complete";
        checkedBtn.style.backgroundColor = "green";
        checkedBtn.style.color = "white";
        rootDiv.appendChild(checkedBtn);
        checkedBtn.classList = "col-2 btn";

        checkedBtn.addEventListener("click", function(){
            checkTask(element.id);
        });

        //creates the button for duplication/copy of items
        const dupeBtn = document.createElement('button');
        dupeBtn.textContent = "copy";
        rootDiv.appendChild(dupeBtn);
        dupeBtn.classList = "col-1 btn btn-secondary";
        
        dupeBtn.addEventListener("click", function(){
            dupeTask(element.id);
        });

        // creates the edit button and gives it the functionality to open an Edit window/modal.
        const editBtn = document.createElement('button');
        editBtn.textContent = "edit";
        rootDiv.appendChild(editBtn);
        editBtn.classList = "col-1 btn btn-secondary";
        editBtn.setAttribute("data-bs-toggle", "modal");
        editBtn.setAttribute("data-bs-target", "#openEditModal");
        editBtn.addEventListener("click", function(){
            editTaskWindow(element.id, element.task, element.isCompleted);
        });

        //doing strikethrough(line-through) on finished tasks and swapping the "check" for the "uncheck" button:
        if(element.isCompleted == true){
            rootDiv.textDecoration = "line-through";
            task.style.textDecoration = "line-through";
            entryDate.style.textDecoration = "line-through";
            checkedBtn.textContent = "uncomplete";
            checkedBtn.style.backgroundColor = "purple";
        }

        //hides the previous page button on first page
        if(amountOfTasks>startPoint){
            previousPageBtn.style.visibility = "hidden";
        } else{
            previousPageBtn.style.visibility = "visible";
        }
        //hides the next page button on last page
        if(dataArray.length<10 || allTasks.length<=startPoint+10){
            nextPageBtn.style.visibility = "hidden";
        } else{
            nextPageBtn.style.visibility = "visible";
        }

        // empties the array of selected items
        selected = [];
    });
}

//previous and next page buttons:
const nextPageBtn = document.getElementById('nextPageBtn');
nextPageBtn.addEventListener("click", function(){
    startPoint += amountOfTasks;
    getTasks();
})
const previousPageBtn = document.getElementById('previousPageBtn');
previousPageBtn.addEventListener("click", function(){
    startPoint -= amountOfTasks;
    getTasks();
})

// puts all selected items into an array, so we can delete or edit many at once.
function selectTask(id){
    if(selected.includes(id)){
        selected.pop(id);
    } else {
        selected.push(id);
    }
}

//multiple items - deletion, check and uncheck button functions:
const multipleDeleteBtn = document.getElementById('multipleDeleteBtn');
multipleDeleteBtn.addEventListener("click", function(){
    if (confirm("Are you sure you want to delete ALL SELECTED ITEMS? Press OK to proceed.") == true) {
        for(i=0; i<selected.length; i++){
            deleteTask(selected[i]);
            }
            alert("multiple tasks deleted successfully!");
            setTimeout(getTasks(), 500);
        } else {
            alert("deletion cancelled.");
        }
})

const multipleCheckBtn = document.getElementById('multipleCheckBtn');
multipleCheckBtn.addEventListener("click", function(){
    for(i=0; i<selected.length; i++){
        checkUncheckExplicit(selected[i], true);
    }
})
// one button flips multiple tasks "isCompleted" to true and the other to false.
const multipleUncheckBtn = document.getElementById('multipleUncheckBtn');
multipleUncheckBtn.addEventListener("click", function(){
    for(i=0; i<selected.length; i++){
        checkUncheckExplicit(selected[i], false);
    }
})

var currentTaskId;
//this function opens the "edit task" window and fills the necessary information that already exists about this item.
function editTaskWindow(id, taskText, isCompleted){
    taskInputFieldEdit.value = taskText;
    currentTaskId = id;
    isCompletedCheckbox.checked = isCompleted;
    //this is for making sure the checkboxes contain useful value in their attribute "" = false, "true" = true
    if(isCompleted){
        isCompletedCheckbox.value = "true";
    }
    else {
        isCompletedCheckbox.value = "";
    }
}
const finishEditBtn = document.querySelector('#finishEditBtn');
finishEditBtn.addEventListener("click", function(){
    editTask(currentTaskId, !!(isCompletedCheckbox.value), taskInputFieldEdit.value);
})


const createTaskWindowBtn = document.querySelector('#createTaskWindowBtn');

const isCompletedCreateCheckbox = document.querySelector('#isCompletedCreateCheckbox')
// sets checkbox inside the create window to a falsy or truthy value, depending on it being clicked
isCompletedCreateCheckbox.value = "";
isCompletedCreateCheckbox.addEventListener('click', function(){
    if(isCompletedCreateCheckbox.value == ""){
        isCompletedCreateCheckbox.value = "true";
    } else {
        isCompletedCreateCheckbox.value = "";
    }
});

const taskInputFieldCreate = document.querySelector('#taskInputFieldCreate');
const finishCreateBtn = document.querySelector('#finishCreateBtn');
finishCreateBtn.addEventListener("click", function(){
    createTask();
})