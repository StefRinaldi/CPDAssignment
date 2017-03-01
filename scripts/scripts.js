// use when  in browser
$(document).ready(function () {
	console.log('ready');

	var lat = 53.2307;
	var long = -0.5406;
	
	$('#start-playing').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#p2', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		$.ajax({ 
			type: "GET",
			crossDomain:true,
			dataType: "json",
			url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + long + "&radius=500&type=bar&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
			success: function(data){
				console.log(data);
				$("#pub-title-map").text(data.results[3].name);

				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: data.results[3].geometry.location.lat, lng: data.results[3].geometry.location.lng},
					zoom: 15
				});
			}
		});
    });
});