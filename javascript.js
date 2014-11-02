
var currentInfoWindow;
var map;
//var markers = []
//var markerIcons = []

$(document).ready(function () {
	var initialLocation;
	var siberia = new google.maps.LatLng(60, 105);
	var newyork = new google.maps.LatLng(40.773637, -73.970350);
	var browserSupportFlag =  new Boolean();
	var InfoWindowCount = 0  

	//check if a marker already exist
	// function checkMarkers(title){
	// 	for (i = markers.length; i--;)
	// 		if (markers[i].title == title)
	// 			return true;
	// 	addMarker(title)
	// 	return false;
	// }

	// //generates a new marker in the local array
	// function Marker(title){
	// 	this.title = title
	// }
	// //make a new marker and add to local array
	// function addMarker(title){
	// 	var marker = new Marker(title)
	// 	markers.push(marker)
	// 	return
	// }

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

	  //varlat , lng = map.getCenter()

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
	 	var lat = c.k;
	 	var lng = c.B;
	 	var url = 'http://api.geonames.org/findNearbyWikipedia?lat='+ lat +'&lng='+ lng +'&maxRows=10&username=andyjt';
	  $.get(url, function (data) {
	    $(data).find("entry").each(function(){
	    	//check to see if the marker was already made
	    	//if (checkMarkers($(this).find("title").text()) === false) {
	      	var marker = new google.maps.Marker({
	      		position: new google.maps.LatLng($(this).find("lat").text(), $(this).find("lng").text()),
	      	});

	    		marker.setIcon("assets/img/MapMarker.png"); 
	      	var infowindow = new google.maps.InfoWindow({
	  				maxWidth: infoWidth,
	  				content:'<div id="content">'+
							      '<div id="siteNotice">'+
							      '</div>'+
							      '<h1 id="firstHeading" class="firstHeading">'+$(this).find("title").text()+'</h1>'+
							      '<div id="bodyContent">'+
							      '<p>'+$(this).find("summary").text()+' <a href="'+$(this).find("wikipediaUrl").text()+'" target="_blank">Wikipedia Entry</a></p>'+
							      '</div>'+		
							      '</div>'+
							      '</div>'
					});	

					google.maps.event.addListener(marker, 'click', function() {
						if (currentInfoWindow) currentInfoWindow.close();
						infowindow.open(map,marker);
						currentInfoWindow = infowindow;
						// $("#"+InfoWindowCount).click(function(){
						// 	alert('hi')
						// 	// if (marker.getIcon() === "/assets/MapMarker.png") {
						// 	// 	marker.setIcon("/assets/MapMarker1.png"); 
						// 	// }else{
						// 	// 	marker.setIcon("/assets/MapMarker.png"); 
						// 	// }
		  		// 		});
					});
	      	//marker.set("id", -InfoWindowCount)
	      	marker.setMap(map);
	      	//markerIcons.push(marker)
	      	//InfoWindowCount += 1
	      //}
	    });
	  },"xml");
	}
 		
  google.maps.event.addDomListener(window, 'load', initialize);

});