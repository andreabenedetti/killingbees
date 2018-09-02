let billsWidth = d3.selectAll("#legislations-timeline").node().getBoundingClientRect().width,
billsHeight = 300,
billsPadding = 50;

let parseTimeline = d3.timeParse("%Y");

let timeline = d3.scaleTime()
.range([0 + billsPadding, billsWidth - billsPadding]);

let typology = d3.scalePoint()
.domain(["act","bill","extra","law","none"])
.range([30, billsHeight - 30])

let locality = d3.scaleOrdinal()
.domain(["federal","local","none"])
.range(["#EA1515","#9fc6c3","#FFFFFF"])

let timelineAxis = d3.axisBottom(timeline).ticks(20)
.tickFormat(d3.format(",d"))
.tickSize(billsHeight - 20);

let bills = d3.select('#legislations-timeline').append('svg')
.attr("width", billsWidth)
.attr("height", billsHeight);

d3.tsv("data/leg.tsv", function(error, data) {
	if (error) throw error;

	timeline.domain(d3.extent(data, function(d) { 
        // d.year = parseTimeline(d.year);
        d.year = +d.year;
        return d.year;
    }));

    bills.append("g")
	.call(timelineAxis)
	.classed("timelineAxis", true);

	bills.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d){ return timeline(+d.year) })
	.attr("cy", d => { return typology(d.type)})
	.attr("r", 3)
	.attr("fill", d => { return locality(d.where)})
	.style("opacity", 1)
	.classed("bills", true)

	d3.selectAll('.bills').on("mouseenter", function(d){
		console.log(d.type)
		console.log(d.info)
	});

// console.log(JSON.stringify(data, null, "\t"));

});