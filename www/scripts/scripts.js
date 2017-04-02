// use when  in browser
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
var push = PushNotification.init({
"android": {
"senderID": "825647654839"
},
"ios": {
"sound": true,
"alert": true,
"badge": true,
"categories": {
"invite": {
"yes": {
"callback": "app.accept", "title": "Accept", "foreground": true, "destructive": false
},
"no": {
"callback": "app.reject", "title": "Reject", "foreground": true, "destructive": false
},
"maybe": {
"callback": "app.maybe", "title": "Maybe", "foreground": true, "destructive": false
}
},
"delete": {
"yes": {
"callback": "app.doDelete", "title": "Delete", "foreground": true, "destructive": true
},
"no": {
"callback": "app.cancel", "title": "Cancel", "foreground": true, "destructive": false
}
}
}
},
"windows": {}
});
push.on('registration', function(data) {
console.log("registration event: " + data.registrationId);
var oldRegId = localStorage.getItem('registrationId');
if (oldRegId !== data.registrationId) {
// Save new registration ID
localStorage.setItem('registrationId', data.registrationId);
// Post registrationId to your app server as the value has changed
}
});
push.on('error', function(e) {
console.log("push error = " + e.message);
});
push.on('notification', function(data) {
console.log('notification event');
navigator.notification.alert(
data.message, // message
null, // callback
data.title, // title
'Ok' // buttonName
);
});
}
$(document).ready(function () {

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;

		localStorage.setItem("lat", crd.latitude);
		localStorage.setItem("lng", crd.longitude);

		$('#lat').text(crd.latitude);
		$('#lng').text(crd.longitude);

		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);

		
	};

	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
	
	$('#start-playing').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		$.ajax({ 
			type: "GET",
			crossDomain:true,
			dataType: "json",
			url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + localStorage.lat + "," + localStorage.lng + "&type=bar&rankby=distance&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
			success: function(data){
				console.log(data);
				localStorage.setItem("placesData", JSON.stringify(data));
				console.log(JSON.parse(localStorage.placesData));

				$("#pub-title-map").text(data.results[7].name);

				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: data.results[7].geometry.location.lat, lng: data.results[7].geometry.location.lng},
					zoom: 17
				});

				var myLatLng = {lat: data.results[7].geometry.location.lat, lng: data.results[7].geometry.location.lng};

				var marker = new google.maps.Marker({
					position: myLatLng,
					animation: google.maps.Animation.DROP,
					map: map
				});

				marker.setMap(map);

				$.each(data.results, function(key,value){
					console.log(key+":"+value.name);
				});
			}
		});

		var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 41.85, lng: -87.65}
        });

        directionsDisplay.setMap(map);

        calculateAndDisplayRoute(directionsService, directionsDisplay);

		function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	        directionsService.route({
	          origin: "chicago, il",
	          destination: "st louis, mo",
	          travelMode: 'DRIVING'
	        }, function(response, status) {
	          if (status === 'OK') {
	            maps.setDirections(response);
	          } else {
	            window.alert('Directions request failed due to ' + status);
	          }
	    	});
      	}

		var stuff = JSON.parse(localStorage.getItem("placesData"));

		$.ajax({ 
			type: "GET",
			crossDomain:true,
			dataType: "json",
			url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + stuff.results[7].place_id + "&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
			success: function(data){
				localStorage.setItem("daplace", JSON.stringify(data));
				$('#web-link').attr("href", data.result.website);
			}
		});
	});

    $('.another').click(function(){

		$(this).children("i").rotate({
			angle:0,
			animateTo:360
		});

    	$('#pub-title-map').slideUp(200).slideDown(200);

		var indexRnd = Math.floor(Math.random() * 20);

		var stuff = JSON.parse(localStorage.getItem("placesData"));

		$("#pub-title-map").text(stuff.results[indexRnd].name);
		
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: stuff.results[indexRnd].geometry.location.lat, lng: stuff.results[indexRnd].geometry.location.lng},
			zoom: 17
		});

		var myLatLng = {lat: stuff.results[indexRnd].geometry.location.lat, lng: stuff.results[indexRnd].geometry.location.lng};

		var marker = new google.maps.Marker({
			position: myLatLng,
			animation: google.maps.Animation.DROP,
			map: map
		});

		marker.setMap(map);

		console.log(stuff.results[indexRnd].place_id);

		$.ajax({ 
			type: "GET",
			crossDomain:true,
			dataType: "json",
			url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + stuff.results[indexRnd].place_id + "&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
			success: function(data){
				localStorage.setItem("daplace", JSON.stringify(data));
				console.log(data.result);
				$('#address').html(data.result.adr_address);
				$("#address").html($("#address").html().replace(',',''));
				$('#open').attr("open", data.result.opening_hours.open_now);
				$('#website-link').attr("href", "https://www.google.co.uk/maps/dir/" + localStorage.lat + "," + localStorage.lng + "/" + stuff.results[indexRnd].geometry.location.lat + "," + stuff.results[indexRnd].geometry.location.lng + "/");
				$('#rating').text(data.result.rating);

				if($('#open').attr("open")){
					$('#open').text("Open");
					$('#open').css({"background" : "#128c0e"});
				} else {
					$('#open').text("Closed");
					$('#open').css({"background" : "#e01a23"});
				}
			}
		});

	});

	$('#info-button').click(function(){
		$('#info').slideToggle();

		var text = $('#info-button').text();
    	$('#info-button').text(
        	text == "info" ? "cancel" : "info");
	});

	$('.drink').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#pub-info-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		var stuff = JSON.parse(localStorage.getItem("daplace"));
		
		var panorama;

        panorama = new google.maps.StreetViewPanorama(
            document.getElementById('street-view'),
            {
              position: {lat: stuff.result.geometry.location.lat, lng: stuff.result.geometry.location.lng},
              pov: {heading: 165, pitch: 0},
              zoom: 1
            });

		console.log(stuff);

		$('#pub-title-main').text(stuff.result.name);
		$('#review-title').text(stuff.result.reviews["0"].author_name);
		$('#review-content').text(stuff.result.reviews["0"].text);
		$('#review-profile-img').html("<img src='" + stuff.result.reviews["0"].profile_photo_url + "'>");
	});

	$('#back').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);
	});
});