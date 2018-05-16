let celebSel = d3.select("#celeb")

let eventDate = d3.timeParse("%Y");

let sizeGlyph = d3.scaleSqrt()
.range([3,30]);

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
	.attr("cy", function(d) { return sizeGlyph(d.kills) })
	.attr("r", function(d) { return sizeGlyph(d.kills) })
	.attr("fill", function(d) { return colors(d.health) })
	.classed("highEvents", true)
	.attr("stroke", "rgba(0,0,0,.5)")
	.attr("stroke-width", 1)

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