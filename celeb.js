let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([2,32]);

let count = 1;

d3.tsv("sample.tsv", function(error, data) {
	if (error) throw error;

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

	let gender = glyph.append("g")
	.attr("transform", function(d) {
		if (d.gender === "Male") {
			return "translate(31.5,20)";
		}else {
			return "translate(35,20)"
		}
	})

	gender.append("rect")
	.style("transform-origin","0px 0px 0")
	.attr("width", function(d) {
		if (d.gender === "Male") {
			return Math.sqrt(25 + 25)
		}else {
			return 7
		}
	})
	.attr("height", function(d) {
		if (d.gender === "Male") {
			return Math.sqrt(25 + 25)
		}else {
			return 7
		}
	})
	.attr("fill", "#0A0101")
	.attr("transform", function(d) {
		if (d.gender === "Female" || d.gender === "Male & Female") {
			return "rotate(45)";
		}
	})

	d3.selectAll(".event").each(function(d, o) {
		let thisSvg = d3.select(this).select('svg');

		for ( let i = 1; i <= +d.guns; i++) {

			thisSvg.append("line")
			.attr("x1", 15)
			.attr("x2", 30)
			.attr("y1", i*4.5)
			.attr("y2", i*4.5)
			.attr("stroke", "#0A0101")
			.attr("stroke-width", 1.5);

		}

		console.log(d.guns)

	})

	// glyph.each(function(d) {

	// 	for ( let i = 0; i < +d.guns; i++ ) {

	// 		glyph
	// 		.append("line")
	// 		.attr("x1", 15)
	// 		.attr("x2", 30)
	// 		.attr("y1", count*5)
	// 		.attr("y2", count*5)
	// 		.attr("r", 5)
	// 		.attr("fill", "none")
	// 		.attr("stroke", "black");

	// 		console.log(d.guns)

	// 	}

	// 	count++;
	// })

	container.append("p")
	.classed("year", true)
	.text(function(d) {
		return d.year
	})

	container.append("p")
	.classed("gender", true)
	.text(function(d) {
		if(d.gender === "Male") {
			return "M"
		} else if(d.gender === "Male/Female") {
			return "M & F"
		} else {
			return "F"
		}
	})
	.attr("fill", "black")

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
			return "※";
			break;
			case "unknown":
			return "?";
			break;
			case "escaped":
			return "~";
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


		d3.selectAll(".event").style("opacity", 0.3)
		d3.select(this).style("opacity", 1)

		console.log(d.guns)
		
		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people using an arsenal of " + d.guns)
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
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people using " + d.guns + "guns")
	})

	d3.selectAll('.event').on("touchend", function(d){

		d3.selectAll(".event").style("opacity", 1)
		
		d3.select("#details")
		.style("opacity", 1)
		.text("")
	})
	
})