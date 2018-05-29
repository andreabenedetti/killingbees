// initializzazione delle variabili
let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([4,35]);

// caricamento dataset
d3.tsv("data/sample.tsv", function(error, data) {
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
		} else if(d.gender === "Male/Female") {
			return "M & F"
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


		d3.selectAll(".event").style("opacity", 0.3)
		d3.select(this).style("opacity", 1)

		d3.select("#details")
		.text(d.perpetrator + ", " + d.gender + ", injured and killed " + d.kills + " people using an arsenal of " + d.guns)
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