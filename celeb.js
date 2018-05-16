let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([5,30]);

d3.tsv("sample.tsv", function(error, data) {
	if (error) throw error;

	console.log(data)

	sizeGlyph.domain(d3.extent(data, function(d) { 
		return +d.kills; }
	));

	console.log(sizeGlyph.domain())
	
	let container = celebSel.selectAll(".event")
	.data(data)
	.enter()
	.append("div")
	.classed("event", true)

	let glyph = container.append("svg")
	.classed("glyph", true)

	glyph.append("circle")
	.attr("cx", 35)
	.attr("cy", function(d) { return size(d.kills) + 2 })
	.attr("r", function(d) { return size(d.kills) })
	.attr("fill", function(d) { return colors(d.health) })
	.classed("highEvents", true)
	.attr("stroke", "rgba(0, 0, 0, .5)")
	.attr("stroke-width", 1)

	glyph.append("text")
	.attr("x", 29)
	.attr("y", 35)
	.classed("gender", true)
	.text(function(d) {
		if(d.gender === "Male") {
			return "M"
		} else if(d.gender === "Male/Female") {
			return "B"
		} else {
			return "F"
		}
	})
	.attr("fill", "black")

	container.append("p")
	.classed("year", true)
	.text(function(d) {
		return d.year
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

})