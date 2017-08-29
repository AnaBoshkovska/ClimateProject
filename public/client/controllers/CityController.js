/**
 * Created by win on 29.8.2017.
 */
app.controller('cityController', ['$scope', '$http', function($scope, $http){

    $scope.autocomplete = function(){
             var city = $scope.city;
            $http.get('/cities', {params: {name: city}}).then(function(response){
                $scope.cities = response.data;
                console.log(response.data);
            });
    }
}]);