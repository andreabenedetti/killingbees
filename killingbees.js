let width = window.innerWidth-17,
height = 600,
padding = 50; 

let svg = d3.select('#killingbees').append('svg')
.attr('width', width)
.attr('height', height)

    // parse values in dataset
    let parseDate = d3.timeParse("%Y-%m-%d");
    let formatDate = d3.timeFormat("%Y");

    // various scales, could be optimized
    let colors = d3.scaleOrdinal()
    .domain(["Yes", "No", "Unknown", "Unclear"])
    // .range(["#f44e38","#7a7a7a","#FFFFFF","#d3d3d3"]);
    .range(["crimson","royalblue","#FFFFFF","#869DE0"]);

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
    .range([2,30]);

    // Assi
    let killAxis = d3.axisBottom(x2).tickFormat(d3.format(".0s")).tickSize(height - (padding * 0.3));
    let ageAxis = d3.axisBottom(x1)
    .tickSize(height - (padding * 0.3));
    let dateAxis = d3.axisBottom(x).ticks(20)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSize(height - (padding * 0.3));

    let locationAxis = d3.axisLeft(y2).ticks().tickSize(width - (3.5*padding)).tickPadding(20);
    let healthAxis = d3.axisLeft(y3).ticks().tickSize(width - (3.5*padding)).tickPadding(20);
    let genderAxis = d3.axisLeft(y4).ticks().tickSize(width - (3.5*padding)).tickPadding(20);
    let raceAxis = d3.axisLeft(y5).ticks().tickSize(width - (3.5*padding)).tickPadding(20);

    // starting visualization with:
    let data_set = "health";
    let data_setX = "value";

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

      size.domain(d3.extent(data, function(d) { 

        return d.kills; }

        ));

      // start ticks for animations and transitions

      function tick(){

        d3.selectAll('.circ')
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})

      };

      // Draw axes

      svg.append("g")
      .call(dateAxis)
      .classed("xAxis", true);

      svg.append("g")
      .attr("transform","translate(" + ( width - padding ) + ",0)")
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
        return x(d[data_setX])
      }).strength(0.99))
      .force('y', d3.forceY( height / 2 ).strength(0.99))
      .force('collide', d3.forceCollide(function(d) { 
        return size(d.kills) + 1 
      }).iterations(32))
      .alphaDecay(0)
      .alpha(0.1)
      .on('tick', tick) 

      let init_decay; 
      init_decay = setTimeout(function(){
        console.log('init alpha decay')
        simulation.alphaDecay(0.1);
      }, 5000);

    // tooltip
    d3.selectAll('.circ').on("mouseenter", function(d){


      d3.selectAll(".circ").style("opacity", 0.2)
      d3.select(this).style("opacity", 1)

      let tooltip = svg.append("g")
      .classed("box", true)
      .attr("transform", "translate(" + ( d.x ) + ", " + ( d.y + 25 ) + ")")
      .attr("width", 100)
      .attr("height", 80)
      .style("background", "white")

      tooltip.append("text")
      .classed("info", true)
      .classed("date", true)
      .text(formatDate(d.value))
      
      tooltip.append("text")
      .classed("info", true)
      .text(d.kills + " vittime")
      .attr("transform", "translate(0, " + 12 + ")")

      
      tooltip.append("text")
      .classed("info", true)
      .text("svolto " + d.location)
      .attr("transform", "translate(0, " + 24 + ")")

      tooltip.append("text")
      .classed("info", true)
      .text(d.health)
      .attr("transform", "translate(0, " + 46 + ")")

      tooltip.append("text")
      .classed("info", true)
      .text(d.age + " anni")
      .attr("transform", "translate(0, " + 58 + ")")

      tooltip.append("text")
      .classed("info", true)
      .text(d.race)
      .attr("transform", "translate(0, " + 70 + ")")
    })

    d3.selectAll('.circ').on("mouseleave", function(d){

      d3.selectAll(".circ").style("opacity", 1)
      d3.selectAll(".box").remove()
    })

    // Draw UI buttons

    let yButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    yButtons.append('p').text('dividi per')
    yButtons.append('button').text('stato mentale').attr('value', 'health').classed('d_sel', true)
    yButtons.append('button').text('tipologia di luogo').attr('value', 'location').classed('d_sel', true)
    yButtons.append('button').text('genere').attr('value', 'gender').classed('d_sel', true)
    yButtons.append('button').text('etnia').attr('value', 'race').classed('d_sel', true)

    yButtons.append('button').text('X').attr('value', 'race').classed('d_del', true).classed("disabled", true)

    let xButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    xButtons.append('p').text('distribuisci per')
    xButtons.append('button').text('età').attr('value', 'age').classed('b_sel', true)
    xButtons.append('button').text('vittime totali').attr('value', 'kills').classed('b_sel', true)
    xButtons.append('button').text("data dell'attentato").attr('value', 'value').classed('b_sel', true).style('background','navy').style("color", "white")

    // make buttons interactive, vertical categories
    d3.selectAll('.d_sel').on('click', function(){

      yButtons.selectAll('.d_del').style('opacity', 1).classed("disabled", false)
      d3.selectAll('.d_del').on('click', function(){

        let axisSelection = d3.select(".yAxis")
        .selectAll("*").remove()
        .classed("yAxis", true);

        simulation.force('y', d3.forceY( height / 2 ))

        simulation
        .alphaDecay(0.01)
        .alpha(0.5)
        .restart()

        d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
        yButtons.selectAll('.d_del').style('opacity', 0).classed("disabled", true)
      })

      d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
      d3.select(this).classed('selected', true).style('background','crimson')

      data_set = this.value;

      console.log(data_set)

      if (data_set === "health") {
        d3.selectAll(".spaceY").text("Stato mentale dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(healthAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Yes":
            return "malato";
            break;
            case "No":
            return "sano";
            break;
            case "Unclear":
            return "incerto";
            break;
            case "Unknown":
            return "non disponibile";
            break;
          }
        })
      } else if(data_set === "location") {
        d3.selectAll(".spaceY").text("Tipologia di luogo dell'attentato")
        let axisSelection = d3.select(".yAxis")
        .call(locationAxis)
        .classed("yAxis", true);
        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Open":
            return "all'aperto";
            break;
            case "Open+Close":
            return "aperto e chiuso";
            break;
            case "Close":
            return "al chiuso";
            break;
            case "na":
            return "non disponibile";
            break;
          }
        })
      }else if(data_set === "gender") {
        d3.selectAll(".spaceY").text("Genere dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(genderAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Male":
            return "uomo";
            break;
            case "Female":
            return "donna";
            break;
            case "Male/Female":
            return "uomo e donna";
            break;
            case "Unknown":
            return "non disponibile";
            break;
          }
        })
      }else {
        d3.selectAll(".spaceY").text("Etnia dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(raceAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "White":
            return "Caucasici";
            break;
            case "Asian":
            return "Asiatici";
            break;
            case "Asian American":
            return "Asiatici Americani";
            break;
            case "Black":
            return "Afro Americani";
            break;
            case "Latino":
            return "Latini";
            break;
            case "Native":
            return "Nativi";
            break;
            case "Other":
            return "altro";
            break;
            case "Unknown":
            return "non disponibile";
            break;
          }
        })
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

      simulation.force('collide', d3.forceCollide(function(d) { 
        return size(d.kills) + 1 
      }).iterations(32))

      simulation
      .alphaDecay(0)
      .alpha(0.5)
      .restart()

    })

    // make buttons interactive, horizontal values
    d3.selectAll('.b_sel').on('click', function(){

      d3.selectAll('.b_sel').classed('selected', false).style('background','transparent').style("color", "navy")
      d3.select(this).classed('selected', true).style('background','navy').style("color", "white")

      data_setX = this.value;

      console.log(data_setX)

      if (data_setX === "value") {
        d3.selectAll(".spaceX").text("data dell'evento")
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
      .alpha(0.5)
      .restart()
    })

  })