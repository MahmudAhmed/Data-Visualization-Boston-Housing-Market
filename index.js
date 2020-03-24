document.addEventListener("DOMContentLoaded", ()=> {
  const chart = document.getElementById("chart");
  let circles, xScale, yScale, rScale;
  const margin = 30, rValues = [2,15];
  let svg = d3.select("#chart")
    .append('svg')
    .attr('width', "100%")
    .attr('height', "100%")
  
  const chartWidth = parseInt(window.getComputedStyle(chart).width);
  const chartHeight = parseInt(window.getComputedStyle(chart).height);

  d3.csv('boston-housing.csv').then( (data) => {
    data = data.sort( (a,b) => a.charles - b.charles )
    const xMinMax = d3.extent(data, (d) => parseFloat(d.poor));
    const yMinMax = d3.extent(data, (d) => parseFloat(d.rooms));
    const rMinMax = d3.extent(data, (d) => parseFloat(d.value));

    xScale = d3.scaleLinear()
      .domain([xMinMax[1], xMinMax[0]])
      .range([margin + rValues[1] + 5, chartWidth - margin - rValues[1] - 5]);

    yScale = d3.scaleLinear()
      .domain([yMinMax[1], yMinMax[0]])
      .range([margin + rValues[1], chartHeight - margin - rValues[1]]);
    
    rScale = d3.scaleLinear()
      .domain([rMinMax[0], rMinMax[1]])
      .range(rValues);

    const cScale = d3.scaleOrdinal()
      .domain([0, 1])
      .range(['#333', '#F53005']); 

    circles = svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.poor))
      .attr('cy', d => yScale(d.rooms))
      .attr('r', 0)
      .attr('fill', (d) => cScale(d.charles))
      .style('opacity', (d)=> {
        return d.charles === '1' ? 1 : 0.3
      })
      .on('mouseover', function (d) {
        info = 'X | poor: ' + d.poor + '<br />';
        info += 'Y | rooms: ' + d.rooms + '<br />';
        info += 'R | value: ' + d.value + '<br />';
        info += 'C | charles: ' + d.charles;
        d3.select('#tooltip')
          .html(info)
          .style('left', `${d3.event.pageX - 100}px`)
          .style('top', `${d3.event.pageY - 150}px`)
          .style('opacity', 0.85);
      })
      .on('mouseout', function () {
        d3.select('#tooltip')
          .style('opacity', 0);
      });

    const xAxis = d3.axisBottom(xScale).ticks(0);
    const yAxis = d3.axisLeft(yScale).tickValues(yMinMax);
    
    const xAxisG = svg.append('g')
      .attr("id", 'xAxis')
      .attr("class", 'axis')
      .call(xAxis)
      .attr("transform", `translate(0,${chartHeight - margin})`);

    const yAxisG = svg.append('g')
      .attr("id", 'yAxis')
      .attr("class", 'axis')
      .call(yAxis)
      .attr("transform", `translate(${margin}, 0)`)

    svg.append('text')
      .attr('x', xScale(xMinMax[0]))
      .attr('y', yScale(yMinMax[0]) + margin)
      .attr('text-anchor', 'middle')
      .attr('class', 'axisLabel')
      .text('more wealthy');

    svg.append('text')
      .attr('x', xScale(xMinMax[1]))
      .attr('y', yScale(yMinMax[0]) + margin)
      .attr('text-anchor', 'middle')
      .attr('class', 'axisLabel')
      .text('less wealthy');


    update();
  });

  window.addEventListener("resize", (e) => {
    location.reload();
  })

  function update() {
    circles.transition()
      .delay( (d,i) => i * 5 )
      .attr('r', d => rScale(d.value))
  }
})