const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const waitingListEl = document.getElementById("waiting-list");
const inProgressListEl = document.getElementById("inProgress-list");
const completedListEl = document.getElementById("completed-list");
const canceledListEl = document.getElementById("canceled-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let waitingListArray = [];
let inProgressListArray = [];
let completedListArray = [];
let canceledListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("waitingItems")) {
    waitingListArray = JSON.parse(localStorage.waitingItems);
    inProgressListArray = JSON.parse(localStorage.inProgressItems);
    completedListArray = JSON.parse(localStorage.completedItems);
    canceledListArray = JSON.parse(localStorage.canceledItems);
  } else {
    waitingListArray = ["Release the course", "Sit back and relax"];
    inProgressListArray = ["Work on projects", "Listen to music"];
    completedListArray = ["Being cool", "Getting stuff done"];
    canceledListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    waitingListArray,
    inProgressListArray,
    completedListArray,
    canceledListArray,
  ];
  const arrayNames = ["waiting", "inProgress", "completed", "canceled"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.textContent = item;
  listEl.id = index;
  listEl.classList.add("drag-item");
  listEl.draggable = true;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Waiting Column
  waitingListEl.textContent = "";
  waitingListArray.forEach((waitingItem, index) => {
    createItemEl(waitingListEl, 0, waitingItem, index);
  });
  waitingListArray = filterArray(waitingListArray);
  // In Progress Column
  inProgressListEl.textContent = "";
  inProgressListArray.forEach((inProgressItem, index) => {
    createItemEl(inProgressListEl, 1, inProgressItem, index);
  });
  inProgressListArray = filterArray(inProgressListArray);
  // Completed Column
  completedListEl.textContent = "";
  completedListArray.forEach((completedItem, index) => {
    createItemEl(completedListEl, 2, completedItem, index);
  });
  completedListArray = filterArray(completedListArray);
  // Canceled Column
  canceledListEl.textContent = "";
  canceledListArray.forEach((canceledItem, index) => {
    createItemEl(canceledListEl, 3, canceledItem, index);
  });
  canceledListArray = filterArray(canceledListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  waitingListArray = [];
  for (let i = 0; i < waitingListEl.children.length; i++) {
    waitingListArray.push(waitingListEl.children[i].textContent);
  }
  inProgressListArray = [];
  for (let i = 0; i < inProgressListEl.children.length; i++) {
    inProgressListArray.push(inProgressListEl.children[i].textContent);
  }
  completedListArray = [];
  for (let i = 0; i < completedListEl.children.length; i++) {
    completedListArray.push(completedListEl.children[i].textContent);
  }
  canceledListArray = [];
  for (let i = 0; i < canceledListEl.children.length; i++) {
    canceledListArray.push(canceledListEl.children[i].textContent);
  }
  updateDOM();
}

// When Item Enters Column Area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// When Item Starts Dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column Allows for Item to Drop
function allowDrop(e) {
  e.preventDefault();
}

// Dropping Item in Column
function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  // Remove Background Color/Padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to Column
  parent.appendChild(draggedItem);
  // Dragging completed
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
