/*
  code taken from
  http://bl.ocks.org/mbostock/4063269
  except where i put comments.
*/
function produceGraph(root, window) { //add root and window as params
  var diameter = 1200,
    format = d3.format(",d"),
    color = d3.scale.category20c();

  var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(1.5);
  
  var svg = d3.select(window.document.body).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  var nodes = bubble.nodes(classes(root));
  var filteredNodes = nodes.filter(function(d) { return !d.children; });
  
  var node = svg.selectAll(".node")
      .data(filteredNodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); 
  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); }); 
  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.packageName); }); 
  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.className.substring(0, d.r / 3); }) 
  d3.select(window.frameElement).style("height", diameter + "px");

  //http://stackoverflow.com/questions/28653331/creating-a-legend-for-a-bubble-chart-using-d3
  /** TODO figure out this legend business
  console.log(nodes);
  var legend_data = nodes.map(function(d,i){  
    d.original_index = i;
    return d;
  });
  console.log(legend_data);
  var legend = svg.append("g")
    .attr("class", "legend")
    .selectAll("g")
    .data(legend_data)
    .enter()
    .append("g")
    .attr("transform", function(d,i){
        return "translate(" + d.depth*10 + "," + i*20 + ")"; 
    });

  // Draw rects, and color them by original_index
  legend.append("rect")
      .attr("width", 8)
      .attr("height", 8)
      .style("fill", function(d){return color(d.parent.original_index)});
  
  legend.append("text")
      .attr("x", function(d,i){ return d.depth*10 +10;})
      .attr("dy", "0.50em")
      .text(function(d){return d.packageName;})  

  d3.select(window.frameElement).style("height", diameter + "px");*/
  return svg;
}

// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}

module.exports = {
  produceGraph: produceGraph
};
