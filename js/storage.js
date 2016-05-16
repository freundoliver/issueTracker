// __--****--__ PROJECT LEVEL __--****--__ //

// --- CACHE ACTIONS --- //

//store project ID in cache
function localStoreProjectID() {
    //check if there was allready a project id
    var oldProjectName = localStorage.getItem("projectName");

    // new project id
    var projectName = $("#InputProjectName").val();

    //if project IDs are different: set new one and clear the old tasks!
    if (oldProjectName != projectName && projectName != "") {
        //post project id to backend & get project ID
        var projectID = postNewProject(projectName);

        // store to backend
        localStorage.setItem("projectName", projectName);
        localStorage.setItem("projectID", projectID);
        localStorage.removeItem("taskArray");

        location.reload();
    }

    if (projectName == ""){
      alert ("Project ID can not be empty");
    }

}

//read project ID from cache
function localGetProjectID() {
    // Retrieve
    $("#InputProjectName").val(localStorage.getItem("projectName"));
}

// --- REST ACTIONS --- //

//send project ID to REST
function postNewProject(projectName) {
    //this function posts a new project id to the REST
    //expected results: OK, or Project ID allready there
    var urlData = "http://zhaw-weng-api.herokuapp.com/api/projects";
    var postData = JSON.stringify({
        "title": projectName
    });

    var intProjectID;
    $.ajax({
        type: "POST",
        url: urlData,
        data: postData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data) {
            intProjectID = data.id;
            alert("Project changed");
        },
        failure: function(errMsg) {
            alert("Error while changing project");
        }
    });

    return intProjectID;

}


// __--****--__ TASK LEVEL __--****--__ //

// --- UI ACTIONS --- //

//inserts a new task to the UI
function enterNewTask() {
    //check if projectID is set
    var projectID = localStorage.getItem("projectID");

    if (projectID != null) {

        var taskName = $("#inputTaskName").val();
        var taskPrio = $("#inputPriority").val();
        var taskDueDate = $("#datepicker").val();

        //convert date from DD/MM/YYYY to YYYY-MM-DD
        var date = new Date(taskDueDate);
        var year = date.getFullYear();
        var month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        taskDueDate = year + "-" + month + "-" + day;

        //error handling
        var plausiError = false;
        if (taskName == "") {
            alert("Please enter a task name");
            plausiError = true;
        }
        if (taskDueDate == "" && plausiError == false) {
            alert("Please enter a due date");
            plausiError = true;
        }

        if (plausiError == false) {
            var uuid = guid();

            taskToUI(uuid, taskName, taskPrio, taskDueDate, false);

            //clear input fields
            clearInputFields();

            //post issue to backend (async)
            var taskID = postNewIssue(uuid, false, taskName, taskDueDate, taskPrio);

            localStoreTask(uuid, taskID);

        }

    } else {
        alert("Plese insert a Project-ID");
    }

}

function taskToUI(uuid, taskName, taskPrio, taskDueDate, done){
  var taskEntry = '<div class="row todo-list-element" id="' + uuid + '" > <!-- input checkbox: task done? --> <div class="col-md-1 center"> <form> <input type="checkbox" id="chk'+uuid+'" name="done" value="true" empty onclick="completeTask(\'' + uuid +
      '\');"></form></div><!-- task name --><div id="taskName" class="col-md-8" >' + taskName + '</div><!-- priority of task --><div id="prio" class="col-md-1">' + taskPrio + '</div><!-- task due date --><div id="dueDate" class="col-md-1">' + taskDueDate +
      '</div><!-- delete button --><div class="col-md-1 center"><img src="res/delete.png" alt="Delete item" onclick="deleteTask(\'' + uuid + '\');"></div></div>';

  $("#issueListContent").prepend(taskEntry);

  //set checkbox
  if (done == true){
    $('#chk'+uuid).prop('checked', true);
  }
  else{
    $('#chk'+uuid).prop('checked', false);
  }
}

// --- CACHE ACTIONS --- //

//store a task locally
function localStoreTask(uuid, taskID) {

    //get task array
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));

    if (taskArray != null) {
        var taskArrayLength = taskArray.length;
        //this is the new task ID!
        taskArray[taskArrayLength] = new Array(2);
        taskArray[taskArrayLength][0] = uuid;
        taskArray[taskArrayLength][1] = taskID;

    } else {
        //create new array

        var taskArray = new Array();
        taskArray[0] = new Array(2);
        taskArray[0][0] = uuid;
        taskArray[0][1] = taskID;

    }

    //store again
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

