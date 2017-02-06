// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', ['headerCtrl', 'geolocation', 'gservice'])
app.controller('animalController', function($scope, $http, $window) {

    $http.get('/animals')
        .success((data) =>{
            $scope.animals = data
        })
})

app.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {}
    var queryBody = {}

    // Functions
    // ----------------------------------------------------------------------------

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude}

        // Set the latitude and longitude equal to the HTML5 coordinates
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3)
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3)
    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3)
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3)
        })
    })
})

app.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {}
    var coords = {}
    var lat = 0
    var long = 0

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude}

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3)
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3)

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)"

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude)

    })

    // Functions
    // ----------------------------------------------------------------------------

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3)
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3)
            $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)"
        })
    })

    // Function for refreshing the HTML5 verified location (used by refresh button)
    $scope.refreshLoc = function(){
        geolocation.getLocation().then(function(data){
            coords = {lat:data.coords.latitude, long:data.coords.longitude}

            $scope.formData.longitude = parseFloat(coords.long).toFixed(3)
            $scope.formData.latitude = parseFloat(coords.lat).toFixed(3)
            $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)"
            gservice.refresh(coords.lat, coords.long)
        })
    }
})

