$( document ).ready(function() {
console.log("Drawing visualizations");

/////////////////// Killing bees

let killingbees = document.getElementById("killingbees");

let width = d3.selectAll("#killingbees").node().getBoundingClientRect().width,
height = 600,
padding = window.innerWidth * 0.08; 

    let svg = d3.select('#killingbees').append('svg')
    .attr('width', width)
    .attr('height', height)

    // parse values in dataset
    let parseDate = d3.timeParse("%Y-%m-%d");
    let formatDate = d3.timeFormat("%d %B %Y");

    // various scales, could be optimized
    let colors = d3.scaleOrdinal()
    .domain(["Yes", "No", "Unknown", "Unclear"])
    .range(["#EA1515","#9fc6c3","#FFFFFF","#a6adac"]);

    let x = d3.scaleTime()
    .range([0 + padding, width - padding]);

    let x1 = d3.scaleLinear()
    .range([0 + padding, width - padding]);

    let x2 = d3.scaleLog()
    .range([0 + padding, width - padding]);


    let y0 = d3.scalePoint()
    .domain( function(d) { 
      console.log(d.data)
      return d.data } )

    let y = d3.scaleLinear()
    .range([0 + padding, height - 5]);

    let y2 = d3.scalePoint()
    .domain(["Open","Open+Close","Close","na"])
    .range([0 + 50, height - 50]);

    let y3 = d3.scalePoint()
    .domain(["Yes","No","Unclear","Unknown"])
    .range([0 + 50, height - 50]);

    let y4 = d3.scalePoint()
    .domain(["Male","Female","Male/Female","Unknown"])
    .range([0 + 50, height - 50]);

    let y5 = d3.scalePoint()
    .domain(["White","Asian","Asian American","Black","Latino","Native","Other","Unknown"])
    .range([0 + 50, height - 50]);

    let size = d3.scaleSqrt()
    .range([2,20]);

    // Assi
    let killAxis = d3.axisBottom(x2).tickFormat(d3.format(".0s")).tickSize(height - 20);
    let ageAxis = d3.axisBottom(x1)
    .tickSize(height - 20);
    let dateAxis = d3.axisBottom(x).ticks(10)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSize(height - 20);

    let locationAxis = d3.axisLeft(y2).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    let healthAxis = d3.axisLeft(y3).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    let genderAxis = d3.axisLeft(y4).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    let raceAxis = d3.axisLeft(y5).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);

    // starting visualization with:
    let data_set = "health";
    let data_setX = "value";

    // Parse dataset

    d3.csv("data/shootings.csv", function(error, data) {
      if (error) throw error;

      x.domain(d3.extent(data, function(d) { 
        d.value = parseDate(d.value);
        d.value = +d.value;
        return d.value;
      }));

      x1.domain(d3.extent(data, function(d) { 
        d.age = +d.age;
        return d.age;
      }));

      x2.domain(d3.extent(data, function(d) { 
        d.kills = +d.kills;
        return d.kills;
      }));

      // console.log(JSON.stringify(data, null, "\t"));

      y.domain(d3.extent(data, function(d) { 
        d.lat = +d.lat;
        return d.lat; }

        ));

      size.domain(d3.extent(data, function(d) { 

        return d.kills; }

        ));

      // start ticks for animations and transitions

      function tick(){

        d3.selectAll('.circ')
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})

      };

      // Draw axes

      svg.append("g")
      .call(dateAxis)
      .classed("xAxis", true);

      svg.append("g")
      .attr("transform","translate(" + ( width - padding ) + ",0)")
      .classed("yAxis", true);

      // Draw circles

      svg.selectAll('.circ')
      .data(data)
      .enter()
      .filter(function(d) { return d.kills > 3 })
      .append('circle').classed('circ', true)
      .attr('r', function(d) { return size(d.kills) })
      .attr('cx', function(d){ return x(d.value); })
      .attr('cy', function(){ return height/2; })
      .attr("fill", function(d) { return colors(d.health); })
      // .attr("stroke", "rgba(0,0,0,.2)")
      // .attr("stroke-width", 1)

      // Start force layout
      let simulation = d3.forceSimulation(data)
      .force('x', d3.forceX( function(d){
        return x(d[data_setX])
      }).strength(0.99))
      .force('y', d3.forceY( height / 2 ).strength(0.99))
      .force('collide', d3.forceCollide(function(d) { 
        return size(d.kills) + 1 
      }).iterations(32))
      .alphaDecay(0)
      .alpha(0.1)
      .on('tick', tick) 

      let init_decay; 
      init_decay = setTimeout(function(){
        console.log('init alpha decay')
        simulation.alphaDecay(0.1);
      }, 5000);

    // tooltip
    d3.selectAll('.circ').on("mouseenter", function(d){


      d3.selectAll(".circ").style("opacity", 0.2)
      d3.select(this).style("opacity", 1)

      let tooltip = d3.select("#tooltip").style("opacity", 1)

      tooltip.append("p")
      .classed("info", true)
      .classed("date", true)
      .text(formatDate(d.value))
      
      tooltip.append("p")
      .classed("info", true)
      .text(d.kills + " victims")
      .attr("transform", "translate(0, " + 12 + ")")
      
      tooltip.append("p")
      .classed("info", true)
      .text("in a " + d.location + " location, ")
      .attr("transform", "translate(0, " + 24 + ")")

      tooltip.append("p")
      .classed("info", true)
      .text("by a " + d.age + " years old")
      .attr("transform", "translate(0, " + 58 + ")")

      tooltip.append("p")
      .classed("info", true)
      .text(d.race + " " + d.gender + ", ")
      .attr("transform", "translate(0, " + 70 + ")")

      tooltip.append("p")
      .classed("info", true)
      .text("mental illness: " + d.health)
      .attr("transform", "translate(0, " + 46 + ")")
    })

    d3.selectAll('.circ').on("mouseleave", function(d){

      d3.selectAll(".circ").style("opacity", 1)
      d3.select("#tooltip").style("opacity", 0)
      d3.selectAll("#tooltip p").remove()
    })

    // Draw UI buttons

    let yButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    yButtons.append('p').text('divide by').classed("button-label", true)
    yButtons.append('button').text('mental health').attr('value', 'health').classed('d_sel', true)
    yButtons.append('button').text('location type').attr('value', 'location').classed('d_sel', true)
    yButtons.append('button').text('gender').attr('value', 'gender').classed('d_sel', true)
    yButtons.append('button').text('race').attr('value', 'race').classed('d_sel', true)

    yButtons.append('button').text('X').attr('value', 'race').classed('d_del', true).classed("disabled", true)

    let xButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    xButtons.append('p').text('place by').classed("button-label", true)
    xButtons.append('button').text('perpetrator age').attr('value', 'age').classed('b_sel', true)
    xButtons.append('button').text('total victims').attr('value', 'kills').classed('b_sel', true)
    xButtons.append('button').text("date").attr('value', 'value').classed('b_sel', true).style('background','#0A0101').style("color", "white")

    // make buttons interactive, vertical categories
    d3.selectAll('.d_sel').on('click', function(){

      yButtons.selectAll('.d_del').style('opacity', 1).classed("disabled", false)
      d3.selectAll('.d_del').on('click', function(){

        let axisSelection = d3.select(".yAxis")
        .selectAll("*").remove()
        .classed("yAxis", true);

        simulation.force('y', d3.forceY( height / 2 ))

        simulation
        .alphaDecay(0.01)
        .alpha(0.5)
        .restart()

        d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
        yButtons.selectAll('.d_del').style('opacity', 0).classed("disabled", true)
      })

      d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
      d3.select(this).classed('selected', true).style('background','#EA1515')

      data_set = this.value;

      console.log(data_set)

      if (data_set === "health") {
        d3.selectAll(".spaceY").text("Stato mentale dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(healthAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Yes":
            return "Mentally ill";
            break;
            case "No":
            return "Sane";
            break;
            case "Unclear":
            return "Unclear";
            break;
            case "Unknown":
            return "Not Available";
            break;
          }
        })
      } else if(data_set === "location") {
        d3.selectAll(".spaceY").text("Tipologia di luogo dell'attentato")
        let axisSelection = d3.select(".yAxis")
        .call(locationAxis)
        .classed("yAxis", true);
        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Open":
            return "Open";
            break;
            case "Open+Close":
            return "Open and close";
            break;
            case "Close":
            return "Close";
            break;
            case "na":
            return "Not Available";
            break;
          }
        })
      }else if(data_set === "gender") {
        d3.selectAll(".spaceY").text("Genere dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(genderAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Male":
            return "Male";
            break;
            case "Female":
            return "Female";
            break;
            case "Male/Female":
            return "Both";
            break;
            case "Unknown":
            return "Not Available";
            break;
          }
        })
      }else {
        d3.selectAll(".spaceY").text("Etnia dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(raceAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "White":
            return "White";
            break;
            case "Asian":
            return "Asian";
            break;
            case "Asian American":
            return "Asian American";
            break;
            case "Black":
            return "Black";
            break;
            case "Latino":
            return "Latino";
            break;
            case "Native":
            return "Native";
            break;
            case "Other":
            return "Other";
            break;
            case "Unknown":
            return "Not Available";
            break;
          }
        })
      }

      simulation.force('y', d3.forceY(function(d){

        if (data_set === "location"){
          return y2(d[data_set])
        }else if(data_set === "health"){
          return y3(d[data_set])
        }else if(data_set === "gender"){
          return y4(d[data_set])
        }else {
          return y5(d[data_set])
        }
      }))

      simulation.force('collide', d3.forceCollide(function(d) { 
        return size(d.kills) + 1 
      }).iterations(32))

      simulation
      .alphaDecay(0)
      .alpha(0.5)
      .restart()

    })

    // make buttons interactive, horizontal values
    d3.selectAll('.b_sel').on('click', function(){

      d3.selectAll('.b_sel').classed('selected', false).style('background','transparent').style("color", "#0A0101")
      d3.select(this).classed('selected', true).style('background','#0A0101').style("color", "white")

      data_setX = this.value;

      console.log(data_setX)

      if (data_setX === "value") {
        d3.selectAll(".spaceX").text("data dell'evento")
        d3.select(".xAxis")
        .call(dateAxis)
        .classed("xAxis", true);
      }else if(data_setX === "age") {
        d3.selectAll(".spaceX").text("età dell'attentatore")
        d3.select(".xAxis")
        .call(ageAxis)
        .classed("xAxis", true);
      }else {
        d3.selectAll(".spaceX").text("numero di vittime")
        d3.select(".xAxis")
        .call(killAxis)
        .classed("xAxis", true);
      }

      simulation.force('x', d3.forceX(function(d){
        if (data_setX === "value"){
          return x(d[data_setX])
        }else if(data_setX === "kills"){
          return x2(d[data_setX])
        }else {
          return x1(d[data_setX])
        }
      }))

      simulation
      .alphaDecay(0)
      .alpha(0.5)
      .restart()
    })

  })

