function deleteTask(uuid) {
    //delete div with uuid
    $('#' + uuid).remove();

    //delete from localstorage
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var taskID;

    jQuery.each(taskArray, function(index, item) {

        if (item != null) {
            if (item[0] == uuid) {
                taskID = item[1];
                delete taskArray[index];
            }
        }
    });

    //store updated array again
    localStorage.setItem("taskArray", JSON.stringify(taskArray));

    deleteIssue(taskID);

}

function completeTask(uuid) {

    // get current state of checkbox
    var chkBoxState = $('#chk'+uuid).is(':checked');

    // search id in localstorage
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var taskID;

    jQuery.each(taskArray, function(index, item) {

        if (item != null) {
            if (item[0] == uuid) {
                taskID = item[1];
            }
        }
    });

    // get other values from issue:
    var text_val = $('#'+uuid).children('#taskName').text();
    var date_val = $('#'+uuid).children('#dueDate').text();
    var prio_val = $('#'+uuid).children('#prio').text();

    //update issue in the backend
    updateIssue(taskID, chkBoxState, uuid, text_val, date_val, prio_val);

}
