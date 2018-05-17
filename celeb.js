let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([6,32]);

let raceColor = d3.scaleOrdinal()
.domain(["White", "Black", "Asian", "Other"])
.range(["#FED0BB", "#0A0101", "#ECE4B7", "snow"])

d3.tsv("sample.tsv", function(error, data) {
	if (error) throw error;

	console.log(data)

	sizeGlyph.domain(d3.extent(data, function(d) { 
		return +d.kills; }
	));
	
	let container = celebSel.selectAll(".event")
	.data(data)
	.enter()
	.append("div")
	.classed("event", true)

	let glyph = container.append("svg")
	.attr("width", 100)
	.attr("height", 100)
	.classed("glyph", true)

	glyph.append("circle")
	.attr("cx", 35)
	.attr("cy", function(d) { return sizeGlyph(d.kills) + 2 })
	.attr("r", function(d) { return sizeGlyph(d.kills) })
	.attr("fill", function(d) { return colors(d.health) })
	.classed("highEvents", true)
	.attr("stroke", "rgba(0, 0, 0, .5)")
	.attr("stroke-width", 1)

	// let gender = glyph.append("g")
	// .attr("transform", function(d) {
	// 	if (d.gender === "Male") {
	// 		return "translate(29.9,10)";
	// 	}else {
	// 		return "translate(35,10)"
	// 	}
	// })

	// gender.append("rect")
	// .style("transform-origin","0px 0px 0")
	// .attr("width", function(d) {
	// 	if (d.gender === "Male") {
	// 		return Math.sqrt(100 + 100) - 4
	// 	}else {
	// 		return 10
	// 	}
	// })
	// .attr("height", function(d) {
	// 	if (d.gender === "Male") {
	// 		return Math.sqrt(100 + 100) - 4
	// 	}else {
	// 		return 10
	// 	}
	// })
	// .attr("fill", function(d) { return raceColor(d.race) })
	// .attr("stroke", "black")
	// .attr("stroke-width",0.5)
	// .attr("transform", function(d) {
	// 	if (d.gender === "Female" || d.gender === "Male/Female") {
	// 		return "rotate(45)";
	// 	}
	// })

	// glyph.append("text")
	// .attr("x", 29)
	// .attr("y", 35)
	// .classed("gender", true)
	// .text(function(d) {
	// 	if(d.gender === "Male") {
	// 		return "M"
	// 	} else if(d.gender === "Male/Female") {
	// 		return "B"
	// 	} else {
	// 		return "F"
	// 	}
	// })
	// .attr("fill", "black")

	container.append("p")
	.classed("year", true)
	.text(function(d) {
		return d.year
	})

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
            return "†";
            break;
            case "arrested":
            return "※";
            break;
            case "unknown":
            return "?";
            break;
            case "escaped":
            return "⁀";
            break;
          }
	})
	
	container.append("p")
	.classed("location", true)
	.text(function(d) {
		return d.location
	})

	container.append("p")
	.text(function(d) {
		return d.title
	})


	d3.selectAll('.event').on("mouseenter", function(d){

		d3.selectAll(".event").style("opacity", 0.2)
		d3.select(this).style("opacity", 1)
		
		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people.")
	})

	d3.selectAll('.event').on("mouseleave", function(d){

		d3.selectAll(".event").style("opacity", 1)
		
		d3.select("#details")
		.style("opacity", 1)
		.text("")
	})

	d3.selectAll('.event').on("touchstart", function(d){

		d3.selectAll(".event").style("opacity", 0.2)
		d3.select(this).style("opacity", 1)
		
		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people.")
	})

	d3.selectAll('.event').on("touchend", function(d){

		d3.selectAll(".event").style("opacity", 1)
		
		d3.select("#details")
		.style("opacity", 1)
		.text("")
	})
	
})