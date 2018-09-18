let mucchi = d3.select("#mucchi").append("svg")
.attr("width", billsWidth)
.attr("height", 400)
.style("background", "white");

let weapon = d3.scalePoint()
.domain(["handgun", "rifle", "shotgun"])
.range([padding * 2, billsWidth - ( padding * 2 )])

d3.csv("data/mucchi.csv", function(error, data) {
	if (error) throw error;

	function tick(){

        d3.selectAll('.weapons')
        .attr('cx', function(d){d.x})
        .attr('cy', function(d){return d.y})

      };

	mucchi.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.classed("weapons", true)
	.attr("r",2)
	.attr("cx", function(d){ return weapon(d.weapons)} )
	.attr("cy", 200)
	.attr("fill", "black");

	let simulation = d3.forceSimulation(data)
      .force('x', d3.forceX( function(d){
        return weapon(d.weapons);
      }).strength(0.99))
      .force('y', d3.forceY( 200 ).strength(0.99))
      .force('collide', d3.forceCollide(4).iterations(32))
      .alphaDecay(0)
      .alpha(0.1)
      .on('tick', tick);

    for (var i = 0; i < 120; ++i) simulation.tick();

    	function collide() {
		for (var k = 0, iterations = 4, strength = 0.5; k < iterations; ++k) {
			for (var i = 0, n = nodes.length; i < n; ++i) {
				for (var a = nodes[i], j = i + 1; j < n; ++j) {
					var b = nodes[j],
					x = a.x + a.vx - b.x - b.vx,
					y = a.y + a.vy - b.y - b.vy,
					lx = Math.abs(x),
					ly = Math.abs(y),
					r = a.r + b.r;
					if (lx < r && ly < r) {
						if (lx > ly) {
							lx = (lx - r) * (x < 0 ? -strength : strength);
							a.vx -= lx, b.vx += lx;
						} else {
							ly = (ly - r) * (y < 0 ? -strength : strength);
							a.vy -= ly, b.vy += ly;
						}
					}
				}
			}
		}
	}

});