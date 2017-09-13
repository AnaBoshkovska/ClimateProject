app.service('mapService', function(){

    this.getTrafficLayer = function(selector, lat, lng){
        var map = new google.maps.Map(document.getElementById(selector), {
            zoom: 13,
            center: {lat: lat ? lat : 34.2343, lng: lng ? lng: 21.2324}
        });

            this.map = map;
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
    }
});