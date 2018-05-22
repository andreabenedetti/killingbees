let mapWidth = +d3.selectAll("#map").node().getBoundingClientRect().width,
mapHeight =  mapWidth / 2;

let projection = d3.geoAlbersUsa();
let path = d3.geoPath()
    .projection(projection);

let map = d3.select("#map").append("svg")
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .style("background", "#EFEAEA");

let mapTooltip = d3.select("mapTooltip")

d3.json("us.json", function(error, us) {

projection.scale([width])
  .translate([mapWidth / 2, mapHeight / 2])

map.append("path")
  .attr("class", "states")
  .datum(topojson.feature(us, us.objects.states))
  .attr("d", path);


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

d3.selectAll('#map circle').on("mouseenter", function(d) {
      console.log(d.year)



d3.selectAll("#map circle").style("opacity",0.2)
d3.select(this).style("opacity",1) 
});

d3.selectAll("#map circle").on("mouseleave", function(d){
d3.select("circle").style("opacity",1)

mapTooltip.append("p")
.text(d.year)
    });
  });
});

// function sizeChange() {
//       d3.select("#map").attr("transform", "scale(" + $("#map").width()/400 + ")");
//       $("#map").height($("#map").width()*0.2);
//   }
