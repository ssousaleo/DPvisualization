function prepareSymptoms(element) { 
    //console.log(elemnt);
    var csv = [];
    var syndrome = element.class.syndrome;

    var ids = {};           // store the pair id-name, where name comprises the symptom name
    var relations ={}       // store the relations of each symptom

    //update all the ids with their real symptom name
    syndrome.forEach(function (d) {
        if(!ids[d.id]){
            ids[d.id] = "";
        }
        ids[d.id] = d.value;
    });

    //update the relations, changing the id for the name
    syndrome.forEach(function (d) {
        if(!relations[d.id]){
            relations[d.value] = []
        }
        //get all the relations
        d.relation.forEach(function (r) {
            var rel  = []
            r.relatedSymptoms.forEach(function (rs){
                rel.push(rs);
                csv.push({
                    symptom1: d.value,
                    symptom2: ids[rs],
                    flow1: 1,           //the weight of the relation goes here
                    flow2: 1,
                    type: r.type,
                    idS1: d.id,
                    idS2: rs,
                });
            });
            relations[d.value].push(rel);
        });
        
    });

    return [csv, relations];
}