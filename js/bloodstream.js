// //get and size the svg element
// let width = document.getElementById('#legislations-timeline').offsetWidth;
// width = width * .9;
// let plotSvg = document.getElementById('plotSvg');
// plotSvg.setAttribute("width", width);
// let height = Math.round(width / 2);
// plotSvg.setAttribute("height", height);

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