//read tasks from localcache
function localGetTasks() {

    //get task array
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));

    if (taskArray != null) {


        jQuery.each(taskArray, function(index, item) {
            if (item != null) {
                $("#issueListContent").prepend(item[1]);
            }
        });

        return true;
    } else {
        return false;
    }
}

// --- REST ACTIONS --- //

//write a new issue to REST
function postNewIssue(clientID, done, title, dueDate, taskPrio) {
    //set up data content for request

    // get project id in order to compuse URL
    var projectID = localStorage.getItem("projectID");
    var urlData = "http://zhaw-weng-api.herokuapp.com/api/project/" + projectID + "/issues";

    //the priority has to be saved in the title:
    // 1, 2 or 3 will be appended to the title, after "###". this way it can be identified again while getting.
    var issueTitle = title + "###" + taskPrio;

    //convert the projectID to int
    var projectIDInt = parseInt(projectID);

    //sent content should look like this
    /*
    {
      "project_id": 50,
      "client_id": "string",
      "done": true,
      "title": "string",
      "due_date": "2016-05-16T09:10:43.905Z"
    }
    */

    var postData = JSON.stringify({
        "project_id": projectIDInt,
        "client_id": clientID,
        "done": false,
        "title": issueTitle,
        "due_date": dueDate
    });
    var taskID;

    $.ajax({
        type: "POST",
        url: urlData,
        data: postData,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function(data) {
            taskID = data.id;
        },
        failure: function(errMsg) {
            alert("Error while updating issue with backend");
        }


    });

    return taskID;
}

function getIssues(){

  // get project id in order to compuse URL
  var projectID = localStorage.getItem("projectID");
  var urlData = "http://zhaw-weng-api.herokuapp.com/api/project/" + projectID + "/issues";

  // input can be empty (not required)
  var postData = JSON.stringify({  });

  $.ajax({
      type: "GET",
      url: urlData,
      data: postData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
      success: function(data) {
          //loop through task element
          for (i = 0; i < data.length; i++) {
            //search for pos of "###" in task name
            var delimPos = data[i].title.indexOf("###");

            var uuid        = data[i].client_id;
            var taskPrio    = data[i].title.substring(delimPos+3);
            var taskName    = data[i].title.substring(0,delimPos);
            var taskDueDate = data[i].due_date.substring(0,10);
            var done        = data[i].done;

            taskToUI(uuid, taskName, taskPrio, taskDueDate, done);
          }

      },
      failure: function(errMsg) {
          alert("Error while updating issue with backend");
      }
  });

}

function deleteIssue(issueID){
  // get project id in order to compuse URL
  var projectID = localStorage.getItem("projectID");
  var urlData = "http://zhaw-weng-api.herokuapp.com/api/project/" + projectID + "/issues/"+issueID;

  // input can be empty (not required)
  var postData = JSON.stringify({  });

  $.ajax({
      type: "DELETE",
      url: urlData,
      data: postData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: true,
      success: function(data) {
        //do nothing
      },
      failure: function(errMsg) {
          alert("Error while updating issue with backend");
      }
  });
}

//updates an issue: sets done to true or false
function updateIssue(issueID, done, uuid, text_val, date_val, prio_val){
  // get project id in order to compuse URL
  var projectID = localStorage.getItem("projectID");
  var urlData = "http://zhaw-weng-api.herokuapp.com/api/project/" + projectID + "/issues/"+issueID;

  var postData = JSON.stringify({
      "client_id": uuid,
      "done": done,
      "title": text_val+"###"+prio_val,
      "due_date": date_val
  });

  $.ajax({
      type: "PUT",
      url: urlData,
      data: postData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: true,
      success: function(data) {
        //
      },
      failure: function(errMsg) {
          alert("Error while updating issue with backend");
      }
  });

}

// __--****--__ COMMON USED __--****--__ //

//clears the input fields
function clearInputFields() {
    //set task name to space
    $("#inputTaskName").val("");

    //set initial priority "1-High"
    $("#inputPriority").val("1 - High");

    //reset date field
    $("#datepicker").val("");

}

//invoked in order to get a new UUID
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

//if the website is loaded: read localStorage
$(document).ready(function() {
    localGetProjectID();

    // try to get issues from cache
    /*if (localGetTasks() == false){

      //get issues from backend
      getIssues();

    } */

    //always get issues from backend!
    getIssues();

});
