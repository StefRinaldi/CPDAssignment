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

$(document).ready(function(){
	get_location();

	$( ":mobile-pagecontainer" ).on( "pagecontainerchange", function( event, ui ) {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 17,
			center: {lat: parseFloat(localStorage.lat), lng: parseFloat(localStorage.lng)}
		});

		myMarker = new google.maps.Marker({
			position: {lat: parseFloat(localStorage.lat), lng: parseFloat(localStorage.lng)},
			animation: google.maps.Animation.DROP,
			map: map
		});

		map.setCenter(pubLatLng);

		marker = new google.maps.Marker({
		position: pubLatLng,
		animation: google.maps.Animation.BOUNCE,
		map: map
		});

		marker.setMap(map);

		myMarker.setMap(map);

	} );
	

	if(localStorage.getItem("currentCrawl") == null){
		$("#start-new").hide();
		$("#continue-old").hide();
	} else {
		$("#start-playing").hide();
	}

	$('.reviews').slick({
		infinite: true,
		arrows: false
	});
	
	$('#start-playing').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();

		localStorage.removeItem("currentCrawl");

	});

	$('#start-new').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();

		localStorage.removeItem("currentCrawl");
	});

	$('.settings').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#settings-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();

		$("input[type=range]").val(localStorage.radius/1600).slider("refresh");
	});

	$('#continue-old').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();

	});

    $('.another').click(function(){
    	
		$(this).children("i").rotate({
			angle:0,
			animateTo:360
		});

		marker.setMap(null);
		map.setCenter(pubLatLng);
		map.setZoom(17);
		pick_pub();
	});

	$('#info-button').click(function(){
		$('#info').slideToggle();

		$('.reviews').get(0).slick.setPosition();
		var text = $('#info-button').text();
    	$('#info-button').text(
        	text == "info" ? "cancel" : "info");
	});

	$('.drink').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#pub-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		var stuff = JSON.parse(localStorage.getItem("currentPub"));

		$('#on-your-way span').text(stuff.result.name);
		$('#directions-button').attr("href", "https://www.google.co.uk/maps/dir/" + localStorage.lat + "," + localStorage.lng + "/" + stuff.result.geometry.location.lat + "," + stuff.result.geometry.location.lng + "/");
		$('#review-title').text(stuff.result.reviews["0"].author_name);
		$('#review-content').text(stuff.result.reviews["0"].text);
		$('#review-profile-img').html("<img src='" + stuff.result.reviews["0"].profile_photo_url + "'>");
	});

	$('.back').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();
	});

	$('.save').click(function(){

		radius = $('#slider-fill').val()*1600;

		console.log(radius);

		localStorage.setItem("radius", radius);

		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		get_pub_data();
		pick_pub();
	});

	$('#done-button').click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#main-page', {
			transition: 'slidedown',
			changeHash: false
		}, 5000);

		var stuff = JSON.parse(localStorage.getItem("currentPub"));

		var currTime = new Date().toLocaleString();

		var newPub = [
			stuff.result.name,
			stuff.result.place_id,
			currTime
		]

		console.log(newPub);

		if(localStorage.getItem("currentCrawl") == null){
			var currentCrawl = [];
			currentCrawl.push(newPub);
			localStorage.setItem("currentCrawl", JSON.stringify(currentCrawl));
		} else {
			var currentCrawl = JSON.parse(localStorage.getItem("currentCrawl"));
			currentCrawl.push(newPub);
			localStorage.setItem("currentCrawl", JSON.stringify(currentCrawl));
		}

		console.log(JSON.parse(localStorage.getItem("currentCrawl")));	
	});
});

function get_location(){

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

		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: crd.latitude, lng: crd.longitude},
			zoom: 17
		});

		console.log('Your current position is:');
		console.log(`Latitude : ${crd.latitude}`);
		console.log(`Longitude: ${crd.longitude}`);
		console.log(`More or less ${crd.accuracy} meters.`);

		
	};

	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
}

function get_pub_data(){

	console.log(localStorage.getItem("radius")==null)

	if (localStorage.getItem("radius")==null) 
		radius = 1600;
	else
		radius = localStorage.getItem("radius");
	
	console.log(radius);
	console.log(localStorage.getItem("radius"));

	$.ajax({ 
		type: "GET",
		crossDomain:true,
		dataType: "json",
		url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + localStorage.lat + "," + localStorage.lng + "&radius=" + radius + "&type=bar&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
		success: function(data){
			console.log(data);
			localStorage.setItem("placesData", JSON.stringify(data));
			console.log(JSON.parse(localStorage.placesData));
		}
	});

}

function pick_pub() {
	$('#pub-title-map').slideUp(200).slideDown(200);

	var indexRnd = Math.floor(Math.random() * 20);

	var stuff = JSON.parse(localStorage.getItem("placesData"));

	$("#pub-title-map").text(stuff.results[indexRnd].name);

	pubLatLng = {lat: stuff.results[indexRnd].geometry.location.lat, lng: stuff.results[indexRnd].geometry.location.lng};

	map.setCenter(pubLatLng);
	map.setZoom(17);

	marker = new google.maps.Marker({
		position: pubLatLng,
		animation: google.maps.Animation.BOUNCE,
		map: map
	});

	marker.setMap(map);

	console.log(stuff.results[indexRnd].place_id);

	$('.review').remove();

	$.ajax({ 
		type: "GET",
		crossDomain:true,
		dataType: "json",
		url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + stuff.results[indexRnd].place_id + "&key=AIzaSyCzkA7RIl14ppr-tf6jBoPVDRuU7jBF_W0",
		success: function(data){
			localStorage.setItem("currentPub", JSON.stringify(data));
			console.log(data.result);
			$('#address').html(data.result.adr_address);
			if(data.result.opening_hours){
				$('#open').attr("data-open", data.result.opening_hours.open_now);
			} else {
				$('#open').attr("data-open", "unknown");
			}
			$('#website-link').attr("href", data.result.website);

			if (data.result.formatted_phone_number) {
				$('#phone-button').slideDown();
				$('#phone-link').attr("href", "tel:"+data.result.formatted_phone_number);
			} else {
				$("#phone-button").slideUp();
			}

			$('#rating').text(data.result.rating);

			if($('#open').attr("data-open") == "true"){
				$('#open').text("Open");
				$('#open').css({"background" : "#128c0e"});
			} else if ($('#open').attr("data-open") == "false"){
				$('#open').text("Closed");
				$('#open').css({"background" : "#e01a23"});
			} else if ($('#open').attr("data-open") == "unknown"){
				$('#open').text("Unknown");
				$('#open').css({"background" : "#e01a23"});
			}

			console.log(data.result.name);


			$('.reviews').slick('removeSlide', null, null, true);

			$.each(data.result.reviews, function(key, value){
				$('.reviews').slick('slickAdd', 
					"<div class='review'>\
						<div class='review-info'>\
							<span class='author-image'><img height='40em' src='" + value.profile_photo_url + "'/></span>" +
							"<span class='author-name'>" + value.author_name + "</span>" +
							"<span class='review-rating'>" + value.rating + "</span><span class='review-star'><i class='material-icons'>grade</i></span>" +
							"<div class='review-text'>" + value.text + "</div>\
						</div>\
					</div>"
				);
			});
		}
	});


	console.log($("#main-page").css("display"));
}