

			var w = 1000, h = 280;

			var padding = [0, 40, 34, 40];

			var xScale = d3.scaleLinear()
				.range([ padding[3], w - padding[1] ]);

			var xAxis = d3.axisBottom(xScale)
				.ticks(10, ".0s")
				.tickSizeOuter(0);

			var colors = d3.scaleOrdinal()
				.domain(["asia", "africa", "northAmerica", "europe", "southAmerica", "oceania"])
				.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33']);

			d3.select("#africaColor").style("color", colors("africa"));
			d3.select("#namericaColor").style("color", colors("northAmerica"));
			d3.select("#samericaColor").style("color", colors("southAmerica"));
			d3.select("#asiaColor").style("color", colors("asia"));
			d3.select("#europeColor").style("color", colors("europe"));
			d3.select("#oceaniaColor").style("color", colors("oceania"));

			var formatNumber = d3.format(",");

			var tt = d3.select("#svganchor").append("div")	
				.attr("class", "tooltip")				
				.style("opacity", 0);

			var svg = d3.select("#svganchor")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

			var xline = svg.append("line")
				.attr("stroke", "gray")
				.attr("stroke-dasharray", "1,2");

			var chartState = {};

			chartState.variable = "totalEmission";
			chartState.scale = "scaleLinear";
			chartState.legend = "Total emissions, in kilotonnes";

			d3.csv("co2bee.csv", function(error, data) {
				if (error) throw error;

				var dataSet = data;

				xScale.domain(d3.extent(data, function(d) { return +d.totalEmission; }));

				svg.append("g")
      				.attr("class", "x axis")
      				.attr("transform", "translate(0," + (h - padding[2]) + ")")
      				.call(xAxis);

      			var legend = svg.append("text")
      				.attr("text-anchor", "middle")
      				.attr("x", w / 2)
      				.attr("y", h - 4)
      				.attr("font-family", "PT Sans")
      				.attr("font-size", 12)
      				.attr("fill", "darkslategray")
      				.attr("fill-opacity", 1)
      				.attr("class", "legend");

				redraw(chartState.variable);

				d3.selectAll(".button1").on("click", function(){
					var thisClicked = this.value;
					chartState.variable = thisClicked;
					if (thisClicked == "totalEmission"){
						chartState.legend = "Total emissions, in kilotonnes";
					};
					if (thisClicked == "emissionPerCap"){
						chartState.legend = "Per Capita emissions, in metric tons";
					}
					redraw(chartState.variable);
				});

				d3.selectAll(".button2").on("click", function(){
					var thisClicked = this.value;
					chartState.scale = thisClicked;
					redraw(chartState.variable);
				});

				d3.selectAll("input").on("change", filter);

				function redraw(variable){

					if (chartState.scale == "scaleLinear"){ xScale = d3.scaleLinear().range([ padding[3], w - padding[1] ]);};

					if (chartState.scale == "scaleLog"){ xScale = d3.scaleLog().range([ padding[3], w - padding[1] ]);};

					xScale.domain(d3.extent(dataSet, function(d) { return +d[variable]; }));

					var xAxis = d3.axisBottom(xScale)
						.ticks(10, ".0s")
						.tickSizeOuter(0);

					d3.transition(svg).select(".x.axis").transition().duration(1000)
      					.call(xAxis);

					var simulation = d3.forceSimulation(dataSet)
						.force("x", d3.forceX(function(d) { return xScale(+d[variable]); }).strength(2))
				    	.force("y", d3.forceY((h / 2)-padding[2]/2))
				    	.force("collide", d3.forceCollide(4))
				    	.stop();

					for (var i = 0; i < dataSet.length; ++i) simulation.tick();

					var countriesCircles = svg.selectAll(".countries")
						.data(dataSet, function(d) { return d.countryCode});

					countriesCircles.exit()
						.transition()
				    	.duration(1000)
				    	.attr("cx", 0)
						.attr("cy", (h / 2)-padding[2]/2)
						.remove();

					countriesCircles.enter()
						.append("circle")
						.attr("class", "countries")
						.attr("cx", 0)
						.attr("cy", (h / 2)-padding[2]/2)
						.attr("r", 3)
						.attr("fill", function(d){ return colors(d.continent)})
						.merge(countriesCircles)
						.transition()
				    	.duration(2000)
				    	.attr("cx", function(d) { return d.x; })
				    	.attr("cy", function(d) { return d.y; });

					legend.text(chartState.legend);

				    d3.selectAll(".countries").on("mousemove", function(d) {
						tt.html("Country: <strong>" + d.countryName + "</strong><br>"
						+ chartState.legend.slice(0, chartState.legend.indexOf(",")) + ": <strong>" + formatNumber(d[variable]) + "</strong>" + chartState.legend.slice(chartState.legend.lastIndexOf(" ")))
							.style('top', d3.event.pageY - 12 + 'px')
							.style('left', d3.event.pageX + 25 + 'px')
							.style("opacity", 0.9);

							xline.attr("x1", d3.select(this).attr("cx"))
								.attr("y1", d3.select(this).attr("cy"))
								.attr("y2", (h - padding[2]))
								.attr("x2",  d3.select(this).attr("cx"))
								.attr("opacity", 1);

					}).on("mouseout", function(d) {
						tt.style("opacity", 0);
						xline.attr("opacity", 0);
					});

					d3.selectAll(".x.axis, .legend").on("mousemove", function(){
						tt.html("This axis uses SI prefixes:<br>m: 10<sup>-3</sup><br>k: 10<sup>3</sup><br>M: 10<sup>6</sup>")
							.style('top', d3.event.pageY - 12 + 'px')
							.style('left', d3.event.pageX + 25 + 'px')
							.style("opacity", 0.9);
					}).on("mouseout", function(d) {
						tt.style("opacity", 0);
					});

				//end of redraw
				}

				function filter(){

					function getCheckedBoxes(chkboxName) {
					  var checkboxes = document.getElementsByName(chkboxName);
					  var checkboxesChecked = [];
					  for (var i=0; i<checkboxes.length; i++) {
					     if (checkboxes[i].checked) {
					        checkboxesChecked.push(checkboxes[i].defaultValue);
					     }
					  }
					  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
					}

					var checkedBoxes = getCheckedBoxes("continent");
					
					var newData = [];

					if (checkedBoxes == null){ 
						dataSet = newData; 
						redraw(); 
						return;
					};

					for (var i = 0; i < checkedBoxes.length; i++){
						var newArray = data.filter(function(d){
							return d.continent == checkedBoxes[i];
						});
						Array.prototype.push.apply(newData, newArray);
					}

					dataSet = newData;

					redraw(chartState.variable);

				//end of filter
				}

			//end of d3.csv
			});

		