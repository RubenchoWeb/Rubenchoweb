var endpoint = 'http://ip-api.com/json/?fields=1163583';

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) 
    {
        var response = JSON.parse(this.responseText);
        if(response.status !== 'success') 
        {
            console.log('query failed: ' + response.message);
            return
        }
        // Get country
        var country = document.getElementById("country");
        var api_country = response.country;
        console.log('Pais Api ' + api_country);
        document.getElementById("country").innerText = api_country;
    }
};
xhr.open('GET', endpoint, true);
xhr.send();
