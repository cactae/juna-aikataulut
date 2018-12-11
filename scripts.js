function loadDoc(url, cFunction) {

    // Hakee ja käsittelee API yhteyden. Antaa virheen jos yhteydessä on virhe.

    var xhttp = "";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //document.getElementById("content").innerHTML = this.responseText;
            //station = JSON.parse(xhttp.responseText);
            //console.log(station);
            cFunction(this);
            error = document.getElementById('error');
            error.setAttribute("style", "display: none;");
        } else if (this.readyState == 4 && this.status == 404) {
            error = document.getElementById('error');
            error.setAttribute("style", "display: block;");
            error.innerHTML = "Error 404 resource not found.";
        }

    };
    xhttp.open("GET", url, true);
    xhttp.send();

}
var lyh;

function stations(xhttp) {
    station = JSON.parse(xhttp.responseText);
    //console.log(station);
    if (document.getElementById("stationsearch").value != "") {
        // käsittelee tekstihaun
        var txt = document.getElementById('stationsearch').value;

        //console.log(txt);
        var asema = txt + " asema";
        //Käy läpi asemat
        for (var i = 0; i < station.length; i++) {
            //console.log(i);
            if (station[i].stationName === txt || station[i].stationName == asema) {
                // Etsii vastaavan syötetyn aseman nimen ja lähettää aseman nimen htmln 
                var stat = station[i].stationName;
                var lyh = station[i].stationShortCode;
                console.log(lyh);
                var num = i;
                console.log(num);
                document.getElementById('city').value = lyh;
                document.getElementById('city').innerHTML = stat;

            } else { document.getElementById('error').innerHTML = "Etsi toisella nimellä" }

        }


    }

};
// Hakee asemalle tulevien ja sieltä lähtevien junien tiedot 
var lataus = document.getElementById('nappi');
lataus.onclick = function() {
    let domElementti = document.getElementById('city');
    let asema = domElementti.value;
    let aseman_nimi = domElementti.textContent;
    //url haettu nykyaikaisemmin
    url = "https://rata.digitraffic.fi/api/v1/live-trains/station/" + asema + "?arrived_trains=5&arriving_trains=5&departed_trains=5&departing_trains=5&minutes_before_departure=10&minutes_after_departure=1&minutes_before_arrival=10&minutes_after_arrival=1&include_nonstopping=false"
    fetch(url, { method: 'get' }).then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                // Käy läpi juna jotka asemalle/lta

                juna = data[i].trainNumber;
                var saapuvat = document.getElementById('saapuvat');
                var lahtevat = document.getElementById('lahtevat');
                //Hakee viimeisen aseman lyhenteen
                paate = data[i].timeTableRows.length;
                var y = paate - 1;

                var paate_lyh = data[i].timeTableRows[y].stationShortCode;
                //console.log(paate_lyh);

                //Tekee ilmoitukset junien saapumisesta ja lähtemisestä
                for (var j = 0; j < data[i].timeTableRows.length; j++) {
                    var listItem_lah = document.createElement('li');
                    var listItem_saa = document.createElement('li');
                    var aika = data[i].timeTableRows[j].scheduledTime;


                    if (data[i].timeTableRows[j].type === "DEPARTURE" && data[i].timeTableRows[j].stationShortCode === asema) {

                        listItem_lah.innerHTML = 'Juna ' + juna + " lähtee asemalta " + aseman_nimi + " kohti asemaa " + paate_lyh + ". Kello " + aika + ".";
                        lahtevat.appendChild(listItem_lah);
                    }

                    if (data[i].timeTableRows[j].type === "ARRIVAL" && paate_lyh === asema && data[i].timeTableRows[j].stationShortCode === asema) {
                        listItem_saa.innerHTML = "Juna " + juna + " saapuu asemalle " + aseman_nimi + ". Kello " + aika + ". Junan pääteasema";
                        saapuvat.appendChild(listItem_saa);
                    }

                }


            }
        });

}