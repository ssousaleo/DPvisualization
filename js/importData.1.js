function importData(){
    d3.json('../data/symptoms-short.json', function(err, data){
        j = 0;
        var firstClassName;

        var canvas = d3.select('.side-nav').append("form")
            .attr("width", 150)
            .attr("height", 100);

        canvas.selectAll("label")
            .data(data)
            .enter()
            .append("label")
            .text(function (d, i) {
                if (j == i){
                    firstClassName = d.class.sourceFile.name;
                    showSymptoms(d);
                }
                return (d.class.sourceFile.name).concat(" ");
             })
            .insert("input")
            .attr({
                type: "radio",
                name: "classes",
                value: function (d, i) {
                    return i;
                }
            })
            .property("checked", function (d, i) {
                $("#labelElement").html(firstClassName);
                return i === j;
            })
            .on("click", function(d,i) {
                $("#labelElement").html(d.class.sourceFile.name);
                showSymptoms(d);
            });
        
    });
}