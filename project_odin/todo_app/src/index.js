import "./styles.css";
import { isAfter } from "date-fns";
import { isToday } from "date-fns";
import { parseISO } from "date-fns";

function createTask(title, description, dueDate, priority, notes){
    return {title, description, dueDate, priority, notes};
}

let projects = {"Standalone tasks":[]};

let uiManipulator = (()=>{

  // populates the left side menu with project names
  // also assigns click action to the bucket svg
  function appendProjectElement(name){
    let allProjectsContainer = document.querySelector(".projectsMenu");

    let oneProjectContainer = document.createElement("div");
    oneProjectContainer.classList.add("projectsOption");

    let projectSpan = document.createElement("span");
    projectSpan.innerText = name;
    oneProjectContainer.appendChild(projectSpan);
    oneProjectContainer.innerHTML += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;
    allProjectsContainer.prepend(oneProjectContainer);

    document.querySelector(".projectsHeader").after(oneProjectContainer);

    let deletionSvg = oneProjectContainer.querySelector("svg");

    deletionSvg.addEventListener("click", () => {
      oneProjectContainer.remove();
      delete projects[name];

      displayProjectsContainer();
    });
  }

  // add the form to a certain container
  function addForm(menuClass, formId){
    let formContainer = document.querySelector(menuClass);
    
    if (formId == "projectsForm") {
      formContainer.insertAdjacentHTML('beforeend', `
        <form action="" method="post" id="${formId}">
          <input type="text" name="name" placeholder="NAME">
          <div>
            <button type="submit">Add</button>
            <button type="button">Cancel</button>
          </div>
        </form>
      `);
      assignProjectsFormSubmitEvent();
      assignFormCloseEvent();
      return;
    }

    let htmlString = `<form action="" method="post" id="${formId}">
            <input type="text" placeholder="TITLE" name="title" required>
            <input type="text" placeholder="DESCRIPTION" name="description"required>
            <input type="date" placeholder="DUE DATE" name="dueDate" required>
            <fieldset>
                <legend>Priority</legend>
                <input type="radio" name="priority" value="1">
                <input type="radio" name="priority" value="2" checked>
                <input type="radio" name="priority" value="3">
            </fieldset>
            <textarea placeholder="NOTES" name="notes"></textarea>
            <select name="projectName" id="">`;

      Object.keys(projects).forEach(projectName => {
        
        if (projectName == "Standalone tasks"){
          htmlString += `<option value="${projectName}" selected>${projectName}</option>`;
        }
        else{
          htmlString += `<option value="${projectName}">${projectName}</option>`;
        }
      });
      
      htmlString += `</select>
            <div>
                <button type="submit">Add</button>
                <button>Cancel</button>
            </div>
        </form>`;

    formContainer.insertAdjacentHTML('beforeend', htmlString);

    assignTasksFormSubmitEvent();
    assignFormCloseEvent();
  }

  function assignFormCloseEvent(){
    let cancelButton = document.querySelector("button:nth-child(2)");
    cancelButton.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("form").remove();
    });
  }

  // assign the actions on the tasks form submit button
  function assignTasksFormSubmitEvent(){
    let tasksForm = document.querySelector("form#tasksForm");
    tasksForm.addEventListener("submit", (event)=> {
      event.preventDefault();
      const data = new FormData(tasksForm);

      let newTask = createTask(data.get("title"), data.get("description"), data.get("dueDate"),
            data.get("priority"), data.get("notes"));
  
      let assignedProject = data.get("projectName");

      projects[assignedProject].push(newTask);

      if (assignedProject == "Standalone tasks"){
        uiManipulator.displayStandaloneTasksContainer();
      }
      else{
        uiManipulator.displayProjectsContainer();
      }
    });
  }

  // assign actions on the projects form submit button
  function assignProjectsFormSubmitEvent(){
    let projectsForm = document.querySelector("form#projectsForm");
    projectsForm.addEventListener("submit", (event)=> {
      event.preventDefault();

      const data = new FormData(projectsForm);

      let newProjectName = data.get("name");

      if (projects[newProjectName] != null){
        alert(`Project ${newProjectName} already exists! Please try again.`);
        return;
      }

      projects[newProjectName] = [];

      uiManipulator.appendProjectElement(newProjectName);
      uiManipulator.displayProjectsContainer();
    });
  }

  function removeForm(formId){
    let form = document.querySelector("#"+formId);
    if (form){
      form.remove();
    }
  }

  // populates main content with project containers
  function displayProjectsContainer(){
    let mainContentContainer = document.querySelector(".maincontent");
    mainContentContainer.innerHTML = "";

    let projectsContainer = document.createElement("div");
    projectsContainer.className = "projectsContainer";

    if (Object.keys(projects).length == 1){
      projectsContainer.className = "emptyContainer";
      let messageSpan = document.createElement("span");
      messageSpan.innerText = "Nothing to show yet";

      projectsContainer.appendChild(messageSpan);
      mainContentContainer.appendChild(projectsContainer);
      return;
    }

    Object.keys(projects).forEach(projectName => {
      if (projectName == "Standalone tasks"){
        return;
      }
      addProjectCard(projectName, projectsContainer)
    });

    mainContentContainer.appendChild(projectsContainer);
  }

  // populates main content with todays tasks
  function displayTodayTasks(){
    let mainContentContainer = document.querySelector(".maincontent");
    mainContentContainer.innerHTML = "";

    Object.keys(projects).forEach(projectName => {

      let filterFunction = (taskDate) => {
        return isToday(parseISO(taskDate));
      };

      displayFilteredTasks(projects[projectName], mainContentContainer, projectName, filterFunction);
    });

    checkNothingTodisplay();
  }

  // populates main content with overdue tasks
  function displayOverdueTasks(){
    let mainContentContainer = document.querySelector(".maincontent");
    mainContentContainer.innerHTML = "";

    Object.keys(projects).forEach(projectName => {
      
      let filterFunction = (taskDate) => {
        return isAfter(new Date(), parseISO(taskDate)) && !isToday(parseISO(taskDate));
      };

      displayFilteredTasks(projects[projectName], mainContentContainer, projectName, filterFunction);
      
    });
    checkNothingTodisplay(); 
  }

  function checkNothingTodisplay(){
    let mainContentContainer = document.querySelector(".maincontent");

    if (mainContentContainer.innerHTML == ""){
      let projectsContainer = document.createElement("div");
      projectsContainer.className = "projectsContainer";

      projectsContainer.className = "emptyContainer";
      let messageSpan = document.createElement("span");
      messageSpan.innerText = "Nothing to show yet";

      projectsContainer.appendChild(messageSpan);
      mainContentContainer.appendChild(projectsContainer);
      }
  }

  function displayStandaloneTasksContainer(){
    let mainContentContainer = document.querySelector(".maincontent");
    mainContentContainer.innerHTML = "";

    let standaloneTasksContainer = document.createElement("div");
    standaloneTasksContainer.className = "standaloneTasksContainer";

    addProjectCard("Standalone tasks", standaloneTasksContainer)
    mainContentContainer.appendChild(standaloneTasksContainer);
  }

  function displayFilteredTasks(tasksArray, parentContainer, projectName, filterFunction, classNameSpan=null){
    tasksArray.forEach(task => {
      if (filterFunction(task.dueDate)){
        let taskPriority = task.priority === "2" ? "yellow" :
                      task.priority == "3" ? "red" : "green";

        let taskContainer = document.createElement("div");
        taskContainer.className = "taskContainer";
        taskContainer.style.borderLeft = `solid 5px ${taskPriority}`;

        ["title", "description", "notes", "dueDate"].forEach(key => {
          let value = task[key];
          if (value != ""){
            let infoSpan = document.createElement("span");
            infoSpan.innerText = value;
            taskContainer.appendChild(infoSpan);
          }
        });

        let garbageBinIcon = createIcon("M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z");
        let settingsIcon =  createIcon("M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z");
        
        garbageBinIcon.addEventListener("click", () =>{
          taskContainer.remove();
          projects[projectName] = projects[projectName].filter(deletedTask => deletedTask !== task);

          if (classNameSpan){
            classNameSpan.innerText = `${projectName} (${projects[projectName].length})`;
          }
          checkNothingTodisplay();
        });

        settingsIcon.addEventListener("click", () => {
          removeForm("tasksForm");

          let dialog = document.createElement("dialog");
          document.body.appendChild(dialog);
          dialog.showModal();

          addForm("dialog", "tasksForm");

          ["title", "description", "notes", "dueDate", "projectName", "priority"].forEach(key => {

            if (key == "priority"){
              let defaultPriorityElement = document.querySelector(`input[value='2']`);
              defaultPriorityElement.checked = false;

              let newPrioritySelection = document.querySelector(`input[value='${task.priority}']`);
              newPrioritySelection.checked = true;
              return;
            }

            if (key == "projectName"){
              let defaultProjectSelectionElement = document.querySelector(`select[name='projectName']`);
              
              defaultProjectSelectionElement.value = projectName;
              return;
            }

            let infoSpan = document.querySelector(`*[name='${key}']`);

            infoSpan.value = task[key];
          });

          let tasksForm = document.querySelector("form#tasksForm");
          tasksForm.addEventListener("submit", (event)=> {
            event.preventDefault();
            taskContainer.remove();
            
            projects[projectName] = projects[projectName].filter(deletedTask => deletedTask !== task);
            //assignTasksFormSubmitEvent();
            dialog.remove();
            
            if (projectName == "Standalone tasks"){
              displayStandaloneTasksContainer();
            }
            else{
              displayProjectsContainer();
            }
            
          });

          // remove dialog on cancel
          let cancelButton = document.querySelector("button:nth-child(2)");
          cancelButton.addEventListener("click", () => {
            event.preventDefault();
            dialog.remove();
          });

          console.log("CLASSNAME IS: ", parentContainer.className);

          if (classNameSpan){
            classNameSpan.innerText = `${projectName} (${projects[projectName].length})`;
          }
        });

        let controlsContainer = document.createElement("div");

        controlsContainer.appendChild(settingsIcon);
        controlsContainer.appendChild(garbageBinIcon);

        taskContainer.appendChild(controlsContainer);

        parentContainer.appendChild(taskContainer);
      }
    });
  }

  function createIcon(formula){
    let icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.style.width = "24px";
    icon.style.height = "24px";
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d",formula); 

    icon.appendChild(path);
    return icon;
  }

  // add project card to provided parent
  function addProjectCard(name, parent){
    let card = document.createElement("div");
    card.className = "projectCard";

    let classNameSpan = document.createElement("span");

    let projectName = name;
    let tasks = projects[projectName];

    classNameSpan.innerText = `${projectName} (${tasks.length})`;
    card.appendChild(classNameSpan);

    let filterFunction = (taskDate) => {
      return true;
    };

    displayFilteredTasks(projects[projectName],card, projectName, filterFunction, classNameSpan);
    
    parent.appendChild(card);
  }
  return {displayOverdueTasks, displayTodayTasks, appendProjectElement, addForm, removeForm, displayProjectsContainer, displayStandaloneTasksContainer};
})();

