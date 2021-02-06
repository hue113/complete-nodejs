/* eslint-disable */
console.log('Hello Hue');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

export const displayMap = (location) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaHVlcHQ5MiIsImEiOiJja2tzejZuMDgwY3Q4Mndxb3ZhcndvbjdyIn0.95arHl19VG6HRTnTF25L5g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/huept92/ckkt3x3de1hd817ms7yo7xftf',
    scrollZoom: false, // zoom
    // center: [-118.113491, 34.111745],
    zoom: 4,
    // interactive: false,
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom', // bottom của pin sẽ đc đặt vào gps point; có thể để là center mà chả ai làm thế =))
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
