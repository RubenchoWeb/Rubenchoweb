var row = null;
var msg = document.getElementById("msg");

// CREATE
// Submit function
function Submit() {
  var dataEntered = retrieveData();
  var readData = readingDataFromLocalStorage(dataEntered);
  if (dataEntered == false) {
    msg.innerHTML = `<h3 style = "color: red;">Ingresa los datos !</h3>`;
  } else {
    if (row == null) {
      insert(readData);
      msg.innerHTML = `<h3 style = "color: yellow;">Datos ingresados !</h3>`;
    } else {
      update();
      msg.innerHTML = `<h3 style = "color: orange;">Datos actualizados !</h3>`;
    }
  }

  document.getElementById("form").reset();
}

// READ
// Retrieve data
function retrieveData() {
    var name1 = document.getElementById("name").value;
    var job = document.getElementById("job").value;
    var exp = document.getElementById("exp").value;
  
    var arr = [name1, job, exp];
    if (arr.includes("")) {
      return false;
    } else {
      return arr;
    }
  }
  
  //Data in Local Storage
  function readingDataFromLocalStorage(dataEntered) {
    // Storing data in local storage
    var n = localStorage.setItem("Name", dataEntered[0]);
    var j = localStorage.setItem("Job", dataEntered[1]);
    var e = localStorage.setItem("Experience", dataEntered[2]);
  
    // Show data in table (Getting item from localStorage)
    var n1 = localStorage.getItem("Name", n);
    var j1 = localStorage.getItem("Job", j);
    var e1 = localStorage.getItem("Experience", e);
  
    var arr = [n1, j1, e1];
    return arr;
  }
  
  // INSERT
  function insert(readData) {
    var table = document.getElementById("table");
    var i = table.rows.length;
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    // row.insertCell(4).innerHTML = "JJJ"
    cell1.innerHTML = readData[0];
    cell2.innerHTML = readData[1];
    cell3.innerHTML = readData[2];
    cell4.innerHTML = `<button onclick="edit(this)"><a href="script.js:void(0)" style="text-decoration: none;">Editar</a></button> &nbsp
  <button onclick="remove(this)"><a href="script.js:void(0)" style="text-decoration: none;">Eliminar</a></button>`;
  }

  //EDIT
function edit(td) {
    row = td.parentElement.parentElement;
    document.getElementById("name").value = row.cells[0].innerHTML;
    document.getElementById("job").value = row.cells[1].innerHTML;
    document.getElementById("exp").value = row.cells[2].innerHTML;
  }
  
  // UPDATE
  function update(td) {
    row = td.parentElement.parentElement;
    row.cells[0].innerHTML = document.getElementById("name").value;
    row.cells[1].innerHTML = document.getElementById("job").value;
    row.cells[2].innerHTML = document.getElementById("exp").value;
    row = null;
  }

  // DELETE
function remove(td) {
    var ans = confirm("Are you sure you want to delete the record?");
    if (ans == true) {
      var row = td.parentElement.parentElement;
      document.getElementById("table").deleteRow(row.rowIndex);
      msg.innerHTML = `<h3 style = "color: red;">Data Deleted !</h3>`;
    }
  }