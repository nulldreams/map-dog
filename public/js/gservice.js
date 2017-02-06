// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var animalMark
        var googleMapService = {};
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        // Array of locations obtained from API calls
        var locations = [];

        // Variables we'll use to help us pan to the right spot
        var lastMarker;
        var currentSelectedMarker;

        // User Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;


        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);
 
                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/animals').success(function(response){
                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

        // Private Inner Functions
        // --------------------------------------------------------------
        var markAnimal = (image) => {
                animalMark = {
                    url: image,//'/teste.png',
                    scaledSize: new google.maps.Size(50, 70), // scaled size
                    origin: new google.maps.Point(0,0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                }             
        }
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var animal = response[i];
                console.log(animal._id)
                // Create popup windows for each record
                var  contentString = '<p>' + animal.descricao + '<br><b>Idade</b>: ' + animal.idade + '<br>' +
                        '<b>Sexo</b>: ' + animal.genero + '<br><b>Tipo</b>:' + animal.tipo + '<br><br><div class="center"><a class="btn btn-info" href="/animal/' + animal._id + '" role="button">Mais informações!</a></div>' + '</p>';                

                // Converts each of the JSON records into Google Maps Location format (Note Lat, Lng format).
                locations.push(new Location(
                    new google.maps.LatLng(animal.localizacao[1], animal.localizacao[0]),
                    new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 800
                    }),
                    animal.tipo,
                    animal.genero,
                    animal.age,
                    animal.descricao,
                    animal.img.data
                ))
            }
            // location is now an array populated with records in Google Maps format
            return locations;
        };

        // Constructor for generic location
        var Location = function(latlon, message, type, gender, age, description, image){
            this.latlon = latlon;
            this.message = message;
            this.type = type;
            this.gender = gender;
            this.age = age;
            this.description = description
            this.image = image
        };

        // Initializes the map
        var initialize = function(latitude, longitude, filter) {

            // Uses the selected lat, long as starting point
            var myLatLng = {lat: selectedLat, lng: selectedLong};

            // If map has not been created...
            if (!map){

                // Create a new map and place in the index.html page
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: myLatLng
                });
            }

            // loop para criar um mark no mapa de acordo com as informações dos animais registrados no banco
            locations.forEach(function(n, i){
                markAnimal('./uploads/' + n.image)
               var marker = new google.maps.Marker({
                   position: n.latlon,
                   map: map,
                   title: "Big Map",
                   icon: animalMark
               });

                // For each marker created, add a listener that checks for clicks
                google.maps.event.addListener(marker, 'click', function(e){

                    // When clicked, open the selected marker's message
                    currentSelectedMarker = n;
                    n.message.open(map, marker);
                });
            });

            // Adiciona um mark de acordo com sua posição atual
            var initialLocation = new google.maps.LatLng(latitude, longitude);
            var marker = new google.maps.Marker({
                position: initialLocation,
                animation: google.maps.Animation.BOUNCE,
                map: map
            });
            lastMarker = marker;

            // Função para mover o mapa de acordo com a posição que o usuário clicou
            map.panTo(new google.maps.LatLng(latitude, longitude));

            // Clique no mapa para adicionar um mark vermelho
            google.maps.event.addListener(map, 'click', function(e){
                var marker = new google.maps.Marker({
                    position: e.latLng,
                    animation: google.maps.Animation.BOUNCE,
                    map: map
                });

                // Quando o mapa é clicado, remove o antigo mark e adiciona um novo
                if(lastMarker){
                    lastMarker.setMap(null);
                }

                // Cria um novo mark e se move para a nova posição
                lastMarker = marker;
                map.panTo(marker.position);

                // Update Broadcasted Variable (lets the panels know to change their lat, long values)
                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                $rootScope.$broadcast("clicked");
            });
        };

        // Refresh the page upon window load. Use the initial latitude and longitude
        google.maps.event.addDomListener(window, 'load',
            googleMapService.refresh(selectedLat, selectedLong));

        return googleMapService;
    });

