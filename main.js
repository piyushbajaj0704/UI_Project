// This is the main Javascript file where the all the magic happens
// Author: Piyush Bajaj
// Topic: UI Assignment 4 

var map;
var markers = [];
var locations = [];
var draw = null;

function get_locations(){var oReq = new XMLHttpRequest();
oReq.open("POST", "http://localhost:8888/findall");
oReq.onreadystatechange = function() {
    console.log("inside findall",this.status)
      
      console.log("we are here")
      //console.log(this.responseText)
      locations = JSON.parse(this.responseText);
      //console.log(locations)
      initMap();
    
 };
console.log("we called findall")
oReq.send();
}

console.log("locations outside initMap");
console.log(locations); 

function change( temp )
{
  if ( temp.value === "Draw" )
      temp.value = "Un-Draw";
  else
      temp.value = "Draw";
}

function initMap() {
  console.log("loactions inside InitMap")
  console.log(locations)
  var styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ];

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.2904976, lng: -80.1100212},
    zoom: 3,
    styles: styles,
    mapTypeControl: false
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(),
    map: map
  });

  heatmap.set('radius',20);
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', gradient);

  function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);

  }

  /*var locations = [
    { "address": "2400 E Lake Mead Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89030", "latitude": 36.1962026, "longitude": -115.1167987, "stars": 3.0, "review_count": 12, "is_open": 1, "attributes": {"RestaurantsTableService": true, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": false, "breakfast": false, "brunch": false}, "Alcohol": "none", "Caters": true, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": false, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": true, "DriveThru": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Restaurants", "American (Traditional)", "Mexican", "Fast Food"], "hours": {"Monday": "9:00-23:00", "Tuesday": "9:00-23:00", "Friday": "9:00-23:00", "Wednesday": "9:00-23:00", "Thursday": "9:00-23:00", "Sunday": "9:00-23:00", "Saturday": "9:00-23:00"}},
    {"business_id": "QTH_XGh4rWYdd0fTW-tUDw", "name": "Baja Fresh Mexican Grill", "neighborhood": "Spring Valley", "address": "4190 S Rainbow Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89103", "latitude": 36.1125192, "longitude": -115.2426053, "stars": 3.5, "review_count": 7, "is_open": 0, "attributes": {"RestaurantsPriceRange2": 1, "RestaurantsAttire": "casual", "Alcohol": "none", "RestaurantsReservations": false}, "categories": ["Mexican", "Restaurants"], "hours": {}},
    {"business_id": "Oto60yDwk1z72WmfWEYrjg", "name": "Baja Miguel's", "neighborhood": "Southeast", "address": "South Point Hotel & Casino, 9777 S Las Vegas Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89183", "latitude": 36.0121912, "longitude": -115.1739932, "stars": 3.0, "review_count": 175, "is_open": 1, "attributes": {"RestaurantsTableService": true, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": true, "breakfast": false, "brunch": false}, "Alcohol": "full_bar", "Caters": false, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": true, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "BikeParking": false, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": true}, "RestaurantsTakeOut": true, "GoodForKids": true, "WheelchairAccessible": true, "BusinessParking": {"garage": true, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Food", "Restaurants", "Mexican"], "hours": {"Sunday": "11:00-23:00", "Wednesday": "10:00-23:00", "Thursday": "10:00-23:00", "Saturday": "11:00-23:00"}},
    {"business_id": "mUk-0jToBuzk4KaDXp-uew", "name": "Taza Indian Kitchen", "neighborhood": "Southeast", "address": "9530 S Eastern Ave", "city": "Las Vegas", "state": "NV", "postal_code": "89123", "latitude": 36.0165803, "longitude": -115.1187014, "stars": 3.0, "review_count": 17, "is_open": 0, "attributes": {"GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": true, "breakfast": false, "brunch": false}, "Alcohol": "beer_and_wine", "RestaurantsGoodForGroups": true, "RestaurantsAttire": "casual", "RestaurantsReservations": true, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "RestaurantsTableService": true, "RestaurantsDelivery": false, "RestaurantsTakeOut": true, "GoodForKids": true, "WheelchairAccessible": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}}, "categories": ["Indian", "Pakistani", "Restaurants"], "hours": {}},
    {"business_id": "gduTP-ujJ89tWOSdb3WMPA", "name": "Winchell's Donut House", "neighborhood": "Southwest", "address": "8110 W Warm Springs Rd", "city": "Las Vegas", "state": "NV", "postal_code": "89113", "latitude": 36.0559407, "longitude": -115.2680339, "stars": 3.5, "review_count": 31, "is_open": 1, "attributes": {"BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}, "Caters": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsTakeOut": true}, "categories": ["Donuts", "Food"], "hours": {"Monday": "0:00-0:00", "Tuesday": "0:00-0:00", "Friday": "0:00-0:00", "Wednesday": "0:00-0:00", "Thursday": "0:00-0:00", "Sunday": "0:00-0:00", "Saturday": "0:00-0:00"}},
    {"business_id": "TYGVaav4hWZioQlk9Ig78A", "name": "Cody's Smokin' Barbecue", "neighborhood": "Downtown", "address": "1675 S Industrial Rd", "city": "Las Vegas", "state": "NV", "postal_code": "89102", "latitude": 36.1510984, "longitude": -115.1598044, "stars": 4.5, "review_count": 70, "is_open": 0, "attributes": {"RestaurantsTableService": false, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": true, "breakfast": false, "brunch": true}, "Alcohol": "full_bar", "Caters": true, "HasTV": true, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": true, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "BikeParking": true, "RestaurantsDelivery": true, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": true, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": false, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}}, "categories": ["Restaurants", "Barbeque"], "hours": {"Friday": "11:00-19:00", "Tuesday": "11:00-19:00", "Thursday": "11:00-19:00", "Wednesday": "11:00-19:00", "Monday": "11:00-19:00"}},
    {"business_id": "Wbi-x-1Nbn6LFCMOSN6F5Q", "name": "Cafe Rio", "neighborhood": "Centennial", "address": "6575 N Decatur Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89131", "latitude": 36.2794672, "longitude": -115.2080128, "stars": 2.5, "review_count": 189, "is_open": 1, "attributes": {"RestaurantsTableService": false, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": true, "breakfast": false, "brunch": false}, "Alcohol": "none", "Caters": true, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": true, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": false, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": true}, "RestaurantsTakeOut": true, "GoodForKids": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}}, "categories": ["Restaurants", "Mexican"], "hours": {}},
    {"business_id": "rihKlAiPgJa5XcpZ1h9-bw", "name": "KFC", "neighborhood": "Centennial", "address": "5930 Centennial Center Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89149", "latitude": 36.2707001, "longitude": -115.263, "stars": 1.5, "review_count": 45, "is_open": 1, "attributes": {"RestaurantsTableService": false, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": false, "breakfast": false, "brunch": false}, "Alcohol": "none", "Caters": false, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": true, "DriveThru": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Fast Food", "Chicken Wings", "Restaurants"], "hours": {"Monday": "10:00-22:00", "Tuesday": "10:00-22:00", "Friday": "10:00-22:00", "Wednesday": "10:00-22:00", "Thursday": "10:00-22:00", "Sunday": "10:00-22:00", "Saturday": "10:00-22:00"}},
    {"business_id": "cGHdjkXa2n9B2apkicdCXQ", "name": "The Coffee Bean & Tea Leaf", "neighborhood": "Summerlin", "address": "10834 W Charleston Blvd, Ste 200", "city": "Las Vegas", "state": "NV", "postal_code": "89135", "latitude": 36.1611321711, "longitude": -115.331700319, "stars": 4.0, "review_count": 81, "is_open": 1, "attributes": {"BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}, "Caters": false, "WiFi": "free", "OutdoorSeating": true, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsTakeOut": true, "WheelchairAccessible": true}, "categories": ["Food", "Coffee & Tea"], "hours": {"Monday": "5:00-21:00", "Tuesday": "5:00-21:00", "Friday": "5:00-21:00", "Wednesday": "5:00-21:00", "Thursday": "5:00-21:00", "Sunday": "5:00-20:30", "Saturday": "5:30-21:30"}},
    {"business_id": "vjLgZg0DH_9xwcujFNb0pA", "name": "BJ's Buffet", "neighborhood": "", "address": "4945 W Tropicana Ave", "city": "Las Vegas", "state": "NV", "postal_code": "89103", "latitude": 36.099494, "longitude": -115.2083645, "stars": 1.5, "review_count": 35, "is_open": 0, "attributes": {"RestaurantsTableService": true, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": false, "breakfast": false, "brunch": false}, "Alcohol": "none", "Caters": true, "HasTV": true, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": true, "OutdoorSeating": true, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Restaurants", "Buffets"], "hours": {}},
    {"business_id": "y-O3h7CV6X6P5ey1ZFcQwA", "name": "Murdock Meals", "neighborhood": "Spring Valley", "address": "", "city": "Las Vegas", "state": "NV", "postal_code": "89148", "latitude": 36.0612353, "longitude": -115.2896852, "stars": 5.0, "review_count": 6, "is_open": 1, "attributes": {"BusinessAcceptsCreditCards": true, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": false, "breakfast": false, "brunch": false}, "RestaurantsPriceRange2": 1, "RestaurantsTableService": false, "BikeParking": false}, "categories": ["Health & Medical", "Food Delivery Services", "American (New)", "Restaurants", "Specialty Food", "Health Markets", "Home Services", "Desserts", "Weight Loss Centers", "Food"], "hours": {"Monday": "7:00-19:00", "Tuesday": "7:00-19:00", "Friday": "7:00-19:00", "Wednesday": "7:00-19:00", "Thursday": "7:00-19:00", "Sunday": "7:00-19:00", "Saturday": "7:00-19:00"}},
    {"business_id": "hMe7hiCo90jnMXyzmPnO6Q", "name": "Alfonso's Mexican Food", "neighborhood": "", "address": "5725 Losee Rd", "city": "North Las Vegas", "state": "NV", "postal_code": "89031", "latitude": 36.2603405, "longitude": -115.1171278, "stars": 2.0, "review_count": 4, "is_open": 0, "attributes": {"BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}, "HasTV": true, "NoiseLevel": "average", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "BusinessAcceptsCreditCards": true}, "categories": ["Restaurants", "Mexican"], "hours": {}},
    {"business_id": "cNd3G6WB3D8BUp46UX-J1A", "name": "Midway Bar at Hard Rock", "neighborhood": "Eastside", "address": "4455 Paradise Rd", "city": "Las Vegas", "state": "NV", "postal_code": "89169", "latitude": 36.2603405, "longitude": -115.1171280, "stars": 3.5, "review_count": 3, "is_open": 1, "attributes": {"BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Nightlife"], "hours": {}},
    {"business_id": "eS76100l3h7Ollb5s3_M4A", "name": "Mad House Coffee", "neighborhood": "Southeast", "address": "8899 S Eastern Ave", "city": "Las Vegas", "state": "NV", "postal_code": "89123", "latitude": 36.0280675, "longitude": -115.1189137, "stars": 4.0, "review_count": 214, "is_open": 1, "attributes": {"GoodForMeal": {"dessert": true, "latenight": false, "lunch": true, "dinner": false, "breakfast": true, "brunch": true}, "Alcohol": "none", "Caters": true, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "loud", "WiFi": "paid", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": true, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": true, "ByAppointmentOnly": false, "WheelchairAccessible": true, "RestaurantsTableService": false}, "categories": ["Bagels", "Breakfast & Brunch", "Restaurants", "Coffee & Tea", "Juice Bars & Smoothies", "Bakeries", "Food"], "hours": {"Monday": "6:00-20:00", "Tuesday": "6:00-20:00", "Friday": "6:00-20:00", "Wednesday": "6:00-20:00", "Thursday": "6:00-20:00", "Sunday": "7:00-17:00", "Saturday": "6:00-20:00"}},
    {"business_id": "REJPrXEZly4PDQNmiMGI8Q", "name": "Robertos Taco Shop", "neighborhood": "Northwest", "address": "10030 W Cheyenne Ave, Ste130", "city": "Las Vegas", "state": "NV", "postal_code": "89129", "latitude": 36.2186971729, "longitude": -115.313933321, "stars": 3.0, "review_count": 51, "is_open": 1, "attributes": {"RestaurantsTableService": false, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": false, "breakfast": true, "brunch": false}, "Alcohol": "none", "Caters": false, "HasTV": false, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": false, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BikeParking": true, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": true}, "RestaurantsTakeOut": true, "GoodForKids": true, "ByAppointmentOnly": false, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}}, "categories": ["Mexican", "Food", "Restaurants", "Specialty Food", "Tacos"], "hours": {}},
    {"business_id": "YQ--LJ7pvjiDSqNv0TuKTQ", "name": "Grimaldi's Pizzeria", "neighborhood": "The Strip", "address": "3327 Las Vegas Blvd S, Ste 2710", "city": "Las Vegas", "state": "NV", "postal_code": "89109", "latitude": 36.1248767264, "longitude": -115.169034004, "stars": 4.0, "review_count": 738, "is_open": 1, "attributes": {"RestaurantsTableService": true, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": true, "dinner": true, "breakfast": false, "brunch": false}, "Alcohol": "full_bar", "Caters": false, "HasTV": true, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "WiFi": "no", "RestaurantsAttire": "casual", "RestaurantsReservations": true, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "BikeParking": false, "RestaurantsDelivery": false, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": true}, "RestaurantsTakeOut": true, "GoodForKids": true, "BusinessParking": {"garage": true, "street": false, "validated": false, "lot": false, "valet": true}}, "categories": ["Restaurants", "Pizza"], "hours": {"Monday": "11:00-0:00", "Tuesday": "11:00-0:00", "Friday": "11:00-2:00", "Wednesday": "11:00-0:00", "Thursday": "11:00-0:00", "Sunday": "11:00-0:00", "Saturday": "11:00-2:00"}},
    {"business_id": "4hG2j_ibsNblDgqei05U_g", "name": "Social House", "neighborhood": "The Strip", "address": "Crystals Mall City Center, 3720 Las Vegas Blvd S", "city": "Las Vegas", "state": "NV", "postal_code": "89158", "latitude": 36.108713, "longitude": -115.173192, "stars": 4.0, "review_count": 579, "is_open": 0, "attributes": {"Alcohol": "full_bar", "HasTV": false, "NoiseLevel": "average", "RestaurantsAttire": "casual", "BusinessAcceptsCreditCards": true, "Music": {"dj": false, "background_music": true, "no_music": false, "karaoke": false, "live": false, "video": false, "jukebox": false}, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": true, "upscale": false, "casual": false}, "RestaurantsGoodForGroups": true, "BYOBCorkage": "no", "Caters": false, "WiFi": "no", "RestaurantsReservations": true, "BYOB": false, "BikeParking": false, "RestaurantsTakeOut": true, "GoodForKids": false, "HappyHour": true, "GoodForDancing": false, "RestaurantsTableService": true, "OutdoorSeating": false, "RestaurantsPriceRange2": 3, "RestaurantsDelivery": false, "BestNights": {"monday": false, "tuesday": false, "friday": true, "wednesday": false, "thursday": true, "sunday": false, "saturday": true}, "GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": true, "breakfast": false, "brunch": false}, "BusinessParking": {"garage": true, "street": false, "validated": false, "lot": false, "valet": true}, "CoatCheck": false, "Smoking": "no", "WheelchairAccessible": true, "RestaurantsCounterService": true}, "categories": ["Japanese", "Lounges", "Bars", "Nightlife", "Asian Fusion", "Restaurants"], "hours": {"Monday": "12:00-22:00", "Tuesday": "12:00-22:00", "Friday": "12:00-23:00", "Wednesday": "12:00-22:00", "Thursday": "12:00-22:00", "Sunday": "12:00-22:00", "Saturday": "12:00-23:00"}},
    {"business_id": "_XM07jbQGliVPwnAfyyGUA", "name": "Yafo Kosher Restaurant", "neighborhood": "The Strip", "address": "3049 S Las Vegas Blvd", "city": "Las Vegas", "state": "NV", "postal_code": "89109", "latitude": 36.1314439, "longitude": -115.1648858, "stars": 3.0, "review_count": 4, "is_open": 0, "attributes": {"GoodForMeal": {"dessert": false, "latenight": false, "lunch": false, "dinner": false, "breakfast": false, "brunch": false}, "Alcohol": "none", "Caters": true, "HasTV": true, "RestaurantsGoodForGroups": true, "NoiseLevel": "average", "RestaurantsAttire": "casual", "RestaurantsReservations": true, "OutdoorSeating": false, "BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 2, "RestaurantsTableService": true, "RestaurantsDelivery": true, "Ambience": {"romantic": false, "intimate": false, "classy": false, "hipster": false, "divey": false, "touristy": false, "trendy": false, "upscale": false, "casual": false}, "RestaurantsTakeOut": true, "GoodForKids": true, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": false, "valet": false}}, "categories": ["Kosher", "Restaurants"], "hours": {}},
    {"business_id": "mVIU34pAjLCmRpftGPaH1A", "name": "Dee's Donuts", "neighborhood": "Southwest", "address": "8680 W Warm Springs Rd", "city": "Las Vegas", "state": "NV", "postal_code": "89148", "latitude": 36.055627, "longitude": -115.2804128, "stars": 4.0, "review_count": 32, "is_open": 0, "attributes": {"BusinessAcceptsCreditCards": true, "RestaurantsPriceRange2": 1, "BusinessParking": {"garage": false, "street": false, "validated": false, "lot": true, "valet": false}, "WheelchairAccessible": true}, "categories": ["Donuts", "Food"], "hours": {"Monday": "6:00-14:00", "Tuesday": "6:00-14:00", "Friday": "6:00-19:00", "Wednesday": "6:00-14:00", "Thursday": "6:00-19:00", "Sunday": "6:00-15:00", "Saturday": "6:00-18:00"}},
  

]; 
*/

  var largeInfowindow = new google.maps.InfoWindow();
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT,
      drawingModes: [
        'circle', 'polygon', 'polyline', 'rectangle'
        //google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });
  var defaultIcon = makeMarkerIcon('0091ff');

  var highlightedIcon = makeMarkerIcon('FFFF24');
  console.log("locations before call")
  console.log(locations)

  for (var i = 0; i< locations.length;i++) {   // Process Query - MongoDB  OR Fetch Data
    //console.log(typeof(locations[i]))
    //console.log(locations[i].latitude)
    //console.log(locations[i].longitude)
    var position = {lat: parseFloat(locations[i].latitude), lng: parseFloat(locations[i].longitude)};
    console.log(position);
    var marker = new google.maps.Marker({
      position: position,
      map: map
    });
    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
    });

    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }
  document.getElementById('show-listings').addEventListener('click', showListings);
  //document.getElementById('hide-listings').addEventListener('click', hideListings);
  document.getElementById('drawing').addEventListener('click', function() {
    toggleDrawing(drawingManager);
  });

  document.getElementById('zoom-to-area').addEventListener('click', function() {
    zoomToArea();
  });

  document.getElementById('search-within-time').addEventListener('click', function() {
    searchWithinTime();
  });

  drawingManager.addListener('overlaycomplete', function(event) {
    if (draw) {
      draw.setMap(null);
      hideListings(markers);
    }
    drawingManager.setDrawingMode(null);
    draw = event.overlay;
    draw.setEditable(true);
    searchInsideDraw();
    draw.getPath().addListener('set_at', searchInsideDraw);
    draw.getPath().addListener('insert_at', searchInsideDraw);
  });
}

