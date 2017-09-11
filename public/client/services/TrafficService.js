app.service('mapService', function(){

    this.getTrafficLayer = function(selector, lat, lng,i){
        var mapsDiv = document.getElementById('maps');
        var id = "mapa";

            var beforeMap = document.getElementById(id);
        if(beforeMap !== null)
            mapsDiv.removeChild(beforeMap);

        var maps = document.createElement('div');
        maps.setAttribute("id", id);
        maps.style.width = "700px";
        maps.style.height = "500px";
        mapsDiv.appendChild(maps);
        var map = new google.maps.Map(document.getElementById(id), {
            zoom: 13,
            center: {lat: lat ? lat : 34.2343, lng: lng ? lng: 21.2324}
        });

            this.map = map;
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
    }
});