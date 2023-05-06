var matrix_flag =[];
var config = null;
var myChart = null;
var dCount = 0;
var oldData = [];
var options = {};
var data = null;

var ChartCreate = function () {

    $(document).ready(function(){
        $("#chart_type").click();   
        $("#tb-ocolor").val("#ffffff");
        $("#tb-ecolor").val("#ffffff");
        $("#th-bcolor").val("#ffffff");
              
    });

    $('#col_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
        matrix_update();
    });

    $('#row_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
        matrix_update();
    });

    var html_cont;
    $(document).on('change','#mat_set',function(){
        matrix_update();
        
    });

    let table_td_vals = [];
    var keep_matrix_val = function () {
        $('#real_matrix td input[type="text"]').each(function (i,ele) {
            let input = $(ele).val();
            let id = $(ele).attr("id");
            let td_vals = [];
            if (id != null && id != "") {
                td_vals.push(id);
                td_vals.push($(ele).val());
                table_td_vals.push(td_vals);
            }
        });
    }
    var set_matrix_val = function () {
        $('#real_matrix td input[type="text"]').each(function (i,ele) {
            let id = $(ele).attr("id");
            for(let i = 0; i < table_td_vals.length; i++) {
                if(id == table_td_vals[i][0]) {
                    $(ele).val(table_td_vals[i][1]);
                    break;
                }
            }
        });
    }
    var matrix_update=function(){
        table_td_vals = [];
        keep_matrix_val();
        $('#real_matrix').children().remove();
        html_cont= `
                    <tr>
                        <td><input type="text" placeholder="" class="form-control empty-cell" value="  " disabled></td>`;

        for (var i=2;i<= $("#col_panel").children().length ; i++)
        {
            html_cont +=`<td>`;
            var caption = $("#col_panel div:nth-child("+i+")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control head" value="`+caption+`" disabled>`;
            html_cont += `</td>`;
        }
        html_cont += `</tr>`;

        for (var j=2;j<= $("#row_panel").children().length ; j++)
        {
            html_cont +=`<tr><td width="15%">`;
            var caption = $("#row_panel div:nth-child("+j+")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control head" value="`+caption+`" disabled></td>`;

            var row_idx = j - 1;
            for (var i=2;i<= $("#col_panel").children().length ; i++)
            {
                var col_idx = i - 1;
                var idx = col_idx + "_" + row_idx;
                html_cont += `<td> <input type="text"  placeholder="" class="form-control formulas" id="`+idx+`" onfocus="selectItemFunction(event)"></td>`;
            }
            html_cont +=`</tr>`;
        }
        $("#real_matrix").append(html_cont); 
        $('#real_matrix tr').find("td input[type='text']").click(function(e) {
            var index = $(this).index('.formulas');
            var colN = $("#col_panel").children().length;
            var col = index%(colN-1);
            var row = parseInt(index/(colN-1));
            for (var j=0;j< $("#col_panel").children().length - 1 ; j++)
            {
                for (var i=0;i< $("#row_panel").children().length- 1 ; i++)
                    if(j == col && i == row){
                        matrix_flag[j][i] = 1;
                    } else {
                        matrix_flag[j][i] = 0;
                    }
            }
        });
        for (var j=0;j< $("#col_panel").children().length - 1 ; j++)
        {
            matrix_flag[j] = [];
            for (var i=0;i< $("#row_panel").children().length- 1 ; i++)
            matrix_flag[j][i] = 0;
        }
        set_matrix_val();
    }
    
    $("#ccol_add").on('click',function(){
       
        $("#col_panel").append(`
        <div class="row" >
            <div class="col-2">
                <select class="form-control input-small select2me" data-placeholder="Select..." disabled>
                    <option >Single Input</option>
                    <option >Checkbox</option>
                    <option >Radiogroup</option>
                    <option >Imagepicker</option>
                </select>
            </div>
            <div class="col-2">
                <input type="text" value="Input" style="z-index:20;"  class="form-control">
                
            </div>
            <div class="col-2">
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="81">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
        </div>
       `);
       matrix_update();
    });

    $("#crow_add").on('click',function(){
        $("#row_panel").append(`
        <div class="row" >
            <div class="col-2">
                <select class="form-control input-small select2me" data-placeholder="Select..." disabled>
                    <option >Single Input</option>
                    <option >Checkbox</option>
                    <option >Radiogroup</option>
                    <option >Imagepicker</option>
                </select>
                      
            </div>
            <div class="col-2">
                <input type="text" value="Input" style="z-index:20;" class="form-control">
                
            </div>
            <div class="col-2">
                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="11">
                    <i class="fa fa-trash" style="color:white"></i>
                </a>
            </div>
        </div>
       `);
       matrix_update();
    });

    $('#chart_type').on('change',function(e){
        //$("#create_chart").hide();
        $("#pie-chartdiv").hide();
        $('#bar-chartdiv').hide();
        $('#donut-chartdiv').hide();
        $('#d3bar-chartdiv').hide();
        $('#horizontal-chartdiv').hide();
        $('#line-chartdiv').hide();
        $('#bubble-chartdiv').hide();
        $('#radar-chartdiv').hide();
        $('#radar1-chartdiv').hide();
        $('#polar-chartdiv').hide();
        $('#no_table_chart').hide();
        $('#responsive_table').hide();
        $('#sortable_table').hide();
        $('#table_result').hide();
        $('#newChartArea').hide();
        $("#myChart").remove();
        // const content = [
        //     ['  ', 'John', 'Smith', 'Jack', 'Jackson', 'Yuri'],
        //     ['revenue', '2500', '3500', '1200', '490', '3500'],
        //     ['cost', '2000', '2800', '1000', '276', '3400'],
        //     ['profit', '500', '700', '200', '214', '100'],
        // ];
        var collen = $("#col_panel").children().length;
        var rowlen = $("#row_panel").children().length;
        var content=[{}];
        for (var j=0;j< rowlen ; j++)
        {
            content[j]=[];
            for (var i=0;i< collen ; i++) {
                content[j][i] = $('#real_matrix tr:eq(' + j + ')').find("td:eq(" + i + ") input[type='text']").val();
            }
        }
        // var selected_cat=[];
        // $('#tests_id option:selected').each(function(){
        //     selected[$(this).val()]=$(this).val();
        // });
        // ExpressionCalculation(selected_cat);
        var type = $(this).val();
        if (type == 0) {
            pie_chart_draw(content, "");
            $("#pie-chartdiv").show();
        } else if (type == 1) {
            donut_chart_draw(content, "");
            $('#donut-chartdiv').show();
        } else if (type == 2) {
            bar_chart_draw(content, "");
            $('#bar-chartdiv').show();
        } else if (type == 3) {
            d3bar_chart_draw(content, "");
            $('#d3bar-chartdiv').show();
        } else if(type == 5) {
            horizontal_bar_chart_draw(content, "");
            $('#horizontal-chartdiv').show();
        } else if(type == 6) {
            line_chart_draw(content, "");
            $('#line-chartdiv').show();
        } else if(type == 7) {
            radar_chart_draw(content, "");
            $('#radar-chartdiv').show();
        } else if(type == 8) {
            polar_chart_draw(content, "");
            $('#polar-chartdiv').show();
        } else if(type == 9) {
            bubble_chart_draw(content, "");
            $('#bubble-chartdiv').show();
        } else if(type == 11) {
            radar1_chart_draw(content, "");
            $('#radar1-chartdiv').show();
        } else if(type == 4) {
            sortable_table_draw(content, "");
            $('#sortable_table').show();
        } else if(type == 10) { //resonsive table
            responsive_table_draw(content, "")
            $('#responsive_table').show();
        } else if(type == 12){ // no table and chart
            noTableAndChartDraw(content, "");
            $('#no_table_chart').show();
        } else if(type == 13){ // HORIZONTAL //////////////////////////////////////////////////
            horizontal_draw(content, "");
        } else if(type == 14){ // stacked
            stacked_draw(content, "");
        } else if(type == 15){ // vertical
            vertical_draw(content, "");
        } else if(type == 16){ // line
            line_draw(content, "");
        } else if(type == 17){ // point-styling
            point_styling_draw(content, "");
        } else if(type == 18){ // bubble
            bubble_draw(content, "");
        } else if(type == 19){ // combo-bar-line
            combo_bar_line_draw(content, "");
        } else if(type == 20){ // doughnut
            doughnut_draw(content, "");
        } else if(type == 21){ // multi-series-pie
            multi_series_pie_draw(content, "");
        } else if(type == 22){ // pie
            pie_draw(content, "");
        } else if(type == 23){ // polar-area
            polar_area_draw(content, "");
        } else if(type == 24){ // radar
            radar_draw(content, "");
        } else if(type == 25){ // scatter
            scatter_draw(content, "");
        } else if(type == 26){ // area-radar
            area_radar_draw(content, "");
        } else if(type == 27){ // line-stacked
            line_stacked_draw(content, "");
        } else {

        }
        var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']
        for(var i=0;i<$("#option-chartdiv .color-set").length;i++)
            $("#option-chartdiv .color-set .chartcolorpicker").eq(i).val(colorArr[i%10]);
        return;
    });

    $("#create_chart").hide();
    $("#pie-chartdiv").hide();
    $('#bar-chartdiv').hide();
    $('#donut-chartdiv').hide();
    $('#d3bar-chartdiv').hide();
    $('#horizontal-chartdiv').hide();
    $('#line-chartdiv').hide();
    $('#bubble-chartdiv').hide();
    $('#radar-chartdiv').hide();
    $('#radar1-chartdiv').hide();
    $('#polar-chartdiv').hide();
    $('#no_table_chart').hide();
    $('#responsive_table').hide();
    $('#sortable_table').hide();
    $('#table_result').hide();
    $('#newChartArea').hide();
    $("#myChart").remove();

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        }
    });
    var content;
    var data = [];
    $('#save_new_data').on('click',function(e){


        var selected=[],selected_cat=[];
        $('#tests_id option:selected').each(function(){
            selected[$(this).val()]=$(this).val();
        });

        var k=0;
        for (var i=0;i<selected.length; i++)
        {
            if (selected[i] != null && selected[i]!="" )
            {
                selected_cat[k]= selected[i];k++;
            }
        }

        content=[];
        var collen = $("#col_panel").children().length;
        var rowlen = $("#row_panel").children().length;

        for (var j=0;j< rowlen ; j++)
        {
            content[j]=[];
            for (var i=0;i< collen ; i++) {
                content[j][i] = $('#real_matrix tr:eq(' + j + ')').find("td:eq(" + i + ") input[type='text']").val();
            }
        }

        data = {
            'title':$("#title").val(),
            'test_ids' : JSON.stringify(selected_cat),
            'type_id' : $("#chart_type option:selected").val(),
            'content': JSON.stringify(content)
        }; 
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        var mid;
        $.ajax({
            url: "chart_store",
            data: data ,
            type: "POST",
            dataType: 'json',
            success: function (response) {
                mid=response.up;
                save_chart_option(mid);

            },
            error: function (response) {
                console.log('Error:', response);
            }
        });
        
      //location.reload(); 
      ExpressionCalculation(selected_cat);
      $("#save_new_data").show();
    }); 

    var tdata_max = [];
    var t_id = [];
    var qdata_max = [];
    var q_id = [];
    
    var ExpressionCalculation = function(selected_cat){
        var question_list=[];
        var textgroup_list=[];

        for (var i=1;i<content.length;i++)
        {
            for (var j=1;j<content[i].length;j++)
            {
                var expression = [];
                expression = equation_extraction(content[i][j]);  
                var infix_expression = infixToPostFix(expression);
                content[i][j]=infix_expression;

                for (var k=0;k<infix_expression.length;k++)
                {
                    if(infix_expression[k] == undefined)
                        continue;
                    if(infix_expression[k].includes("question")==true)
                    {
                        var q_flag = 0;
                        var q_item= infix_expression[k].split("question")[1];
                        for (var m=0;m<question_list.length;m++)
                        {
                            if(question_list[m]== q_item)
                            {
                                q_flag= 1;
                                break;
                            }
                        }
                        if (q_flag==0)
                            question_list.push(q_item);
                    }
                    else if(infix_expression[k].includes("textgroup")==true)
                    {
                        var t_flag = 0;
                        var t_item= infix_expression[k].split("textgroup")[1];
                        for (var m=0;m<textgroup_list.length;m++)
                        {
                            if(textgroup_list[m]== t_item)
                            {
                                t_flag= 1;
                                break;
                            }
                        }
                        if (t_flag==0)
                            textgroup_list.push(t_item);
                    }
                }
            }
        }
        //e.preventDefault();
        $.ajax({
            data: {question_list:question_list,textgroup_list:textgroup_list, test_ids: selected_cat},
            type: "GET",
            dataType: 'json',
            
            success: function(response){
              
                var qdata_cnt = response['qdata'].length;
                for (var i=0;i<qdata_cnt;i++)
                {
                    var qdata = JSON.parse(response['qdata'][i][0]['score']);
                    q_id[i] = JSON.parse(response['qdata'][i][0]['id']);
                    qdata_max[i] =0;
                    for (var j = 0; j<qdata.length; j++)
                    {
                        if (qdata[j] > qdata_max[i]) qdata_max[i] = qdata[j];
                    }
                }
             
                var tdata_cnt = response['tdata'].length;
                for (var i=0;i<tdata_cnt;i++)
                {
                    var tdata = JSON.parse(response['tdata'][i][0]['score']);
                    t_id[i] = JSON.parse(response['tdata'][i][0]['id']);
                    tdata_max[i] =0;
                    for (var j = 0; j<tdata.length; j++)
                    {
                        if (tdata[j] > tdata_max[i]) tdata_max[i] = tdata[j];
                    }
                }

                for (var i=1;i<content.length;i++)
                {
                    for (var j=1;j<content[i].length;j++)
                    {
                        var real_expression= convert_real_expression(content[i][j]);
                        content[i][j]= infix_evaluation(real_expression);
                    }
                }
            },
            error: function(response){
                console.log(response);
            }
        });
    };

    var equation_extraction = function(origin_expression){
        var operator=["+","-","*","/","(",")"];
        //var origin_expression="6*(5+(2+3)*8+3)";
        var expression=[];
        expression[0]="";
        var i=0;
        var operator_flag=0;
        for (var t=0;t<origin_expression.length;t++)
        {
            operator_flag=0;
            for (var j=0;j<operator.length;j++)
            {
                if (origin_expression[t]==operator[j])
                {
                    operator_flag =1;
                    break;
                }
            }
            if(operator_flag == 0)
                expression[i]+=origin_expression[t];
            else
            {
                if (expression[i].length>0)
                    i++;
                expression[i]= operator[j];
                if (t != origin_expression.length-1)
                {
                    i++;expression[i]="";
                }
            }

        }

        return expression;
    }

    // $("#create_chart").on('click',function(){
    //     var selected_text= $( "#chart_type option:selected").text();
        
    //     $("#pie-chartdiv").hide();
    //     $('#bar-chartdiv').hide();
    //     $('#donut-chartdiv').hide();
    //     $('#d3bar-chartdiv').hide();
    //     $('#table_result').hide();
    // });      


   var precedence =function(c){
        switch (c){
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            case '^':
                return 3;
        }
        return -1;
    }
  
    var infixToPostFix =function(expression){

        var result = [];
        stack = [];
        for (var i = 0; i <expression.length ; i++) {

            //check if char is operator
            if(precedence(expression[i])>0){
                while(stack.length>0 && precedence(stack[stack.length-1]) >=precedence(expression[i])){
                    result.push(stack.pop());
                }
                stack.push(expression[i]);
            }else if(expression[i]==')'){
                var x = stack.pop();
                while(x!='('){
                    result.push(x);
                    x = stack.pop();
                }
            }else if(expression[i]=='('){
                stack.push(expression[i]);
            }else{
                //character is neither operator nor ( 
                result.push(expression[i]);
            }
        }
      
        for (var i = 0; i <=stack.length ; i++) {
            result.push(stack.pop());
        }
    
        return result;
    }

    var convert_real_expression = function(infix_expression){
        for (var i=0;i<infix_expression.length;i++)
        {
            if(infix_expression[k] == undefined)
                continue;
            if (infix_expression[i].includes("question") == true)
            {
                for (var j=0;j<qdata_max.length; j++)
                {
                    if (infix_expression[i].split("question")[1] == q_id[j])
                        infix_expression[i] =qdata_max[j];
                } 
            }
            else if (infix_expression[i].includes("textgroup") == true)
            {
                for (var j=0;j<tdata_max.length; j++)
                {
                    if (infix_expression[i].split("textgroup")[1] == t_id[j])
                        infix_expression[i] = tdata_max[j];
                } 
            }
              
        }
        return infix_expression;
    };

    var infix_evaluation= function(infix_expression)
    {
        var temp=[];
        alert(infix_expression.length);
        for (var i=0; i<infix_expression.length;i++)
        {
            if(infix_expression[i]=="+" || infix_expression[i]=="-" || infix_expression[i]=="*" || infix_expression[i]=="/")
            {
                var first_num = parseFloat(temp.pop());
                var second_num = parseFloat(temp.pop());



                if(isNaN(second_num)){
                    second_num=0;
                }else{
                    second_num=second_num;
                }
                if(isNaN(first_num)){
                    first_num=0;
                }else{
                    first_num=first_num;
                }
                if (infix_expression[i]=="+" )
                    temp.push( first_num + second_num);
                else if(infix_expression[i]=="-" )
                    temp.push( first_num - second_num);
                else if(infix_expression[i]=="*" )
                    temp.push( first_num * second_num);
                else
                    temp.push(second_num/first_num);                
            }
            else{
                temp.push(infix_expression[i]);
            }
        }
        return temp.pop();
    }     

    return {
        //main function to initiate the module
        init: function () {            
        }
    };

}();

