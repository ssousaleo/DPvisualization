function teste(){
    var selectedClass = {       // STORE THE SELECTED CLASS IN THE CLASS PANEL [CLASS, FULLQUALIFIEDNAME]
        name: "",
        fullyQualifiedName: "",
    };  

    var scope = {};             //  STORE THE DATA
    scope.filters = {};
    scope.hasFilters = false;


    d3.json('../data/symptoms.json', function(err, data){
    j = 0;
    
    data.forEach(function (d, i) {
        if (i == 0){
            selectedClass.name = d.class.sourceFile.name;
            selectedClass.fullyQualifiedName = d.class.sourceFile.fullyQualifiedName;
        }
        if(!scope[d.class.sourceFile.fullyQualifiedName]){
            scope[d.class.sourceFile.fullyQualifiedName] = [] // STORED BY THE CLASS FULLQUALIFIEDNAME
        }
        scope[d.class.sourceFile.fullyQualifiedName] = d;
    });

    scope.addFilter = function(name){
        scope.hasFilters = true;
        scope.filters[name] = {
            name: name,
            hide: true,
        };
    }

    scope.removeFilter = function(name){
        delete scope.filters[name];
        scope.hasFilters = false;

        $.each(scope.filters, function (key, value){
            if(value.hide == true){
                scope.hasFilters = true;
            }
        });
        
    }

    loadSymptoms(data, selectedClass);

    /*var classname = document.getElementById("buttonSelectSymptoms");
    classname.addEventListener("click", myFunction, false);

    var myFunction = function() {
        console.log("entrou");
        
    };*/

    

});

}

function loadSymptoms(data, selectedClass){
    fullyQualifiedNames = [];
    
    var canvas = d3.select('.side-nav').append("form")
        .attr("width", 150)
        .attr("height", 100);

    canvas.selectAll("input")
        .data(data)
        .enter()
        .append("div")
            .attr("id", "divdoidona")
        .append("input")
        .attr({
            type: "radio",
            name: "classes",
            class: function (d) {
                fullyQualifiedNames.push(d.class.sourceFile.fullyQualifiedName);
                return d.class.sourceFile.name;
            },
            value: function (d, i) {
                return d.class.sourceFile.fullyQualifiedName;
            }
        })
        .property("checked", function (d, i) {
            $("#labelElement").html(selectedClass.name);
            return i === j;
        })
        .on("click", function(d,i) {
            selectedClass.name = d.class.sourceFile.name;
            selectedClass.fullyQualifiedName = d.class.sourceFile.fullyQualifiedName;
            
            $("#labelElement").html(selectedClass.name);
            //console.log(d);
        });

        //console.log(fullyQualifiedNames);
                

        $("<label>oi</label>").insertAfter(".DeviceRepository");
        
        /*canvas.selectAll("#divdoidona").selectAll("label")
        .data(data)
        .enter()
        .append("text")
        .text(function (d, i) {
            return d.class.sourceFile.name;
            })*/
            

  }