let mapWidth = window.innerWidth,
    mapHeight = 800;

let projection = d3.geoAlbersUsa();
let path = d3.geoPath()
    .projection(projection);

let map = d3.select("#map").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .style("background", "#EFEAEA");

d3.json("us.json", function(error, us) {

projection.scale([width])
  .translate([width / 2,height / 1.5])

map.append("path")
  .attr("class", "states")
  .datum(topojson.feature(us, us.objects.states))
  .attr("d", path);

// let colorScale = d3.scaleLinear()
// .interpolate(d3.interpolateRgb)
// .range([d3.rgb("#490000"), d3.rgb('#FF0000')]);

var interpolators = [
    // These are from d3-scale.
    "Viridis",
    "Inferno",
    "Magma",
    "Plasma",
    "Warm",
    "Cool",
    "Rainbow",
    "CubehelixDefault",
    // These are from d3-scale-chromatic
    "Blues",
    "Greens",
    "Greys",
    "Oranges",
    "Purples",
    "Reds",
    "BuGn",
    "BuPu",
    "GnBu",
    "OrRd",
    "PuBuGn",
    "PuBu",
    "PuRd",
    "RdPu",
    "YlGnBu",
    "YlGn",
    "YlOrBr",
    "YlOrRd"
  ];

let colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, width])

d3.tsv("geo.tsv", function(error, data) {
if (error) throw error;

colorScale.domain(d3.extent(data, d => { 
      return +d.year; }
      ));

map.selectAll("circle")
         .data(data)
         .enter()
         .append("circle")
         .attr("cx", function(d) {return projection([d.lon, d.lat])[0];})
         .attr("cy", function(d) {return projection([d.lon, d.lat])[1];})
         .attr("r", 2)
         .style("fill", function(d) { return colorScale(+d.year); })

d3.selectAll('circle').on("mouseenter", d => {
    console.log(d.year)
  });

});



});