function importData(){
    d3.csv('../data/trade.csv', function (err, data) {

        var scope = {};

        data.forEach(function (d) {
          d.year  = +d.year;
          d.flow1 = +d.flow1;
          d.flow2 = +d.flow2;
          
          if (!scope[d.year]) {
            scope[d.year] = []; // STORED BY YEAR
          }
          scope[d.year].push(d);
        });
        var el = $("#chordDiagramId");
        
        createChordDirective(scope[2000], el);
      });
}