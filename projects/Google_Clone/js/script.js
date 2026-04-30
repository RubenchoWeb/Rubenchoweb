//https://ipapi.co/api/?javascript#complete-location5

fetch('https://ipapi.co/json/')
.then(function(response) {
  response.json().then(jsonData => {
    console.log(jsonData);
    // Get country
    var country = document.getElementById("country");
    var api_country = jsonData.country_name;
    console.log('Pais Api ' + api_country);
    document.getElementById("country").innerText = api_country;
  });
})
.catch(function(error) {
  console.log(error)
});
    

