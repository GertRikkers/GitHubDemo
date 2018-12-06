"use strict";

const groupSelect = document.getElementById("group");
const personSelect = document.getElementById("person");
const instructionSelect = document.getElementById("instruction");

let groups = [];
let persons = [];
let instructions = [];
let selectedGroup;
let selectedPerson;
let selectedInstruction;
let startIndex = 0;
let personTimer;

init();

function init() {
    readJsonFile("groups", "data/groups.json");
}

function dataLoaded() {
    //Select first group in list
    groupSelect.options[0].selected = true;
    groupChange();
    
}

/** Handles event after another group has been selected. */
function groupChange() {
    selectedGroup = groups.find(function (group) { return group.id === groupSelect.value; });
    var filteredPersons = persons.filter(function (person) { return person.groupId === groupSelect.value; });
    fillPersonsList(filteredPersons);
    //Select first instruction in list
    instructionSelect.options[0].selected = true;
    instructionChange();
    //Select first person in list
    personSelect.options[0].selected = true;
    personChange();
    
}

/** Handles event after another person has been selected. */
function personChange() {
    selectedPerson = persons.find(function (person) { return person.id === personSelect.value; });
    var hostNumber = gethostNumber();
    var year = selectedGroup.year;
    var baseUrl = "http://" + selectedPerson.id
        + ".hosts" + hostNumber + ".ma-cloud.nl/bewijzenmap/"
        + "periode" + year + ".1/fro/js/";
    if (selectedPerson.hostingUrl) {
        baseUrl = selectedPerson.hostingUrl;
    }
    if (baseUrl.substr(baseUrl.length - 1, 1) != "/") {
        baseUrl += "/";
    }
    selectedPerson.baseUrl = baseUrl;
    updateContent();
    updatePersonView();
}

/** Handles event after another instruction has been selected. */
function instructionChange() {
    selectedInstruction = instructions.find(function (instruction) { return instruction.id === instructionSelect.value; });
    updateContent();
}

var selectedDevice = "computer";

function deviceClick(selected) {
    selectedDevice = selected.value;
    var width = "100%";
    if (selectedDevice === "phone") {
        width = "300px";
    }
    document.getElementById("content").width = width;
}

var selectedView = "html";
function viewClick(selected) {
    selectedView = selected.value;
    updateContent();
}

function openNewTab() {
    var message = document.getElementById("message");
    window.open(message.innerText, '_blank');
}

function openGitHub() {
    window.open(selectedPerson.gitHubUrl, '_blank');
}

function personLoop() {
    let element = document.getElementById("personLoop");
    if (element.innerText == "Start Loop") {
        element.innerText = "Stop Loop";
        startIndex = personSelect.selectedIndex;
        personTimer = setInterval(myTimer, 3000);
    }
    else {
        element.innerText = "Start Loop";
        clearInterval(personTimer)
    }
}

function myTimer() {
    if (startIndex >= personSelect.options.length) {
        startIndex = 0;
    }
    personSelect.options[startIndex].selected = true;
    personChange();
    startIndex++;
    //let message = document.getElementById("message");
    //message.innerText = startIndex;
}

function updateContent() {
    let url = "about:blank";
    document.getElementById("content").src = url;
    url = selectedPerson.baseUrl + selectedInstruction.code;
    if (selectedView === "css") {
        url += '/style.css';
    }
    else if (selectedView === "js") {
        url += '/script.js';
    }
    else if (selectedView === "git") {
        url = selectedPerson.gitHubUrl;
    }

    document.getElementById("content").src = url;
    document.getElementById("message").innerHTML = url;
}

/** updates the student information: name, photo and group. */
function updatePersonView() {
    if (selectedPerson) {
        document.getElementById("personName").innerText = selectedPerson.name;
        document.getElementById("personImage").src = selectedPerson.baseUrl + "photo.jpg";
        document.getElementById("groupName").innerText = selectedPerson.groupId;
    }
}

/** Reads Json file and converts this to a JS object. */
function readJsonFile(type, file) {
    var request = new XMLHttpRequest();
    request.overrideMimeType("text/plain"); // Prevents XML Parse Error
    request.open("GET", file, false); // true prevents Synchronous XMLHttpRequest on the main thread is deprecated
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200 || request.status == 0) {
                var allText = request.responseText;
                var data = JSON.parse(allText);
                switch (type) {
                    case "groups":
                        groups = data;
                        fillGroupsList(data);
                        readJsonFile("persons", "data/persons.json");
                    break;
                    case "persons":
                        persons = data;
                        fillPersonsList(data);
                        readJsonFile("instructions", "data/instructions.json");
                        break;
                    case "instructions":
                        instructions = data;
                        fillInstructionsList(data);
                        dataLoaded();
                        break;

                    default:
                    //code block
                }
            }
        }
    }
    request.send(null);
}

function fillGroupsList(groups) {
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var opt = document.createElement('option');
        opt.value = group.id;
        opt.innerHTML = group.name;
        groupSelect.appendChild(opt);
    }
}

function fillPersonsList(persons) {
    //persons.sort(compare);
    personSelect.options.length = 0;
    for (var i = 0; i < persons.length; i++) {
        var person = persons[i];
        var opt = document.createElement('option');
        opt.value = person.id;
        opt.innerHTML = person.name;
        personSelect.appendChild(opt);
    }
}

function fillInstructionsList(instructions) {
    for (var i = 0; i < instructions.length; i++) {
        var instruction = instructions[i];
        var opt = document.createElement('option');
        opt.value = instruction.id;
        opt.innerHTML = instruction.name;
        instructionSelect.appendChild(opt);
    }
}

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}

function gethostNumber() {
    if (selectedPerson.hostNumber) {
        return selectedPerson.hostNumber
    }
    return selectedGroup.hostNumber
}


// Example for documentation

var a = exampleFunction(5, 4);

/**
 * This is an example of a function.
 * @param {number} a - this is a 1st number value.
 * @param {number} b - this is a 2nd number value.
 * @returns {string} Hello
 */
function exampleFunction(a, b) {
    return 'Hello ' + (a * b);
}