var selectedItemID = "1_1";
function selectItemFunction(e){
    selectedItemID = e.target.id;
}

function selectQuestion(e,data_testid,data_count) {
    if(data_count != null) {
        var questionItem = document.getElementsByClassName('question-item');
        var text = e.target.innerText;
        var t_a = text.split('.');
        if(data_count != 7)
            text = 'question'+t_a[0];
        var selected_val = text;
        if($('#'+selectedItemID).val() != "" && $('#'+selectedItemID).val() != " ")
            selected_val = $('#'+selectedItemID).val() + "+" + text;
        $("#"+selectedItemID).val(selected_val);
    }
}
/**
 * 
 * @param {*} e : event
 * @param {*} data_testid textgroup's test id 
 */
function selectTextGroup(e,data_testid) {
    var text = e.target.innerText;
    var t_a = text.split('.');
    text = 'textgroup' + t_a[0];
    var data_testid = data_testid;
    var selected_val = text;
    if ($('#' + selectedItemID).val() != "" && $('#' + selectedItemID).val() != " ")
        selected_val = $('#' + selectedItemID).val() + "+" + text;
    $("#" + selectedItemID).val(selected_val);

}
function selectMatrixQuestion(e,data_testid,data_count) {
    var text = e.target.innerText;
    var t_a = text.split('.');
    if(data_count != 4)
        text = 'question'+t_a[0];
    var selected_val = text;
    if($('#'+selectedItemID).val() != "" && $('#'+selectedItemID).val() != " ")
        selected_val = $('#'+selectedItemID).val() + "+" + text;
    $("#"+selectedItemID).val(selected_val);
}

