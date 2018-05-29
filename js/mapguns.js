let mapWidth = d3.selectAll("#map").node().getBoundingClientRect().width,
mapHeight =  window.innerHeight * 0.8;

let projection = d3.geoAlbersUsa();
let path = d3.geoPath()
.projection(projection);

let mapSvg = d3.select("#map").append("svg")
.attr("width", mapWidth)
.attr("height", mapHeight)
.style("background", "#9fc6c3");

let zoom = d3.zoom()
.scaleExtent([1, 8])
.on("zoom", zoomed);

let map = mapSvg.append("g");
mapSvg.call(zoom);

let mapTooltip = d3.selectAll(".mapTooltip").append("div").classed("mapTooltip", true);

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


    // let colorScale = d3.scaleSequential(d3.interpolateGreys);

    let colorScale = d3.scaleLinear()
    .interpolate(d3.interpolateRgb)
    .range([d3.rgb("#a6adac"), d3.rgb('#EA1515')]);

    d3.json("killingbees/data/us.json", function(error, us) {

      projection.scale([mapWidth * 1.5])
      .translate([mapWidth / 2, mapHeight / 2])

      map.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

      d3.tsv("./data/geo.tsv", function(error, data) {
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
    .attr("r", 3)
    .classed("mapCircle", true)
    .attr("fill", d => { return colorScale(+d.year)})

    d3.selectAll('.mapCircle').on("mouseenter", function(d) {
      console.log(d.location)

      d3.selectAll(".mapCircle")
      .transition()
      .duration(250)
      .attr("r", 3)
      .style("opacity", 0)
      d3.select(this).style("opacity", 1)
      .transition()
      .duration(250)
      .ease(d3.easeQuadInOut)
      .attr("r",8)

      mapTooltip.append("p")
      .classed("date", true)
      .text(d.year)

      mapTooltip.append("p")
      .classed("location", true)
      .text(d.location)

      mapTooltip.append("p")
      .classed("summary", true)
      .text(d.summary)
    });

    d3.selectAll('.mapCircle').on("mouseleave", function(d){

      d3.selectAll(".mapCircle").transition()
      .duration(250)
      .style("opacity", 1)
      .attr("r", 3)

      mapTooltip.selectAll("p").remove()

    });

    d3.selectAll('.mapCircle').on("touchstart", function(d) {
      console.log(d.location)

      d3.selectAll(".mapCircle")
      .transition()
      .duration(250)
      .attr("r", 3)
      .style("opacity", 0)
      d3.select(this).style("opacity", 1)
      .transition()
      .duration(250)
      .ease(d3.easeQuadInOut)
      .attr("r",8)

      mapTooltip.append("p")
      .classed("date", true)
      .text(d.year)

      mapTooltip.append("p")
      .classed("location", true)
      .text(d.location)

      mapTooltip.append("p")
      .classed("summary", true)
      .text(d.summary)
    });

    d3.selectAll('.mapCircle').on("touchend", function(d){

      d3.selectAll(".mapCircle").transition()
      .duration(250)
      .style("opacity", 1)
      .attr("r", 3)

      mapTooltip.selectAll("p").remove()

    });

  });

});

function zoomed() {
      map.selectAll("#map circle").attr("r", 2.5 / d3.event.transform.k);
      map.style("stroke-width", 1 / d3.event.transform.k + "px");
      map.attr("transform", d3.event.transform);
    }

        function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}
