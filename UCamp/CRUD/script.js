var row = null;
var msg = document.getElementById("msg");

// CREATE
// Submit function
function Submit() {
  var dataEntered = retrieveData();
  //var readData = readingDataFromLocalStorage(dataEntered);
  if (dataEntered == false) {
    msg.innerHTML = `<h3 style = "color: red;">Ingresa los datos !</h3>`;
  } else {
    if (row == null) {
      insert(dataEntered);
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

  function upsert(callback){
    if(localStorage.getItem("empleados") === null){
      localStorage.setItem("empleados",JSON.stringify([]))
    }
    let baseDeDatos = JSON.parse(localStorage.getItem("empleados"))
    baseDeDatos = callback(baseDeDatos)
    localStorage.setItem("empleados",JSON.stringify(baseDeDatos))
  }
  
  // INSERT
  function insert(readData) {
  upsert((baseDeDatos)=>{
    baseDeDatos.push({
      nombre: readData[0],
      trabajo: readData[1],
      experiencia: readData[2]
    });
    return baseDeDatos
  })
  showData()
  }

  // Read
  function showData(){
    upsert((baseDeDatos)=>{
      var table = document.getElementById("tableBody");
      table.innerHTML = ""
      baseDeDatos.forEach((empleado)=>{
        const tr = document.createElement("tr")
        tr.innerHTML = `
         <td>${empleado.nombre}</td>
         <td>${empleado.trabajo}</td>
         <td>${empleado.experiencia}</td>
         <td>
          <button onclick="edit(this)">Editar</button> &nbsp
          <button onclick="remove(this)">Eliminar</button>
        </td>
        `
        table.appendChild(tr)
      })
      return baseDeDatos
    })
    
  }

  //EDIT
function edit(td) {
    row = td.parentElement.parentElement;
    document.getElementById("name").value = row.cells[0].innerHTML;
    document.getElementById("job").value = row.cells[1].innerHTML;
    document.getElementById("exp").value = row.cells[2].innerHTML;
  }
  
  // UPDATE
  function update() {

    upsert((baseDeDatos)=>{
      baseDeDatos[row.rowIndex-1].nombre = document.getElementById("name").value;
      baseDeDatos[row.rowIndex-1].trabajo = document.getElementById("job").value;
      baseDeDatos[row.rowIndex-1].experiencia = document.getElementById("exp").value;
      return baseDeDatos
    })
    showData();
    row = null;
  }

  // DELETE
function remove(td) {
    var ans = confirm("¿Estás seguro que quieres eliminar el registro?");
    if (ans == true) {
      var row = td.parentElement.parentElement;

      upsert((baseDeDatos)=>{
        baseDeDatos.splice(row.rowIndex-1, 1)
        return baseDeDatos
      })

      showData()
      
      msg.innerHTML = `<h3 style = "color: red;">¡Registro eliminado!</h3>`;
    }
  }

  window.onload = () => {
    showData()
  }