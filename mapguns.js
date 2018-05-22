let mapWidth = +d3.selectAll("#map").node().getBoundingClientRect().width,
mapHeight =  mapWidth / 2;

let projection = d3.geoAlbersUsa();
let path = d3.geoPath()
.projection(projection);

let mapSvg = d3.select("#map").append("svg")
.attr("width", mapWidth)
.attr("height", mapHeight)
.style("background", "#EFEAEA");

let map = mapSvg.append("g")

let zoom = d3.zoom()
.scaleExtent([1, 4])
.on("zoom", zoomed);

let mapTooltip = mapSvg.append("g").classed("mapTooltip", true)

let interpolators = [
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

    let colorScale = d3.scaleSequential(d3.interpolateYlOrRd);

    map.call(zoom);

    d3.json("us.json", function(error, us) {

      projection.scale([width])
      .translate([mapWidth / 2, mapHeight / 2])

      map.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

      d3.tsv("geo.tsv", function(error, data) {
        if (error) throw error;

        colorScale.domain(d3.extent(data, d => { 
          return +d.year; }
          ));

    // console.log(JSON.stringify(data, null, "\t"));

    map.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
     return projection([d.lon, d.lat])[0];
   })
    .attr("cy", function(d) {
     return projection([d.lon, d.lat])[1];
   })
    .attr("r", 2)
    .classed("mapCircle", true)
    .attr("fill", d => { return colorScale(+d.year)})

    d3.selectAll('.mapCircle').on("mouseenter", function(d) {
      console.log(d.year)

      d3.selectAll(".mapCircle").style("opacity", 0.2)
      d3.select(this).style("opacity", 1)

      mapTooltip.append("text")
      .attr("x", 20)
      .attr("y", 40)
      .classed("date", true)
      .text(d.year)

    });

    d3.selectAll('.mapCircle').on("mouseleave", function(d){

      d3.selectAll(".mapCircle").style("opacity", 1)

      mapTooltip.selectAll("text").remove()

    });

  });

    });

    function reset() {
      active.classed("active", false);
      active = d3.select(null);

      map.transition()
      .duration(200)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
    }

    function zoomed() {
      // map.style("stroke-width", 1.5 / d3.event.transform(.k + "px"));
  // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
  map.attr("transform", d3.event.transform); // updated for d3 v4
}

// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}









