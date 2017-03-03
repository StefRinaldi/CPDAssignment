// use when  in browser
$(document).ready(function () {
	
	console.log('ready');

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
		$(':mobile-pagecontainer').pagecontainer('change', '#p2', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		$.ajax({ 
			type: "GET",
			crossDomain:true,
			dataType: "json",
			url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + localStorage.lat + "," + localStorage.lng + "&radius=500&type=bar&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
			success: function(data){
				console.log(data);
				$("#pub-title-map").text(data.results[12].name);



				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: data.results[12].geometry.location.lat, lng: data.results[12].geometry.location.lng},
					zoom: 15
				});

				var myLatlng = new google.maps.LatLng(data.results[12].geometry.location.lat,data.results[12].geometry.location.lng);

				var marker = new google.maps.Marker({
					position: myLatlng,
					title:"Hello World!"
				});

// To add the marker to the map, call setMap();
marker.setMap(map);
			}
		});
    });
});