$('#real_matrix tr').find("td input[type='text']").click(function(e) {
    var index = $(this).index('.formulas');
    var colN = $("#col_panel").children().length;
    var col = index%(colN-1);
    var row = parseInt(index/(colN-1));
    for (var j=0;j< $("#col_panel").children().length - 1 ; j++)
    {
        for (var i=0;i< $("#row_panel").children().length- 1 ; i++)
            if(j == col && i == row){
                matrix_flag[j][i] = 1;
            } else {
                matrix_flag[j][i] = 0;
            }
    }
});
for (var j=0;j< $("#col_panel").children().length - 1 ; j++)
{
    matrix_flag[j] = [];
    for (var i=0;i< $("#row_panel").children().length - 1 ; i++)
    matrix_flag[j][i] = 0;
}


function line_stacked_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);
    $("#myChart canvas").css("width", "100%");
    $("#myChart canvas").css("height", "500px");

    const type = "line";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Chart.js Line Chart - stacked'
            },
            tooltip: {
                mode: 'index'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: ''
                }
            },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: ''
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 


    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function area_radar_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "radar";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            filler: {
            propagate: false
            },
            'samples-filler-analyser': {
            target: 'chart-analyser'
            },
            tooltip: {
            callbacks: {
                label: function(context) {
                const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
                return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
                }
            }
            }
        },
        interaction: {
            intersect: false
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 


    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function scatter_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const labels = [];
    const mydata = [];
    const type = "scatter";

    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateBubbleData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Scatter Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
    $("#option-chartdiv").html("");
    data.labels.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item;
        $(".label-text")[index].value = item;
    }); 
    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function radar_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "radar";

    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
            display: true,
            text: 'Chart.js Radar Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };
    
    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
      $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 


    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function polar_area_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "polarArea";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Polar Area Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
    $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 


    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function pie_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "pie";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generatePieData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Pie Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
             }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

   var chartHTML = "";
    $("#option-chartdiv").html("");
    data.labels.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item;
        $(".label-text")[index].value = item;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })

    $("#newChartArea").show();
    return 0;
}

