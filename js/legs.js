let billsWidth = d3.selectAll("#legislations-timeline").node().getBoundingClientRect().width,
billsHeight = 250,
billsPadding = 100;

let parseTimeline = d3.timeParse("%Y");

let timeline = d3.scaleTime()
.range([0 + billsPadding, billsWidth - billsPadding]);

let typology = d3.scalePoint()
.domain(["act","bill","extra","law","none"])
.range([30, billsHeight - 0])

let order = d3.scaleLinear()
.domain([1,33])
.range([billsHeight - 30, 15])

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
	.attr("x", d => { return timeline(+d.year) - 3 })
	.attr("y", d => { return order(d.id)})
	.attr("width", 7)
	.attr("height", 7)
	.attr("fill", d => { return locality(d.type)})
	.style("opacity", 1)
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