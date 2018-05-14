let width = window.innerWidth-17,
height = 600,
padding = 50; 

let svg = d3.select('#killingbees').append('svg')
.attr('width', width)
.attr('height', height)

    // parse values in dataset
    let parseDate = d3.timeParse("%Y-%m-%d");
    let formatDate = d3.timeFormat("%Y-%m-%d");

    // various scales, could be optimized
    let colors = d3.scaleOrdinal()
    .domain(["Yes", "No", "Unknown", "Unclear"])
    .range(["#f44e38","#7a7a7a","#FFFFFF","#d3d3d3"]);

    let x = d3.scaleTime()
    .range([0 + 2.5*padding, width - padding]);

    let x1 = d3.scaleLinear()
    .range([0 + 2.5*padding, width - padding]);

    let x2 = d3.scaleLog()
    .range([0 + 2.5*padding, width - padding]);


    let y0 = d3.scalePoint()
    .domain( function(d) { 
      console.log(d.data)
      return d.data } )

    let y = d3.scaleLinear()
    .range([(0 + padding)*2, height - padding * 2]);

    let y2 = d3.scalePoint()
    .domain(["Open","Open+Close","Close","na"])
    .range([0 + padding, height - padding]);

    let y3 = d3.scalePoint()
    .domain(["Yes","No","Unclear","Unknown"])
    .range([0 + padding, height - padding]);

    let y4 = d3.scalePoint()
    .domain(["Male","Female","Male/Female","Unknown"])
    .range([0 + padding, height - padding]);

    let y5 = d3.scalePoint()
    .domain(["White","Asian","Asian American","Black","Latino","Native","Other","Unknown"])
    .range([0 + padding, height - padding]);

    let size = d3.scaleSqrt()
    .range([0,1.2]);

    // Assi
    let killAxis = d3.axisBottom(x2).tickFormat(d3.format(".0s")).tickSize(height - (padding * 0.3));
    let ageAxis = d3.axisBottom(x1)
    .tickSize(height - (padding * 0.3));
    let dateAxis = d3.axisBottom(x).ticks(20)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSize(height - (padding * 0.3));

    let locationAxis = d3.axisLeft(y2).ticks().tickSize(width - (3.5*padding));
    let healthAxis = d3.axisLeft(y3).ticks().tickSize(width - (3.5*padding));
    let genderAxis = d3.axisLeft(y4).ticks().tickSize(width - (3.5*padding));
    let raceAxis = d3.axisLeft(y5).ticks().tickSize(width - (3.5*padding));

    // starting visualization with:
    let data_set = "race";
    let data_setX = "kills";

    // Parse dataset

    d3.csv("shootings.csv", function(error, data) {
      if (error) throw error;

      x.domain(d3.extent(data, function(d) { 
        d.value = parseDate(d.value);
        d.value = +d.value;
        return d.value;

      }));

      x1.domain(d3.extent(data, function(d) { 
        d.age = +d.age;
        return d.age;
      }));

      x2.domain(d3.extent(data, function(d) { 
        d.kills = +d.kills;
        return d.kills;
      }));

      // console.log(JSON.stringify(data, null, "\t"));

      y.domain(d3.extent(data, function(d) { 
        d.lat = +d.lat;
        return d.lat; }

        ));

      // start ticks for animations and transitions

      function tick(){

        d3.selectAll('.circ')
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})

      };

      // Draw axes

      svg.append("g")
      .call(killAxis)
      .classed("xAxis", true);

      svg.append("g")
      .attr("transform","translate(" + ( width - padding ) + ",0)")
      .call(raceAxis)
      .classed("yAxis", true);

      // Draw circles

      svg.selectAll('.circ')
      .data(data)
      .enter().append('circle').classed('circ', true)
      .attr('r', function(d) { return size(d.kills) })
      .attr('cx', function(d){return x(d.value);})
      .attr('cy', function(){return height/2;})
      .attr("fill", function(d) { return colors(d.health); })
      .attr("stroke", "rgba(0,0,0,.45)")
      .attr("stroke-width", 1)

      // Start force layout
      let simulation = d3.forceSimulation(data)
      .force('x', d3.forceX( function(d){
        return x2(d[data_setX])
      }).strength(0.99))
      .force('y', d3.forceY( function(d){
        return y5(d[data_set])
      }).strength(0.99))
      .force('collide', d3.forceCollide(function(d) { 
        return size(d.kills) + 1 
      })
      .iterations(16))
      .alphaDecay(0)
      .alpha(0.12)
      .on('tick', tick) 

      let init_decay; 
      init_decay = setTimeout(function(){
        console.log('init alpha decay')
        simulation.alphaDecay(0.1);
      }, 10000);

    // Draw UI buttons

    let yButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    yButtons.append('button').text('Stato mentale').attr('value', 'health').classed('d_sel', true)
    yButtons.append('button').text('Tipologia di luogo').attr('value', 'location').classed('d_sel', true)
    yButtons.append('button').text('Genere').attr('value', 'gender').classed('d_sel', true)
    yButtons.append('button').text('Etnia').attr('value', 'race').classed('d_sel', true)

    let xButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    xButtons.append('button').text('Età').attr('value', 'age').classed('b_sel', true)
    xButtons.append('button').text('Vittime totali').attr('value', 'kills').classed('b_sel', true)
    xButtons.append('button').text('Linea del tempo').attr('value', 'value').classed('b_sel', true)


    // make buttons interactive, vertical categories
    d3.selectAll('.d_sel').on('click', function(){

      data_set = this.value;

      console.log(data_set)

      if (data_set === "health") {
        d3.selectAll(".spaceY").text("Stato mentale dell'attentatore")
        d3.select(".yAxis")
          .call(healthAxis)
          .classed("yAxis", true);
      } else if(data_set === "location") {
        d3.selectAll(".spaceY").text("Tipologia di luogo dell'attentato")
        d3.select(".yAxis")
          .call(locationAxis)
          .classed("yAxis", true);
      }else if(data_set === "gender") {
        d3.selectAll(".spaceY").text("Genere dell'attentatore")
        d3.select(".yAxis")
          .call(genderAxis)
          .classed("yAxis", true);
      }else {
        d3.selectAll(".spaceY").text("Etnia dell'attentatore")
        d3.select(".yAxis")
          .call(raceAxis)
          .classed("yAxis", true);
      }

      simulation.force('y', d3.forceY(function(d){

        if (data_set === "location"){
          return y2(d[data_set])
        }else if(data_set === "health"){
          return y3(d[data_set])
        }else if(data_set === "gender"){
          return y4(d[data_set])
        }else {
          return y5(d[data_set])
        }
      }))

      simulation
      .alphaDecay(0)
      .alpha(0.12)
      .restart()

      clearTimeout(init_decay);

      init_decay = setTimeout(function(){
        console.log('init alpha decay');
        simulation.alphaDecay(0.1);
      }, 10000);
    })

    // make buttons interactive, horizontal values
    d3.selectAll('.b_sel').on('click', function(){

      data_setX = this.value;

      console.log(data_setX)

      if (data_setX === "value") {
        d3.selectAll(".spaceX").text("giorno dell'evento")
        d3.select(".xAxis")
          .call(dateAxis)
          .classed("xAxis", true);
      }else if(data_setX === "age") {
        d3.selectAll(".spaceX").text("età dell'attentatore")
        d3.select(".xAxis")
          .call(ageAxis)
          .classed("xAxis", true);
      }else {
        d3.selectAll(".spaceX").text("numero di vittime")
        d3.select(".xAxis")
          .call(killAxis)
          .classed("xAxis", true);
      }

      simulation.force('x', d3.forceX(function(d){
        if (data_setX === "value"){
          return x(d[data_setX])
        }else if(data_setX === "kills"){
          return x2(d[data_setX])
        }else {
          return x1(d[data_setX])
        }
      }))

      simulation
      .alphaDecay(0)
      .alpha(0.12)
      .restart()

      clearTimeout(init_decay);

      init_decay = setTimeout(function(){
        console.log('init alpha decay');
        simulation.alphaDecay(0.1);
      }, 10000);
    })

  })