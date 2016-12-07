        // create google map on profile
        function initAutocomplete() 
        {
            var map = new google.maps.Map(document.getElementById('map'), 
                {
                center: {lat: 42.3736, lng: -71.1097},
                zoom: 13,
                mapTypeId: 'roadmap'
            });
            
            // create google maps info window
            var info = new google.maps.InfoWindow(
                {
                content: ""
            });
            

            // Create the search box and link it to the UI element.
            var input = document.getElementById('pac-input');
            var searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', function() 
                {
                searchBox.setBounds(map.getBounds());
            });
    
            var markers = [];
        
            // function from CS50 pset 8
            // shows marker and content of window
            function showInfo(marker, content)
            {
                // set info window's content
                info.setContent(content);
            
                // open info window (if not already open)
                info.open(map, marker);
            }
        
            searchBox.addListener('places_changed', function() 
            {          
                var places = searchBox.getPlaces();
    
                if (places.length == 0) 
                {
                    return;
                }
    
                // Clear out the old markers.
                markers.forEach(function(marker) 
                {
                    marker.setMap(null);
                });
              
                markers = [];
    
                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) 
                {
                    if (!place.geometry) 
                    {
                        console.log("Returned place contains no geometry");
                        return;
                    }
                    var icon = 
                    {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };
            
                // Create a marker for each place.
                    var marker = new google.maps.Marker
                    ({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location,
                    });
                
                    // pop-up form htmlin string format
                    // HIDE LAT AND LNG!!!!!!!!!!!
                    var contentString = "<form action='/insert' method='post'>" +
                            "<label>Name:</label>"+
                            "<input id='name' name='name' type='text' value = 'result.name'>"+
                            "<label>Street:</label>"+
                            "<input id='street' name='street' type='text'>"+
                            "<label>City:</label>"+
                            "<input id='city' name='city' type='text'>"+
                            "<label>State:</label>"+
                            "<input id='state' name='state' type='text'>"+
                            "<label>Zip Code:</label>"+
                            "<input id='zipcode' name='zipcode' type='text'>"+
                            "<label>Country:</label>"+
                            "<input id='country' name='country' type='text'>"+
                            "<label>Description:</label>"+
                            "<input id='description' name='description' type='text'>"+
                            "<label>Latitude:</label>"+
                            "<input id='lat' name='lat' type=hidden>"+
                            "<label>Longitude:</label>"+
                            "<input id='lng' name='lng' type=hidden>"+
                            "<input id='submit' type='submit' value='Submit'>"+
                            "</form>";

                    // needed to get place details
                    var service = new google.maps.places.PlacesService(map);
                    
                    // when marker is clicked, get place details
                    google.maps.event.addListener(marker, 'click', function() {
                    service.getDetails(place, function(result, status) {
                        if (status !== google.maps.places.PlacesServiceStatus.OK) {
                            console.error(status);
                            return;
                        }

                        var markerlat = result.geometry.location.lat();

                        var markerlng = result.geometry.location.lng();

                        var myLatLng = {markerlat, markerlng}; 
                        console.log(myLatLng);
                        
                        // show the pop-up form
                        showInfo(marker, contentString);
                        
                        // pre-fill the form we created with place details
                        //http://stackoverflow.com/questions/28078413/how-can-i-prefill-and-html-form-field-to-send-by-email
                        var name1 = document.getElementById('name');
                        name1.value = result.name;
                        
                        if (result.address_components[4].long_name == "United States"){
                            var street1 = document.getElementById('street');
                            street1.value = result.address_components[1].long_name;
                            
                            var city1 = document.getElementById('city');
                            city1.value = result.address_components[2].long_name;
                            
                            var state1 = document.getElementById('state');
                            state1.value = result.address_components[3].long_name;
                            
                            var zipcode1 = document.getElementById('zipcode');
                            zipcode1.value = result.address_components[5].long_name;
                            
                            var country1 = document.getElementById('country');
                            country1.value = result.address_components[4].long_name;
                            
                            var lat1 = document.getElementById('lat');
                            lat1.value = markerlat;
                            
                            var lng1 = document.getElementById('lng');
                            lng1.value = markerlng;
                            
                        }
                        
                        // now import city into the form 
                        });
                        
                        // when clicking add marker long and lat and save
                        
                    });
                    
                    markers.push(marker);
                
    
                    if (place.geometry.viewport) 
                    {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } 
                    else 
                    {
                        bounds.extend(place.geometry.location);
                    }
                
                
                });
                map.fitBounds(bounds);
            });
        }
        
        $(function(){
            $(".citylocationmodalopen").click(function(event){
                console.log("hihihi");
                var city = $(this.data("city"));
                $("#templatemodal-title").text(city);
                return false;
            });
        });