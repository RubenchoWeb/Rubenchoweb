// Variable para obtener datos de los registros
let row = null;
// Mensaje cuando se realiza una acción
let msg = document.getElementById("msg");
/*
  Clear form
  Funcion creada para solucionar un bug al limpiar los datos del formulario
*/
function resetForm() {
  row = null;
  document.getElementById("form").reset();
}
/* 
  CREATE
  Submit function se activa al dar click en Ingresar
*/ 
function Submit() {
  /*
    La variable dataEntered devuelve el valor de la función retrieveData
    La función retrieveData almacena los datos en un array en caso de que
    No se ingresen datos regresa un false
  */
  var dataEntered = retrieveData();
  //Si dataEntered es falso msg escribe un mensaje indicando que ingrese datos
  if (dataEntered == false) {
    msg.innerHTML = `<h3 style = "color: red;">¡Ingresa todos los datos!</h3>`;
  } else {
    /*
      Si no se han se ha seleccionado una fila de datos para editar se llama la funcion
      insert enviandole los datos almacenados en dataEntered luego muestra el mensaje de datos ingresados
    */
    if (row == null) {
      insert(dataEntered);
      msg.innerHTML = `<h3 style = "color: yellow;">¡Datos ingresados!</h3>`;
    } else {
      /*
        Si se selecciona una fila llama la función de update enviandole los datos almacenados
        en dataEntered luego muestra el mensaje de datos actualizados
      */
      update();
      msg.innerHTML = `<h3 style = "color: orange;">¡Datos actualizados!</h3>`;
    }
  }
  //Despues de ejecutar la función limpia el formulario
  resetForm();
}

// READ
// Retrieve data
function retrieveData() {
    //Obtenemos los datos de los input por medio del id
    var name1 = document.getElementById("name").value;
    var job = document.getElementById("job").value;
    var exp = document.getElementById("exp").value;
    /*
      se almacenan los valores en un array si es vacio regresa falso,
      caso contrario regresa los valores del array
    */
    var arr = [name1, job, exp];
    if (arr.includes("")) {
      return false;
    } else {
      return arr;
    }
  }
  
  //Data in Local Storage

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