/////////////////// Map

let margin = 10,
mapWidth = d3.selectAll("#map").node().getBoundingClientRect().width,
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

    let colorLegend = d3.scaleLinear()
    .interpolate(d3.interpolateRgb)
    .range([d3.rgb("#a6adac"), d3.rgb('#EA1515')])
    .domain([0,200]);

    d3.json("data/us.json", function(error, us) {

      projection.scale([mapWidth * 1.5])
      .translate([mapWidth / 2, mapHeight / 2])

      map.append("path")
      .attr("class", "states")
      .datum(topojson.feature(us, us.objects.states))
      .attr("d", path);

      d3.tsv("data/geo.tsv", function(error, data) {
        if (error) throw error;

        colorScale.domain(d3.extent(data, d => { 
          return +d.year; }
          ));

    // console.log(JSON.stringify(data, null, "\t"));

    // Legenda
    let colorKey = mapSvg.append("g")
    .classed("legend", true)
    .attr("transform", "translate(" + ( margin * 4 ) + "," + ( mapHeight - 5 * margin ) + ")");

    colorKey.append("text")
    .text("Year of the event")
    .classed("label", true)
    .attr("x", 0)
    .attr("y", 0);

    colorKey.selectAll("legend")
    .data(d3.range(200), function(d) { })
    .enter().append("rect")
    .classed(".scale", true)
    .attr("x", function(d, i) { return i; })
    .attr("y", 6)
    .attr("height", 10)
    .attr("width", 2)
    .style("fill", function(d, i ) { return colorLegend(d); });

    colorKey.append("text")
    .text("1966")
    .classed("label", true)
    .attr("x", 0)
    .attr("y", 31);

    colorKey.append("text")
    .text("2017")
    .classed("label", true)
    .attr("x", 173)
    .attr("y", 31);

    map.selectAll("circle")
    .data(data)
    .enter()
    .filter(function(d) { return d.year < 2018 })
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

/////////////////// Famous events

// initializzazione delle variabili
let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([4,35]);

// caricamento dataset
d3.tsv("data/celeberrimi.tsv", function(error, data) {
	if (error) throw error;

	sizeGlyph.domain(d3.extent(data, function(d) { 
		return +d.kills; }
		));

	// databinding sui div degli eventi
	let container = celebSel.selectAll(".event")
	.data(data)
	.enter()
	.append("div")
	.classed("event", true)

	// creazione glifo in SVG
	let glyph = container.append("svg")
	.attr("width", 100)
	.attr("height", 120)
	.classed("glyph", true)

	// morti
	glyph.append("circle")
	.attr("cx", 35)
	.attr("cy", function(d) { return sizeGlyph(d.kills) + 2 })
	.attr("r", function(d) { return sizeGlyph(d.kills) })
	.attr("fill", function(d) { return colors(d.health) })
	.classed("highEvents", true)

	// disegno delle linee per il numero di armi utilizzate
	d3.selectAll(".event").each(function(d, o) {
		let thisSvg = d3.select(this).select('svg');

		for ( let i = 1; i <= +d.guns; i++) {

			thisSvg.append("line")
			.attr("x1", 25)
			.attr("x2", 35)
			.attr("y1", i*3.6)
			.attr("y2", i*3.6)
			.attr("stroke", "#0A0101")
			.attr("stroke-width", 1.5);

		}

	})

	// data nel div
	container.append("p")
	.classed("year", true)
	.text(function(d) {
		return d.year
	})

	// gender nel div
	container.append("p")
	.classed("gender", true)
	.text(function(d) {
		if(d.gender === "Male") {
			return "M"
		// } else if(d.gender === "Male/Female") {
		// 	return "M & F"
		} else {
			return "F"
		}
	})
	.attr("fill", "black")

	// stato finale dei perpetrators
	container.append("p")
	.style("opacity", function(d) {
		switch(d.state){
			case "unknown":
			return 0.3;
			default:
			return 1;
		}
	})
	.classed("state", true)
	.text(function(d){
		switch(d.state){
			case "killed":
			return "×";
			break;
			case "suicide":
			return "•";
			break;
			case "arrested":
			return "#";
			break;
			case "unknown":
			return "?";
			break;
			case "escaped":
			return "~";
			break;
		} 
	})
	
	// location negli USA
	container.append("p")
	.classed("location", true)
	.text(function(d) {
		return d.location
	})

	container.append("p")
	.text(function(d) {
		return d.title
	})

	// interazioni desktop
	d3.selectAll('.event').on("mouseenter", function(d){


		d3.selectAll(".event").style("opacity", 0.1)
		d3.select(this).style("opacity", 1)

		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people using an arsenal of " + d.guns + " gun(s)")
	})

	d3.selectAll('.event').on("mouseleave", function(d){

		d3.selectAll(".event").style("opacity", 1)
		
		d3.select("#details")
		.style("opacity", 1)
		.text("")
	})

	// interazioni touch
	d3.selectAll('.event').on("touchstart", function(d){

		d3.selectAll(".event").style("opacity", 0.2)
		d3.select(this).style("opacity", 1)
		
		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people using " + d.guns + "guns")
	})

	d3.selectAll('.event').on("touchend", function(d){

		d3.selectAll(".event").style("opacity", 1)
		
		d3.select("#details")
		.style("opacity", 1)
		.text("")
	})
	
})

/////////////////// Legislations

let billsWidth = d3.selectAll("#legislations-timeline").node().getBoundingClientRect().width,
billsHeight = 50,
billsPadding = window.innerWidth * 0.08;

let parseTimeline = d3.timeParse("%Y");

let timeline = d3.scaleTime()
.range([0 + billsPadding, billsWidth - billsPadding]);

let typology = d3.scalePoint()
.domain(["act","bill","extra","law","none"])
.range([30, billsHeight - 0])

let order = d3.scaleLinear()
.domain([1,3])
.range([billsHeight - 30, 5])

let locality = d3.scaleOrdinal()
.domain(["Act","Bill","Event"])
.range(["#010A0A","#999999","#FFFFFF"])

let timelineAxis = d3.axisBottom(timeline).ticks(10)
.tickFormat(d3.timeFormat("%Y"))
.tickSize(billsHeight - 20);

let bills = d3.select('#legislations-timeline').append('svg')
.attr("width", billsWidth)
.attr("height", billsHeight);

let g = bills.append("g");

let billsTooltip = d3.select('.bills-tooltip');

d3.tsv("data/legislations.tsv", function(error, data) {
	if (error) throw error;

	timeline.domain(d3.extent(data, function(d) { 
		d.year = parseTimeline(d.year);
		return d.year;
	}));

	bills.append("g")
	.call(timelineAxis)
	.classed("timelineAxis", true);

	g.append("rect")
	.attr("width", billsWidth)
	.attr("height", billsHeight)
	.classed("escape", true)
	.attr("opacity", "0");

	bills.selectAll("rect")
	.data(data)
	.enter()
	.append("rect")
	.attr("x", d => { return timeline(+d.year) - ( (billsWidth - billsPadding) / 54 ) / 2})
	.attr("y", d => { return order(d.id)})
	.attr("width", (billsWidth - billsPadding) / 54)
	.attr("height", 7)
	.attr("fill", d => { return locality(d.type)})
	.style("stroke", "black")
	.style("stroke-width", 1)
	.classed("bills", true)

	d3.selectAll('.bills').on("click", function(d){

		billsTooltip.selectAll("p").remove()

		d3.select(".escape").classed("active", true)

		d3.selectAll(".bills").attr("fill", "rgba(0,0,0,0)")
		d3.select(this).attr("fill", d => { return locality(d.type)})

		billsTooltip.append("p")
		.classed("code", true)
		.text(d.code + ", " + d.where + " " + d.type)

		billsTooltip.append("p")
		.classed("summary", true)
		.text(d.info)

		$(".bills-tooltip").animate({
			height: 170
		}, 600, "easeOutCubic" );
	});


	d3.selectAll(".escape").on("click", function(d){

		billsTooltip.selectAll("p").remove()

		d3.select(".escape").classed("active", false)

		d3.selectAll(".bills").attr("fill", d => { return locality(d.type)})

		$(".bills-tooltip").animate({
			height: 0
		}, 600, "easeOutCubic" );
	});

// console.log(JSON.stringify(data, null, "\t"));

});

/////////////////// Bloodstream

let bloodstream = d3.select("#bloodstream").append("svg")
.attr("width", billsWidth)
.attr("height", 150);

let stream = bloodstream.append("g");

let bloodtimeAxis = d3.axisBottom(timeline).ticks(10)
.tickFormat(d3.timeFormat("%Y"))
.tickSize(130);

d3.csv('data/bloodstream.csv', function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.year = +d.year;
    d.fat = +d.fat;
    d.inj = +d.inj;
  });


  let keys = (["inj", "fat"]);


  let stack = d3.stack()
  .keys(keys)

  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetZero);

  let series = stack(data);

          //set the axis span to fit the data
          let x = d3.scaleLinear()
          .domain(d3.extent(data, function(d) {
            d.year = parseTimeline(d.year);
            d.year = +d.year;
            return d.year;
          }))
          .range([billsPadding, billsWidth - billsPadding]);

          let xAxis = d3.axisBottom(x);

          let y = d3.scaleLinear()
          .domain([0, d3.max(series, function(layer) {
            return d3.max(layer, function(d) {
              return d[0] + d[1];
            });
          })])
          .range([5, 250]);

          let victimAxis = d3.axisLeft(y).ticks(4).tickSize(billsWidth - window.innerWidth * 0.15).tickPadding(10);

          // console.log(y.domain())

          //set colors
          let z = d3.scaleOrdinal()
          .range(["#EA1515", "#AA0F0F"]);

          //convert bounding lines into areas
          let area = d3.area()
          .x(function(d) {
              // console.info('in area function', d);
              // console.log(d.data.year);
              return timeline(d.data.year);
            })
          .y0(function(d) {
            return y(d[0]);
          })
          .y1(function(d) {
            return y(d[1]);
          })
          .curve(d3.curveCatmullRom);

          //append the paths and fill in the areas
          stream.selectAll("path")
          .data(series)
          .enter().append("path")
          .attr("d", area)
          .style("fill", function() {
            return z(Math.random());
          });

          //append the x axis
          stream.append("g")
          .call(bloodtimeAxis)
          .classed("timelineAxis", true);

          //append the x axis
          stream.append("g")
          .call(victimAxis)
          .attr("transform", "translate(" + (billsWidth - billsPadding ) + ",0)")
          .classed("bloodAxis", true);

        });

});