function multi_series_pie_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "pie";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generatePieData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
            labels: {
                generateLabels: function(chart) {
                // Get the default label list
                const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                const labelsOriginal = original.call(this, chart);
    
                // Build an array of colors used in the datasets of the chart
                let datasetColors = chart.data.datasets.map(function(e) {
                    return e.backgroundColor;
                });
                datasetColors = datasetColors.flat();
    
                // Modify the color and hide state of each label
                labelsOriginal.forEach(label => {
                    // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                    label.datasetIndex = (label.index - label.index % 2) / 2;
    
                    // The hidden state must match the dataset's hidden state
                    label.hidden = !chart.isDatasetVisible(label.datasetIndex);
    
                    // Change the color to match the dataset
                    label.fillStyle = datasetColors[label.index];
                });
    
                return labelsOriginal;
                }
            },
            onClick: function(mouseEvent, legendItem, legend) {
                // toggle the visibility of the dataset from what it currently is
                legend.chart.getDatasetMeta(
                legendItem.datasetIndex
                ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
                legend.chart.update();
            }
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
    $("#option-chartdiv").html("");
    data.labels.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item;
        $(".label-text")[index].value = item;
    }); 
    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function doughnut_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "doughnut";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generatePieData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Doughnut Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';
    
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
    $("#option-chartdiv").html("");
    data.labels.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id='color_pick_${index}' type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item;
        $(".label-text")[index].value = item;
    }); 
    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function combo_bar_line_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "bar";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Combined Line/Bar Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function bubble_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "bubble";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateBubbleData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        // responsive: false,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Scatter Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
    $("#option-chartdiv").html("");
    data.labels.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item;
        $(".label-text")[index].value = item;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function point_styling_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "line";
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            title: {
            display: true,
            text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    
    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function line_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "line";  
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Line Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })

    $("#newChartArea").show();
    return 0;
}

