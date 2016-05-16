// -- define datepicker
$(function() {
    $("#datepicker").datepicker();
});

// -- define slide toggle animation for  input fields -
function toggleInputFields() {

    var wasToggled;

    if ($("#inputFields").is(":hidden")) {
        wasToggled = true;
    } else {
        wasToggled = false;
    }

    // toggle the div
    $("#inputFields").slideToggle();

    //change the arrow
    if (wasToggled) {
        // was toggled before and is now not toggled anymore -> show toggle button
        $(".glyphicon-menu-down").replaceWith('<span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>');
    } else {
        // was not toggled before and is now toggled -> show expand button
        $(".glyphicon-menu-up").replaceWith('<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>');
    }
};

// - function for mobile: collapse when nav menu shown
function mobileToggleContentBoxes() {

    var menuOpen;
    var inputFieldsVisible;
    var issueListVisible;

    // determine visibility of menu
    // visiblity is gathered before action, so its always the old state
    if ($("#navLinkList").is(":hidden")) {
        menuOpen = false;
    } else {
        menuOpen = true;
    }

    // determine state of input fields
    if ($("#inputFields").is(":hidden")) {
        inputFieldsVisible = false;
    } else {
        inputFieldsVisible = true;
    }

    //Determine state of isse list
    if ($("#issueList").is(":hidden")) {
        issueListVisible = false;
    } else {
        issueListVisible = true;
    }

    // -- toggle inputFields --
    var wasToggled;
    //if menu is open now, it will be collapsed. this means that the input fields must be extended aswell
    if (menuOpen == true && inputFieldsVisible == false) {
        $("#inputFields").toggle();
        wasToggled = true;
    }
    //if menu is closed now, it will be extended. this means that the input fields must be collapsed
    if (menuOpen == false && inputFieldsVisible == true) {
        $("#inputFields").toggle();
        wasToggled = false;
    }

    // change the arrow of the input fields
    if (wasToggled) {
        // was toggled before and is now not toggled anymore -> show toggle button
        $(".glyphicon-menu-down").replaceWith('<span class="glyphicon glyphicon-menu-up" aria-hidden="true"></span>');
    } else {
        // was not toggled before and is now toggled -> show expand button
        $(".glyphicon-menu-up").replaceWith('<span class="glyphicon glyphicon-menu-down" aria-hidden="true"></span>');
    }

    // -- toggle Issue list --
    //if menu is open now, it will be collapsed. this means that the task list must be extended aswell
    if (menuOpen == true && issueListVisible == false) {
        $("#issueList").toggle();
    }
    //if menu is closed now, it will be extended. this means that the task list must be collapsed
    if (menuOpen == false && issueListVisible == true) {
        $("#issueList").toggle();
    }

};
