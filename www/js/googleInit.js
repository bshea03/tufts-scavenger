/**
 * Created by Philip on 4/20/17.
 */
// Being called by the GoogleMap API
// Initial the googleMap with default location as 0,0



function initMap() {
    var defalutLocation = new google.maps.LatLng(42.4062040, -71.1188770);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: defalutLocation
    });
}

