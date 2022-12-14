
function api(){
    let ubicacion = document.getElementById("ubicacion").value
    let countryName = document.getElementById('countryName')
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&appid=616629f9acdc3b22b8b09553e632e5da`)
    .then((res) => res.json())
    .then((data) =>{
        console.log(`La temperatura en ${ubicacion} es: ` + data.main.temp)
        countryName.innerHTML =`${data.name}`
        console.log(data)
    })
    .catch((error) => {
        console.log()
        console.log(`error: ${error}`)
    })
}
