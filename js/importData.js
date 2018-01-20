/**
 * Since we are using the class qualified name as a key, thus we expect that the system won't have
 * two classes with the same qualified name
 */
function importData(){
    var selectedClass = {       // STORE THE SELECTED CLASS IN THE CLASS PANEL [CLASS, FULLQUALIFIEDNAME]
        name: "",
        fullyQualifiedName: "",
    };          
    var scope = {};             //  STORE THE DATA
    var csv = [];               //  STORE THE DATA TO CREATE THE CHORD
    var relations = {};         //  STORE THE RELATIONS AMONG THE SYMPTOMS


    d3.json('../data/symptoms-short.json', function(err, data){
    j = 0;
    
    data.forEach(function (d) {
        if(!scope[d.class.sourceFile.fullyQualifiedName]){
            scope[d.class.sourceFile.fullyQualifiedName] = [] // STORED BY THE CLASS FULLQUALIFIEDNAME
        }
        scope[d.class.sourceFile.fullyQualifiedName] = d;
    });

    var canvas = d3.select('.side-nav').append("form")
        .attr("width", 150)
        .attr("height", 100);

    canvas.selectAll("label")
        .data(data)
        .enter()
        .append("label")
        .text(function (d, i) {
            if (j == i){
                selectedClass.name = d.class.sourceFile.name;
                selectedClass.fullyQualifiedName = d.class.sourceFile.fullyQualifiedName;
                
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
            $("#labelElement").html(selectedClass.name);
            return i === j;
        })
        .on("click", function(d,i) {
            $("#labelElement").html(d.class.sourceFile.name);
            showSymptoms(d);            //UPDATE THE LIST OF SYMPTOMS IN THE RIGHT PANEL
        });
    
        //CREATE THE CHORD DIAGRAM
        var el = $("#chordDiagramId");
        convertData();
        createChordDirective(csv, el, relations);
    });

    function convertData() {
        retorno = prepareSymptoms(scope[selectedClass.fullyQualifiedName]);
        csv = retorno[0];
        
        relations = retorno[1];
    }
}