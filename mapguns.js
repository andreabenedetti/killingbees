let mapWidth = 900,
    mapHeight = 600;

let projection = d3.geoAlbersUsa();
let path = d3.geoPath()
    .projection(projection);

let map = d3.select("#map").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

d3.json("us.json", function(error, us) {

  map.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

  
});