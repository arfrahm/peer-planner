// Google Map
var map;
var marker;

// markers for map
var markers = [];

// info window
var info = new google.maps.InfoWindow();


// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [

        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "off"}
            ]
        }

    ];
    

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        center: {lat: 42.3770, lng: -71.1256}, // Cambridge, Massachusetts
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 20,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);
    
    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);
    var input = document.getElementById('auto-place');
    var place_name = document.getElementById('place_name');
    var autocomplete = new google.maps.places.Autocomplete(input, options);
    var geocoder = new google.maps.Geocoder();
    
// create google maps info window
    var info = new google.maps.InfoWindow(
        {
        content: ""
    });
    
    

    

    //handle for event-added
    $("#create-event-form").submit(function(e) {
    
        var url = "/"; // the script where you handle the form input.
        var posmarker = $("#create-event-form").serializeArray();
        //console.log(position);
        var latval;
        var longval;
        geocodeAddress(geocoder, map, function(latlng){
            
            latval = latlng[0];
            longval = latlng[1];
            $("#Latitude").val(latval);
            $("#Longitude").val(longval);
            $.ajax({
               type: "POST",
               url: url,
               data:$("#create-event-form").serializeArray(), // serializes the form's elements.
              
    
               success: function(data)
               {
               }
             });
            }
    
                
            );
                   
           
    
        //console.log(formdata);
        
        e.preventDefault(); // avoid to execute the actual submit of the form.
        $("#close-new-event").click();
        // $("create-event-form").reset();
        //document.getElementById("create-event-form").reset();
        
    });
    
    //handle for filter form changed
    $("#filter-event-form").on("input", function(){

        
        var parameters = {
          keyword: document.getElementById("filter-event-keyword").value,
          social: $("#filter-social").prop("checked"),
          meeting: $("#filter-meeting").prop("checked"),
          academic: $("#filter-academic").prop("checked"),
          food: $("#filter-food").prop("checked"),
          date: document.getElementById("filter-event-date").value,
            
        };
        console.log(parameters);
        $.getJSON(Flask.url_for("filter"), parameters)
        .done(function(data, textStatus, jqXHR) {
        
       // remove old markers from map
       removeMarkers();

       // add new markers to map
       
       console.log(data);
       for (var i = 0; i < data.length; i++)
       {
           addMarker(data[i]); //passed map object to function
       }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
    });
            //send filter form data using update method's technique[$.getJSON url_for etc...], changing parameters to the current value of the filter-event-form form
        //remove all markers existing on map
    //recieve request in /filter route ->>in application.py
    //use db.execute to find all entries matching the current sent data ->>in application.py
    //return a response (use jsonify) ->>in application.py
    //recieve this returns response and add new markers 
    });
    $("#filter-event-form").change( function(){
        //should be exact same method as above, triggers for checkbox changes instead
        
        
    });

    
    
    

});
// function from CS50 pset 8
// shows marker and content of window
function showInfo(marker, content)
{
    // set info window's content
    info.setContent(content);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Adds marker for place to map.
 */
function addMarker(place)
{
    //create markers and marker attributes
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place.lat, place.lng),
        label: place.event_name,
        map: map
    });
    //set map and create function that will listen for a click on the marker
    marker.setMap(map);
    //add click event listener to this marker, make information display.
   
    //create all markers
    markers.push(marker);
}

/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {

        // if info window isn't open
        // http://stackoverflow.com/a/12410385
        if (!info.getMap || !info.getMap())
        {
            update();
        }
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // configure typeahead
    $("#q").typeahead({
        highlight: false,
        minLength: 1
    },
    {
        display: function(suggestion) { return null; },
        limit: 10,
        source: search,
        templates: {
            suggestion: Handlebars.compile(
                "<div>" +
                "<div>{{place_name}}, {{admin_name1}}, {{postal_code}}</div>" +
                "</div>"
            )
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // set map's center
        map.setCenter({lat: parseFloat(suggestion.latitude), lng: parseFloat(suggestion.longitude)});

        // update UI
        update();
    });

    // hide info windeow when text box has focus
    $("#q").focus(function(eventData) {
        info.close();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
    for(i=0; i < markers.length; i++)
        markers[i].setMap(null);
    markers.length = 0;
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, syncResults, asyncResults)
{
    // get places matching query (asynchronously)
    var parameters = {
        q: query
    };
    $.getJSON(Flask.url_for("index"), parameters)
    .done(function(data, textStatus, jqXHR) {
     
        // call typeahead's callback with search results (i.e., places)
        asyncResults(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());

        // call typeahead's callback with no results
        asyncResults([]);
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) == "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='/static/ajax-loader.gif'/>";
    }
    else
    {
        div += content +"<img src='/static/fireiconsmall.png'/>";
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON(Flask.url_for("update"), parameters)
    .done(function(data, textStatus, jqXHR) {

       // remove old markers from map
       removeMarkers();

       // add new markers to map
       
       console.log(data);
       for (var i = 0; i < data.length; i++)
       {
           addMarker(data[i]); //passed map object to function
       }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
    });
}
function geocodeAddress(geocoder, resultsMap,callback) {
    console.log("geocoding");

        var address = document.getElementById('auto-place').value;

        var latlng = new Array(2);
        geocoder.geocode({'address': address}, function(results, status) {
          if (status ==='OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
              
            });
                    console.log($("#create-event-form").serializeArray());

            latlng[0] = results[0].geometry.location.lat();
            latlng[1] = results[0].geometry.location.lng();
            callback(latlng);
            marker.setMap(map);
            markers.push(marker);
            showInfo(marker,"pi");
          } else {
              console.log("no");
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
}