function setAddItemListener(spanClassName, formId, menuClass){
  let adderSpan =  document.querySelector("." + spanClassName);
  adderSpan.addEventListener("click", ()=>{
    let form = document.querySelector("#" + formId);

    let forms = document.querySelectorAll("form");
    
    forms.forEach(form=> {
        form.remove();
    });

    if (form == null){
      uiManipulator.addForm("." + menuClass, formId);
    }
  });
}

let tasksSpan = document.querySelector(".tasksHeader");
tasksSpan.addEventListener("click", () => {
  uiManipulator.displayStandaloneTasksContainer();
});

let projectsSpan = document.querySelector(".projectsHeader");
projectsSpan.addEventListener("click", () => {
  uiManipulator.displayProjectsContainer();
});

let todaySpan = document.querySelector(".tasksMenu div:nth-child(2)");
todaySpan.addEventListener("click", () => {
  uiManipulator.displayTodayTasks();
});

let overdueSpan = document.querySelector(".tasksMenu div:nth-child(3)");
overdueSpan.addEventListener("click", () => {
  uiManipulator.displayOverdueTasks();
});

let saveData = () => {
  localStorage.setItem("projectsData", JSON.stringify(projects));
};

let loadData = () => {
  if (localStorage.getItem("projectsData"))
      return JSON.parse(localStorage.getItem("projectsData"));
  else
    return {"Standalone tasks":[]};
};

window.onbeforeunload = () => {
  saveData();
};

function onStart(){
  projects = loadData();
  Object.keys(projects).forEach(projectName => {
    if (projectName == "Standalone tasks") return;
    uiManipulator.appendProjectElement(projectName);});
  
  setAddItemListener("addTaskSpan", "tasksForm", "tasksMenu");
  setAddItemListener("addProjectSpan", "projectsForm", "projectsMenu");
}

onStart();