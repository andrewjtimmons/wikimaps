
var currentInfoWindow;
var map;

$(document).ready(function () {
	var initialLocation;
	var siberia = new google.maps.LatLng(60, 105);
	var newyork = new google.maps.LatLng(40.773637, -73.970350);
	var browserSupportFlag =  new Boolean();

	function initialize() {
		//this function builds the map
		//remove google points of interest markers
	  var myStyles =[
	    {
	      featureType: "poi",
	      elementType: "labels",
	      stylers: [
	        { visibility: "off" }
	      ]
	    }
		];
		//set map types
	  mapOptions = {
	    zoom:16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    styles: myStyles,
	    disableDefaultUI: true
	  };

	  map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	  infoWidth = 350
	  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			infoWidth = 500
		}

	  // Try geolocation
		if(navigator.geolocation) {
		  browserSupportFlag = true;
		  navigator.geolocation.getCurrentPosition(function(position) {
		    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		    map.setCenter(initialLocation);
		  }, function() {
		    handleNoGeolocation(browserSupportFlag);
		  });
		}

		// Browser doesn't support Geolocation
		else {
		  browserSupportFlag = false;
		  handleNoGeolocation(browserSupportFlag);
		}

		function handleNoGeolocation(errorFlag) {
		  if (errorFlag == true) {
		    alert("Geolocation didn't work on your browser.  We are starting you in NYC");
		    initialLocation = newyork;
		  } else {
		    alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
		    initialLocation = siberia;
		  }
		  map.setCenter(initialLocation);
		}

		google.maps.event.addListener(map, 'idle', function(evt) {
			writeMarker();
		});
	}

	function writeMarker() {
		c =  map.getCenter();
	 	if (c) {
		 	var lat = c.k;
		 	var lng = c.B;
		 	var url = 'http://api.geonames.org/findNearbyWikipedia?lat='+lat+'&lng='+lng+'&maxRows=10&username=andyjt';
    	var image = {
    		url: "assets/img/MapMarkerHQ.png",
    		size: new google.maps.Size(20, 32),
    	}
		  $.get(url, function (data) {
		    $(data).find("entry").each(function(){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng($(this).find("lat").text(), $(this).find("lng").text()),
		    		icon: new google.maps.MarkerImage(
		    			"assets/img/MapMarkerHQ.png",
		    			new google.maps.Size(20, 32)
	    			)
		    	});

		  		//marker.setIcon("assets/img/MapMarkerHQ.png"); 
		    	var infowindow = new google.maps.InfoWindow({
						maxWidth: infoWidth,
						content:'<div id="content">'+
				      '<div id="siteNotice">'+
				      '</div>'+
				      '<h2 id="firstHeading" class="firstHeading">'+$(this).find("title").text()+'</h2>'+
				      '<div id="bodyContent">'+
				      '<p>'+
				      $(this).find("summary").text()+
				      '<a href="'+$(this).find("wikipediaUrl").text()+'" target="_blank">'+
				      "Wikipedia Entry"+
				      '</a>'+
				      '</p>'+
				      '</div>'+		
				      '</div>'+
				      '</div>'
					});	

					google.maps.event.addListener(marker, 'click', function() {
						if (currentInfoWindow) currentInfoWindow.close();
						infowindow.maxWidth=window.innerWidth*.80;
						infowindow.open(map,marker);
						currentInfoWindow = infowindow;
					});
		    	marker.setMap(map);
		    });
		  },"xml");
		}
	}
 		
  google.maps.event.addDomListener(window, 'load', initialize);

});