function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent(
            '<div class="pop-up">' +
            '<div class="left">' +
            '<div class="title">' + marker.title  + '</div>' +
            '<div class="city">' + marker.city  + '</div>' +
            '<div class="rating">' + "Rating:" + marker.rating  + '</div>' +
            '<div class="review">' + "Reviews:" + marker.review  + '</div>' + 
            '</div><div id="pano"></div>' + 
            '</div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent( '<div class="pop-up">' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }

    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
}
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
function hideListings() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function toggleDrawing(drawingManager) {
  if (drawingManager.map) {
    drawingManager.setMap(null);
    if (draw !== null) {
      draw.setMap(null);
    }
  } else {
    drawingManager.setMap(map);
  }
}
function searchInsideDraw() {
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.poly.containsLocation(markers[i].position, draw)) {
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

function zoomToArea() {
  var geocoder = new google.maps.Geocoder();
  var address = document.getElementById('zoom-to-area-text').value;
  if (address == '') {
    window.alert('You must enter an area, or address.');
  } else {
    geocoder.geocode(
      { address: address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(12);
        } else {
          window.alert('We could not find that location - try entering a more' +
              ' specific place.');
        }
      });
  }
}

function searchWithinTime() {
  var distanceMatrixService = new google.maps.DistanceMatrixService;
  var address = document.getElementById('search-within-time-text').value;
  if (address == '') {
    window.alert('You must enter an address.');
  } else {
    hideListings();

    var origins = [];
    for (var i = 0; i < markers.length; i++) {
      origins[i] = markers[i].position;
    }
    var destination = address;
    var mode = document.getElementById('mode').value;

    distanceMatrixService.getDistanceMatrix({
      origins: origins,
      destinations: [destination],
      travelMode: google.maps.TravelMode[mode],
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    }, function(response, status) {
      if (status !== google.maps.DistanceMatrixStatus.OK) {
        window.alert('Error was: ' + status);
      } else {
        displayMarkersWithinTime(response);
      }
    });
  }
}

