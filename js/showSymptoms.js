function showSymptoms(data) {
    var container = $("#divSymptoms");

    container.empty();
    container.append(addSymptoms(data));

    //coloca o botão de filtro no estado original
    $("#buttonSelectSymptosm").text("Deselecionar todos");
}

function addSymptoms(data) {    
    var append = "";
    
    syndrome = data.class.syndrome;

    for(i = 0; i < syndrome.length; i++){
        append += "<input type='checkbox' class='symptomCheckboxes' checked='true'><label> " + syndrome[i].value + "</label><br>";
    }

    return append;
}

function changeLabelButton(elem) {
    if (elem.value === "Deselecionar todos"){
        elem.value = "Selecionar todos";
    }else{
        elem.value = "Deselecionar todos";
    }

    checkBoxes = $(".symptomCheckboxes");

    for(i = 0; i < checkBoxes.length; i++){
        checkBoxes[i].checked = !checkBoxes[i].checked;
    }
     
}