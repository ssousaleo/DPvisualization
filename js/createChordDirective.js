function createChordDirective (data, el, relations) {
  var size = [750, 750]; // SVG SIZE WIDTH, HEIGHT
  var marg = [50, 50, 50, 50]; // TOP, RIGHT, BOTTOM, LEFT
  var dims = []; // USABLE DIMENSIONS
  dims[0] = size[0] - marg[1] - marg[3]; // WIDTH
  dims[1] = size[1] - marg[0] - marg[2]; // HEIGHT

  var colors = d3.scale.ordinal()
    .range(['#9C6744','#C9BEB9','#CFA07E','#C4BAA1','#C2B6BF','#121212','#8FB5AA','#85889E','#9C7989','#91919C','#242B27','#212429','#99677B','#36352B','#33332F','#2B2B2E','#2E1F13','#2B242A','#918A59','#6E676C','#6E4752','#6B4A2F','#998476','#8A968D','#968D8A','#968D96','#CC855C', '#967860','#929488','#949278','#A0A3BD','#BD93A1','#65666B','#6B5745','#6B6664','#695C52','#56695E','#69545C','#565A69','#696043','#63635C','#636150','#333131','#332820','#302D30','#302D1F','#2D302F','#CFB6A3','#362F2A']);

  var i = 0;
  var chord = d3.layout.chord()
    .padding(0.02)
    .sortGroups(d3.descending)
    .sortSubgroups(d3.ascending);

  var matrix = createChordMatrix().chordMatrix()
    .layout(chord)
    .filter(function (item, r, c) {
      return (item.symptom1 === r.name && item.symptom2 === c.name) ||
             (item.symptom1 === c.name && item.symptom2 === r.name);
    })
    .reduce(function (items, r, c) {
      var value;
      if (!items[0]) {
        value = 0;
      } else {
        value = items.reduce(function (m, n) {
          if (r === c) {
            return m + (n.flow1 + n.flow2);
          } else {
            return m + (n.symptom1 === r.name ? n.flow1: n.flow2);
          }
        }, 0);
      }
      return {value: value, data: items};
    });

  var innerRadius = (dims[1] / 2) - 100;

  var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(innerRadius + 20);

  var path = d3.svg.chord()
    .radius(innerRadius);
  
  var svg = d3.select(el[0]).append("svg")
    .attr("class", "chart")
    .attr({width: size[0] + "px", height: size[1] + "px"})
    .attr("preserveAspectRatio", "xMinYMin")
    .attr("viewBox", "-40 0 " + size[0] + " " + size[1]);

  var container = svg.append("g")
    .attr("class", "container")
    .attr("transform", "translate(" + ((dims[0] / 2) + marg[3]) + "," + ((dims[1] / 2) + marg[0]) + ")");

  var messages = svg.append("text")
    .attr("class", "messages")
    .attr("transform", "translate(10, 20)")
    .text("Atualizando...");


  //DRAW CHORD FUNCTION
  var drawChords = function (data, el) {
    messages.attr("opacity", 1);
    messages.transition().duration(1000).attr("opacity", 0);

    matrix.data(data)
      .resetKeys()
      //.addKeys(['symptom1', 'symptom2'])
      .addKeys(['symptom1', 'symptom2'], ['idS1', 'idS2'])
      .update()

    var groups = container.selectAll("g.group")
      .data(matrix.groups(), function (d) { return d._id; });
    
    var gEnter = groups.enter()
      .append("g")
      .attr("class", "group");

    gEnter.append("path")
      .style("pointer-events", "none")
      .style("fill", function (d) { return colors(d._id); })
      .attr("d", arc);

    gEnter.append("text")
      .attr("dy", ".35em")
      .on("click", groupClick)
      .on("mouseover", updateGroup)
      .on("mouseout", hideTooltip)
      .text(function (d) {
        return d._id;
      });

    groups.select("path")
      .transition().duration(2000)
      .attrTween("d", matrix.groupTween(arc));

    groups.select("text")
      .transition()
      .duration(2000)
      .attr("transform", function (d) {
        d.angle = (d.startAngle + d.endAngle) / 2;
        var r = "rotate(" + (d.angle * 180 / Math.PI - 90) + ")";
        var t = " translate(" + (innerRadius + 26) + ")";
        return r + t + (d.angle > Math.PI ? " rotate(180)" : " rotate(0)"); 
      })
      .attr("text-anchor", function (d) {
        return d.angle > Math.PI ? "end" : "begin";
      });

    groups.exit().select("text").attr("fill", "orange");
    groups.exit().select("path").remove();

    groups.exit().transition().duration(1000)
      .style("opacity", 0).remove();

    var chords = container.selectAll("path.chord")
      .data(matrix.chords(), function (d) { return d._id; });

    chords.enter().append("path")
      .attr("class", "chord")
      .style("fill", function (d) {
        return colors(d.source._id);
      })
      .attr("d", path)
      .on("mouseover", chordMouseover)
      .on("mouseout", hideTooltip);

    chords.transition().duration(2000)
      .attrTween("d", matrix.chordTween(path));

    chords.exit().remove()

    function groupClick(d) {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      //$scope.addFilter(d._id);
      resetChords();
    }

    function chordMouseover(d) {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      dimChords(d);
      d3.select("#tooltip").style("opacity", 1);
      updateTooltip(matrix.read(d));
    }

    function updateTooltip(d) {
      try{
        var s1 = d.sname;
        var s2 = d.tname;
        var relType = d.sdata.data[0].type;
        
        $("#tooltipLabel").html(
          "O sintoma <strong>" + s1 + 
          "</strong> está relacionado com o sintoma <strong>" + s2 + 
          "</strong> por um relacionamento do tipo <strong>" + relType + 
          "</strong>"
        );

       }catch(error){
         return;
      }
    }

    function hideTooltip() {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      d3.select("#tooltip").style("opacity", 0);
      resetChords();
    }


    function resetChords() {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      container.selectAll("path.chord").style("opacity",0.9);
    }

    function dimChords(d) {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      container.selectAll("path.chord").style("opacity", function (p) {
        if (d.source) { // COMPARE CHORD IDS      
          return (p._id === d._id) ? 0.9: 0.1;
        } else { // COMPARE GROUP IDS
          return (p.source._id === d._id || p.target._id === d._id) ? 0.9: 0.1;
        }
      });
      
    }

    function updateGroup(d) {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      dimChords(d);
      d3.select("#tooltip").style("opacity", 1);
      updateTooltipGroup(d);
    }
    
    //UPDATE THE TOOLTIP WILL ALL THE RELATIONS OF A SYMPTOM
    function updateTooltipGroup(d) {
      try{
        var info = matrix.read(d);    //info now has the symptom id (gid) and the symptom name (gname)
    
        var rel = relations[info.gid];

        var html = "<strong>"+ info.gname + "</strong> se relaciona com:<br>";
        var i = 0;
        
        rel.forEach(function (item) {
          html += "&nbsp;" + (++i) + ".<strong>" + item.name + "</strong>. Tipo de relacionamento: <strong>" + item.type + "</strong><br>";
        });
        
        $("#tooltipLabel").html(html);

       }catch(error){
         console.log(error);
                  
         return;
      }
    }

  }; // END DRAWCHORDS FUNCTION

  drawChords(data, el);

  function resize() {
    var width = el.parent()[0].clientWidth;
    svg.attr({
      width: width,
      height: width / (size[0] / size[1])
    });
  }

  resize();
    
  /*$window.addEventListener("resize", function () {
    resize();
  });*/
}; // END LINK FUNCTION