function displayMarkersWithinTime(response) {
  var maxDuration = document.getElementById('max-duration').value;
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;

  var atLeastOne = false;
  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      if (element.status === "OK") {

        var distanceText = element.distance.text;

        var duration = element.duration.value / 60;
        var durationText = element.duration.text;
        if (duration <= maxDuration) {

          markers[i].setMap(map);
          atLeastOne = true;

          var infowindow = new google.maps.InfoWindow({
            content: durationText + ' away, ' + distanceText
          });
          infowindow.open(map, markers[i]);

          markers[i].infowindow = infowindow;
          google.maps.event.addListener(markers[i], 'click', function() {
            this.infowindow.close();
          });
        }
      }
    }
  }
}

function getPoints() {
  return [
    new google.maps.LatLng(40.2904976, -80.1100212),
    new google.maps.LatLng(33.3245392, -111.7204486),
    new google.maps.LatLng(36.1590984,  -115.3379148),
    new google.maps.LatLng(36.115465, -115.226764),
    new google.maps.LatLng(36.206763, -115.3007233),
    new google.maps.LatLng(36.1962026, -115.1167987),
    new google.maps.LatLng(36.1962026,  -115.1167987),
    new google.maps.LatLng(336.1125192, -115.2426053),
    new google.maps.LatLng(36.0121912, -115.1739932),
    new google.maps.LatLng(36.0165803, -115.1187014),
    new google.maps.LatLng(36.0559407, -115.2680339),
    new google.maps.LatLng(36.1510984, -115.1598044),
    new google.maps.LatLng(36.2794672, -115.2080128),
    new google.maps.LatLng(36.2707001, -115.263),
    new google.maps.LatLng(36.1611321711, -115.331700319),
    new google.maps.LatLng(36.099494, -115.2083645),
    new google.maps.LatLng(36.0612353, -115.2896852),
    new google.maps.LatLng(36.2603405, -115.1171278),
    new google.maps.LatLng(36.2603405, -115.1171280),
    new google.maps.LatLng(36.0280675, -115.1189137),
    new google.maps.LatLng(36.2186971729, -115.313933321,),
    new google.maps.LatLng(36.1248767264, -115.169034004),
    new google.maps.LatLng(36.108713, -115.173192),
    new google.maps.LatLng( 36.1314439, -115.1648858,),
    new google.maps.LatLng(36.055627, -115.2804128,),
    new google.maps.LatLng(36.2186522367, -115.125405192),
    new google.maps.LatLng(36.1278425, -115.225183),
    new google.maps.LatLng(33.4080579, -111.9469356),
    new google.maps.LatLng(33.425763, -111.939614),
    new google.maps.LatLng(33.3916359331, -111.909659764),
    new google.maps.LatLng(33.3714095, -111.9392497,),
    new google.maps.LatLng(33.3334387, -111.9477553),
    new google.maps.LatLng(33.348750911, -111.944757559)
  ];
}

// Jquery addition for Image upload

$(document).ready(function() {     
      var readURL = function(input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();
  
              reader.onload = function (e) {
                  $('.profile-pic').attr('src', e.target.result);
              }
      
              reader.readAsDataURL(input.files[0]);
          }
      }

      $(".file-upload").on('change', function(){
          readURL(this);
      });
      
      $(".upload-button").on('click', function() {
         $(".file-upload").click();
      });
  });