function vertical_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "bar";    
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero : true,
                grid: {
                drawBorder: true,
                borderColor: 'grey',
                color: 'green'
                },
                ticks: {
                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                    color: 'maroon',
                }
            },
            x: {
                grid: { 
                    borderColor: 'red',
                    color: 'blue' 
                },
                ticks: {
                    // For a category axis, the val is the index so the lookup via getLabelForValue is needed
                    color: 'red',
                }
            }
        },
        // responsive: true,
        plugins: {
            legend: {
            position: 'top',
            },
            title: {
            display: true,
            text: 'Chart.js Bar Chart'
            },
            tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}


function stacked_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "bar";    
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    
    options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        },
        // responsive: true,
        scales: {
            x: {
            stacked: true,
            },
            y: {
            stacked: true
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );        
    
    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
        $("#newChartArea").show();
    return 0;
}

function horizontal_draw(content, idx){

    $("#myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    $("#newChartArea").append(canvasElem);

    const type = "bar";    
    var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0'];           
    var data = generateData(content, colorArr);
    options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        // Elements options apply to all of the options unless overridden in a dataset
        // In this case, we are setting the border of each horizontal bar to be 2px wide
        elements: {
            bar: {
                borderWidth: 2,
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: 'Chart.js Horizotal Bar Chart'
            },
            tooltip: {
            label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        }
    };

    var config = {
        type: type,
        data: data,
        options: options
    };

    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    var chartHTML = "";
     $("#option-chartdiv").html("");
    data.datasets.forEach((item, index) => {
        chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${index}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
        $("#option-chartdiv").append(chartHTML);
        $(".chartcolorpicker")[index].value = item.label;
        $(".label-text")[index].value = item.label;
    }); 

    $(".form-control.chartcolorpicker").bind("change",function(e){
        var index=$(this).attr("id").replace("color_pick_","");
        item=myChart.data.datasets[index];
        if(Array.isArray(item.backgroundColor))
        {
            myChart.data.datasets.forEach((item)=>{
                item.backgroundColor[index] = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor[index] = $(".chartcolorpicker")[index].value;
            })
        }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    myChart.update();
    })
    $("#newChartArea").show();
    return 0;
}

function noTableAndChartDraw(content, idx){

    const labels = [];
    const mydata = [];
    const names = [];

    for(let i = 1; i < content.length; i++) {
        for (let j = 1; j < content[0].length; j++) {
            names.push(content[0][j]);

            let label = content[i][0];
            if(content[0][j] == undefined || content[0][j] == null || content[0][j] == "")
                label = content[i][0];

            let val = content[i][j];
            if(val == undefined || isNaN(val))
                val = 0;
            labels.push(label);
            mydata.push(val);
        }
    }

    var result = [];
    var count = names.length;
    for(var i = 0; i < count; i++){
        var temp = {
            name:names[i],
            label:labels[i], 
            value:mydata[i]
        };
        result.push(temp);
    }

    result.sort(function(a, b){
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
            $("#newChartArea").show();
        return 0;
    });

    var resultHTML = "<p></p><h2>The result is following:</h2>";
    var tmpName = "";
    result.forEach((item, index) => {
        if(index === 0){
            resultHTML += "<p>";
        }
        if(tmpName != item.name){
            tmpName = item.name;
            if(index !== 0){
                resultHTML += ".</p>";
            }
            resultHTML += "<p><span></span>The " + item.label + " of " + item.name + " is " + item.value;
            return;
        }
        resultHTML += ", the " + item.label + " is " + item.value;
        if(index === result.length - 1){
            resultHTML += ".</p>";
        }
    });

    $("#no_table_chart").empty();
    $("#no_table_chart").append(resultHTML);
    $("#no_table_chart").show();

    $("#no_table_chart p")
        .css("font-size", 18);
    $("#no_table_chart p span:nth-child(1)")
        .css("display", "inline-block")
        .css("width", "6%");

    return;
}
var save_chart_option = function(mid){
        var cdata = {
            chart_type: "",
            chart:{},
            series:{
                xbc:"#000000",
                xlc:"#000000",
                xtc:"#000000",
                ybc:"#000000",
                ylc:"#000000",
                ytc:"#000000"
            },
            axes:{
                width:0,
                height:0
            },
            title:{
                title:"",
                align:""
            },
            tooltip:{
                display:"",
                backgroundColor:"#ff0000",
                radius:0,
                label: function(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            },
            legend:{
                display : "",
                pointstyle : "",
                position : ""
            },
            font:{
                title: 0,
                xtick: 0,
                ytick: 0
            },
            type: "-",
            table : {
                hsize : 14,
                hfcolor : "#fff",
                hbcolor : "#ff0",
                bsize : 14,
                bfcolor : "#000",
                bocolor : "#eee",
                becolor : "#fff",
            }
        };

        cdata.chart_type = $("#chart_type").val();

        cdata.table.hsize = $("#th-size").val()==""?14:$("#th-size").val();
        cdata.table.hfcolor = $("#th-fcolor").val();
        cdata.table.hbcolor = $("#th-bcolor").val();
        cdata.table.bsize = $("#tb-size").val()==""?14:$("#tb-size").val();
        cdata.table.bfcolor = $("#tb-fcolor").val();
        cdata.table.bocolor = $("#tb-ocolor").val();
        cdata.table.becolor = $("#tb-ecolor").val();

        for(var i = 0; i < $("#option-chartdiv .color-set").length; i++){
            cdata.chart[i]=($("#option-chartdiv .color-set .chartcolorpicker")[i].value);
        }

        cdata.series.xbc = $("#x-border-colorpicker").val();
        cdata.series.xlc = $("#x-line-colorpicker").val();
        cdata.series.xtc = $("#x-tick-colorpicker").val();
        cdata.series.ybc = $("#y-border-colorpicker").val();
        cdata.series.ylc = $("#y-line-colorpicker").val();
        cdata.series.ytc = $("#y-tick-colorpicker").val();

        cdata.axes.width = $("#chart-width").val();
        cdata.axes.height = $("#chart-height").val();

        cdata.title.title = $("#title-text").val();
        cdata.title.align = $("#title-align").val();
        
        cdata.font.title = $("#size-title").val();
        cdata.font.xtick = $("#x-size-tick").val();
        cdata.font.ytick = $("#y-size-tick").val();


        cdata.type = $("#datatype").val();
        

        cdata.tooltip.display=$("#show-tooltip").val()==="true"
        cdata.tooltip.backgroundColor=$("#tooltip-colorpicker").val();
        cdata.tooltip.radius=$("#tooltip-radius").val();


        cdata.legend.display = $("#show-legend").val();
        cdata.legend.pointstyle = $("#style-legend").val();
        cdata.legend.position = $("#position-legend").val();

            
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            }
        });

        $.ajax({
            data: {
                ctxData:JSON.stringify(cdata),
                type:$("#chart_type option:selected").val(),
                id: mid
            },
            url: "./save_chart",
            type: "POST",
            dataType: 'json',
            success: function(response){
                // template_alert("Grafico e tabella aggiornati", response.success);
                alert(response.success);
            },
            error: function(response){
                console.log(response);
            }
        });
        return;
};