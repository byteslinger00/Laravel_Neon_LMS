var config = null;
var dCount = 0;
var oldData = [];
var myChart = null;

var ChartEdit = function () {


    var collen = $("#col_panel").children().length;
    var rowlen = $("#row_panel").children().length;
    var content=[{}];
    // for (var j=0;j< rowlen ; j++)
    // {
    //     content[j]=[];
    //     for (var i=0;i< collen ; i++) {
    //         content[j][i] = $('#real_matrix tr:eq(' + j + ')').find("td:eq(" + i + ") input[type='text']").val();
    //     }
    // }
    $("#save_options").hide();
    $("#create_chart").show()
    
    drawChart($( "#edit_chart_type option:selected").text(),content);
    var updateOutput = function (e) {
    };

    var check_id=2;
    var tdata_max = [];
    var t_id = [];
    var qdata_max = [];
    var q_id = [];

    //*get selected tests
    var get_selected_tests = function () {
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
        return selected_cat;
    }
    //
    var ExpressionCalculation = function(){
        var question_list=[];
        var textgroup_list=[];
        for (var i=1;i<content.length;i++)
        {
            for (var j=1;j<content[i].length;j++)
            {
                var expression = [];
                expression = equation_extraction(content[i][j]);
                var infix_expression = expression;// infixToPostFix(expression);
                content[i][j]=infix_expression;
                for (var k=0;k<infix_expression.length;k++)
                {
                    if(infix_expression[k] == undefined || infix_expression[k] == "" || infix_expression[k] == null)
                        continue;
                    if(infix_expression[k].includes("question") ===true)
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
                        if (q_flag===0)
                            question_list.push(q_item);
                    }
                    else if(infix_expression[k].includes("textgroup")===true)
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
                        if (t_flag===0)
                            textgroup_list.push(t_item);
                    }
                }
            }
        }
        //e.preventDefault();
        var selected_cat = get_selected_tests();
        $.ajax({
            data: {question_list:question_list,textgroup_list:textgroup_list, test_ids: selected_cat},
            url: "../get_info",
            type: "GET",
            dataType: 'json',
            contentType : 'application/json; charset=UTF-8',
            success: function(response){

                for(var u = 1; u < content.length; u++){
                    for(var j = 1; j < content[u].length; j++){
                        for(var k = 0; k < content[u][j].length; k++){
                            if(content[u][j][k].includes("question") === true){
                                content[u][j][k] = content[u][j][k].split("question")[1];  
                                for (var i = 0; i < response['qdata'].length;i++)
                                {
                                    var score = response['qdata'][i][0]['score'];
                                    q_id[i] = response['qdata'][i][0]['id'];
                                    if (q_id[i] == content[u][j][k]) {
                                        content[u][j][k] = score.toString();
                                    }
                                }
                            }
                        }
                    }
                }
             
                var tdata_cnt = response['tdata'].length;
                for (var i=0;i<tdata_cnt;i++)
                {
                    var tdata = response['tdata'][i][0]['score'];
                    // var tdata = JSON.parse(response['tdata'][i][0]['score']);
                    t_id[i] = response['tdata'][i][0]['id'];
                    // t_id[i] = JSON.parse(response['tdata'][i][0]['id']);
                    // tdata_max[i] =0;
                    // for (var j = 0; j<tdata.length; j++)
                    // {
                    //     if (tdata[j] > tdata_max[i]) tdata_max[i] = tdata[j];
                    // }
                }
                
                for (var i=1;i<content.length;i++)
                {
                    for (var j=1;j<content[i].length;j++)
                    {
                        content[i][j]= infix_evaluation(content[i][j]);
                    }
                }
            },
            error: function(response){
                console.log(response);
            }
        });
    };

    $("#option-chartdiv").show();
    $("#option-seriesdiv").hide();
    $("#option-axesdiv").hide();
    $("#option-titlediv").hide();
    $("#option-tooltipdiv").hide();
    $("#option-legenddiv").hide();
    $("#option-tablediv").hide();

    $("#options-div .list-group-item > a").on('click',function(){
        
        $("#option-chartdiv").hide();
        $("#option-seriesdiv").hide();
        $("#option-axesdiv").hide();
        $("#option-titlediv").hide();
        $("#option-tooltipdiv").hide();
        $("#option-legenddiv").hide();
        $("#option-tablediv").hide();

        
        // var prevIndex = 0;
        // for(var index = 0; index < $(this).parent().siblings().length; index++) {
        //     if($($(this).parent().siblings()[index]).hasClass("active")){
        //         prevIndex = index;
        //     }
        // };
        $(this).parent().siblings().removeClass("active");

        // if($("#edit_chart_type").val() == 4 || $("#edit_chart_type").val() == 10){
        //     $("#option-tablediv").show();
        //     $("#options-div .list-group-item:last-child").addClass("active");
        // } else {
        //     if($(this).text() == "Table"){
        //         $("#options-div .list-group-item:nth-child("+(prevIndex+1)+")").addClass("active");
        //         var elem = "#option-" + $("#options-div .list-group-item:nth-child("+(prevIndex+1)+")").text().toLowerCase() + "div";
        //         $(elem).show();
        //         return;
        //     }
            $(this).parent().addClass("active");
            var txt = "#option-" + $(this).text().toLowerCase() + "div";
            $(txt).show();
        // }    
        return;
    });


    $("#tb-width").on('change',function(){
        $(".custom table").css({"width":$(this).val()+'px'});    
    })
    $("#tb-height").on('change',function(){
        $(".custom table").css({"height":$(this).val()+'px'});    
    })
    $("#th-size").on('change', function(){
        $(".custom th").css("font-size", $(this).val()+'px');
        for(var i=0;i<$(".custom tr").length;i++)
            $(".custom tr").eq(i).children().eq(0).css("font-size", $(this).val()+'px');
        
    });
    $("#th-fcolor").on('change', function(){
        $(".custom th").css("color", $(this).val());
       
    });
    $("#th-bcolor").on('change', function(){
        $(".custom th").css("background-color", $(this).val());
    });
    $("#tb-size").on('change', function(){
        $(".custom td").css("font-size", $(this).val()+'px');
         for(var i=0;i<$(".custom tr").length;i++)
            $(".custom tr").eq(i).children().eq(0).css("font-size", $("#th-size").val()+'px');
    });
    $("#tb-fcolor").on('change', function(){
        $(".custom td").css("color", $(this).val());
    });
    $("#tb-ocolor").on('change', function(){
        $(".custom tbody tr:odd").css("background-color", $(this).val());
    });
    $("#tb-ecolor").on('change', function(){
        $(".custom tbody tr:even").css("background-color", $(this).val());
    });

    $("#tooltip-colorpicker").on('change',function(){
        myChart.options.plugins.tooltip.backgroundColor=$(this).val();
        myChart.update();
        return;
    })
    $("#tooltip-radius").on('change',function(){
        myChart.options.plugins.tooltip.cornerRadius=$(this).val();
        myChart.update();
        return;
    })
    $("#show-tooltip").on('change',function(){
        myChart.options.plugins.tooltip.enabled=($(this).val() === 'true');
        myChart.update();
        return;
    })
    
    $("#title-text").on('blur',function(){
        myChart.options.plugins.title.display = true;
        myChart.options.plugins.title.text = this.value;
        myChart.update();
        return;
    });

    $("#size-title").on('change',function(){
        myChart.options.plugins.title.font.size = this.value;
        myChart.update();
        return;
    });

    $("#x-size-tick").on('change',function(){
        myChart.options.scales.x.ticks.font = { size : this.value};
        myChart.update();
        return;
    });

    $("#y-size-tick").on('change',function(){
        myChart.options.scales.y.ticks.font = { size : this.value};
        myChart.update();
        return;
    });

    $("#title-align").on('change',function(){
        myChart.options.plugins.title.align = this.value;
        myChart.update();
        return;
    });

    $("#show-legend").on('change',function(){
        myChart.options.plugins.legend.display = (this.value.toLowerCase() === 'true');
        myChart.update();
        return;
    });

    $("#style-legend").on('change',function(){
        myChart.data.datasets.forEach(dataset => {
            dataset.pointStyle = this.value;
        });
        myChart.update();
        return;
    });

    $("#position-legend").on('change',function(){
        myChart.options.plugins.legend.position = this.value;
        myChart.update();
        return;
    });



    $("#chart-width").on('change',function(){
        myChart.canvas.style.width = $(this).val() + 'px';
        myChart.update();
        return;
    });

    $("#chart-height").on('change',function(){
        myChart.canvas.style.height = $(this).val() + 'px';
        setTimeout(function(){
            myChart.canvas.style.width = $("#chart-width").val() + 'px';
        },100)
        
        
        myChart.update();
        return;
    });

    $("#x-border-colorpicker").on('change',function(){
        myChart.options.scales.x.grid.borderColor = this.value;
        myChart.update();
        return;
    });

    $("#x-line-colorpicker").on('change',function(){
        myChart.options.scales.x.grid.color = this.value;
        myChart.update();
        return;
    });

    $("#x-tick-colorpicker").on('change',function(){
        myChart.options.scales.x.ticks.color = this.value;
        myChart.update();
        return;
    });

    $("#y-border-colorpicker").on('change',function(){
        myChart.options.scales.y.grid.borderColor = this.value;
        myChart.update();
        return;
    });

    $("#y-line-colorpicker").on('change',function(){
        myChart.options.scales.y.grid.color = this.value;
        myChart.update();
        return;
    });

    $("#y-tick-colorpicker").on('change',function(){
        myChart.options.scales.y.ticks.color = this.value;
        myChart.update();
        return;
    });

    $("#edit_chart_type").on('change', function(){
        if($(this).val() == 4 || $(this).val() == 10){
            $("#create_chart").text("Create Table");
        }else{
            $("#create_chart").text("Create Chart");
        }
    });
    
    $("#datatype").on('change',function(){
        if($(this).val() == "%"){
            myChart.data.datasets.forEach((item) => {
                oldData.push(item);
            });
            myChart.data.datasets.forEach((element, index) => {
                var total = 0;
                element.data.forEach((item) => {
                    total += item;
                });
                var newData = [];
                element.data.forEach((item) => {
                    newData.push(item * 100 / total);
                });
                element.data = newData;
            });

            myChart.options.scales.y.ticks.callback = function(val, index) {
                return val + "%";
            };

        }else{
            myChart.data.datasets = [];
            oldData.forEach((item) => {
                myChart.data.datasets.push(item);
            });
            myChart.options.scales.y.ticks.callback = function(val, index) {
                return val;
            };
        }
        myChart.update();
        return;
    });

    // $("#datatype").on('change',function(){        
    //     if($(this).val() == "%"){
    //         var total = 0;
    //         myChart.data.datasets[0].data.forEach((item) => {
    //             total += item;
    //         });
    //         var newData = [];
    //         myChart.data.datasets[0].data.forEach((item) => {
    //             newData.push(item * 100 / total);
    //         });
    //         myChart.data.datasets[0].data = newData;

    //         myChart.options.scales.y.ticks.callback = function(val, index) {
    //             // Hide every 2nd tick label
    //             return val + "%";
    //         };

    //     }else{
    //         myChart.data.datasets[0].data = oldData;
    //         myChart.options.scales.y.ticks.callback = function(val, index) {
    //             // Hide every 2nd tick label
    //             var tmp = val.toString();
    //             return val;
    //         };
    //     }
    //     myChart.update();
    //     return;
    // });

    // $("#save_options").on('click',function(){
    //     var cdata = {
    //         chart_type: "",
    //         chart:[],
    //         series:{
    //             xbc:"#000000",
    //             xlc:"#000000",
    //             xtc:"#000000",
    //             ybc:"#000000",
    //             ylc:"#000000",
    //             ytc:"#000000"
    //         },
    //         axes:{
    //             width:0,
    //             height:0
    //         },
    //         title:{
    //             title:"",
    //             align:""
    //         },
    //         tooltip:[],
    //         backgroundColor:[],
    //         legend:{
    //             display : "",
    //             pointstyle : "",
    //             position : ""
    //         },
    //         font:{
    //             title: 0,
    //             xtick: 0,
    //             ytick: 0
    //         },
    //         type: "-",
    //         table : {
    //             hsize : 14,
    //             hfcolor : "#fff",
    //             hbcolor : "#ff0",
    //             bsize : 14,
    //             bfcolor : "#000",
    //             bocolor : "#eee",
    //             becolor : "#fff",
    //         }
    //     };

    //     cdata.chart_type = $("#edit_chart_type").val();

    //     cdata.table.hsize = $("#th-size").val();
    //     cdata.table.hfcolor = $("#th-fcolor").val();
    //     cdata.table.hbcolor = $("#th-bcolor").val();
    //     cdata.table.bsize = $("#tb-size").val();
    //     cdata.table.bfcolor = $("#tb-fcolor").val();
    //     cdata.table.bocolor = $("#tb-ocolor").val();
    //     cdata.table.becolor = $("#tb-ecolor").val();

    //     for(var i = 0; i < $(".label-text").length; i++){
    //         cdata.chart.push($(".label-text")[i].value);
    //     }

    //     cdata.series.xbc = $("#x-border-colorpicker").val();
    //     cdata.series.xlc = $("#x-line-colorpicker").val();
    //     cdata.series.xtc = $("#x-tick-colorpicker").val();
    //     cdata.series.ybc = $("#y-border-colorpicker").val();
    //     cdata.series.ylc = $("#y-line-colorpicker").val();
    //     cdata.series.ytc = $("#y-tick-colorpicker").val();

    //     cdata.axes.width = $("#chart-width").val();
    //     cdata.axes.height = $("#chart-height").val();

    //     cdata.title.title = $("#title-text").val();
    //     cdata.title.align = $("#title-align").val();
        
    //     cdata.font.title = $("#size-title").val();
    //     cdata.font.xtick = $("#x-size-tick").val();
    //     cdata.font.ytick = $("#y-size-tick").val();

    //     cdata.type = $("#datatype").val();
        

    //     for(var i = 0; i < $(".tooltip-text").length; i++){
    //         cdata.tooltip.push($(".tooltip-text")[i].value);
    //     }

    //     for(var i = 0; i < $(".chartcolorpicker").length; i++){
    //         cdata.backgroundColor.push($(".chartcolorpicker")[i].value);
    //     }

    //     cdata.legend.display = $("#show-legend").val();
    //     cdata.legend.pointstyle = $("#style-legend").val();
    //     cdata.legend.position = $("#position-legend").val();
            
    //     $.ajaxSetup({
    //         headers: {
    //             'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
    //         }
    //     });

    //     var arrURI = window.location.href.split("/");
    //     $.ajax({
    //         data: {
    //             ctxData:JSON.stringify(cdata),
    //             type:$("#edit_chart_type option:selected").val(),
    //             id: parseInt(arrURI[arrURI.length - 2])
    //         },
    //         url: "../save_chart",
    //         type: "POST",
    //         dataType: 'json',
    //         success: function(response){
    //             // template_alert("Grafico e tabella aggiornati", response.success);
    //             alert(response.success);
    //         },
    //         error: function(response){
    //             console.log(response);
    //         }
    //     });
    //     return;
    // });
    $("#create_chart").on('click',function(){
        var selected_text= $( "#edit_chart_type option:selected").text();
        

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
        $("#pie-chartdiv").hide();
        $('#bar-chartdiv').hide();
        $('#donut-chartdiv').hide();
        $('#d3bar-chartdiv').hide();
        $('#horizontal-chartdiv').hide();
        $('#line-chartdiv').hide();
        $('#polar-chartdiv').hide();
        $('#radar-chartdiv').hide();
        $('#radar1-chartdiv').hide();
        $('#bubble-chartdiv').hide();
        $('#no_table_chart').hide();
        $('#responsive_table').hide();
        $('#sortable_table').hide();
        $('#table_result').hide();
        $('#newChartArea').hide();

        $("#newChartArea").css({"margin":"0"});
        var dataForTable = [];

        switch(selected_text)
        {
            case "pie chart":
                {                        
                    pie_chart_draw(content, "");
                    $('#pie-chartdiv').show();
                    break;
                }  
            case "donut chart":
                {
                    donut_chart_draw(content, "");
                    $('#donut-chartdiv').show();
                    break;
                }                
                
            case "bar chart": 
                {
                    bar_chart_draw(content, "");
                    $('#bar-chartdiv').show();
                    break;
                } 
            case "3D bar chart": 
                {
                    d3bar_chart_draw(content, "");
                    $('#d3bar-chartdiv').show();
                    break;
                }               
            case "horizontal bar chart": 
                {
                    horizontal_bar_chart_draw(content, "");
                    $('#horizontal-chartdiv').show();
                    break;
                }   
            case "line chart": 
                {
                    line_chart_draw(content, "");
                    $('#line-chartdiv').show();
                    break;
                }  
            case "radar-chart": 
                {
                    radar_chart_draw(content, "");
                    $('#radar-chartdiv').show();
                    break;
                }
            case "radar1-chart": 
                {
                    radar1_chart_draw(content, "");
                    $('#radar1-chartdiv').show();
                    break;
                }
            case "polar chart": 
                {
                    polar_chart_draw_edit(content, "");
                    $('#polar-chartdiv').show();
                    break;
                } 
            case "bubble chart": 
                {
                    bubble_chart_draw_edit(content, "");
                    $('#bubble-chartdiv').show();
                    break;
                }  
            case "not chart and table": 
                {
                    noTableAndChartDraw(content, "");
                    // no_table_chart_draw_edit(content, "");
                    break;
                } 
            case "responsive-table": 
                {
                    responsive_tabledraw(content, "");
                    break;
                }
            case "sortable-table": 
                {
                    sortable_tabledraw(content, "");
                    break;
                }         
               
            case "table":
                {   
                    var html_content= `
                                <tr>
                                    <td><input type="text" placeholder="" class="form-control empty-cell" value="  " disabled></td>`;
            
                    for (var j=1;j< content[0].length ; j++)
                    {
                        html_content +=`<td><input type="text" placeholder="" class="form-control head" value="`+content[0][j]+`" disabled></td>`;
                    }
                    html_content += `</tr>`;
            
                    for (var i=1;i<content.length ; i++)
                    {
                        html_content +=`<tr>`;
                        html_content += `<td><input type="text" placeholder="" class="form-control head" value="`+content[i][0]+`" disabled></td>`;

                        for (var j=1;j< content[i].length; j++)
                        {
                            html_content += `<td> <input type="text"  value="`+ content[i][j] +`" class="form-control" ></td>`;
                        }
                        html_content +=`</tr>`;
                    }

                    $('#table_result').html(html_content);
                    $('#table_result').show();
                    break;
                }                       
            default:
            {                        
                drawChart(selected_text, content);
                break;
            }
        }
        return;
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
                html_cont += `<td> <input type="text"  placeholder="" class="form-control" id="`+idx+`" onfocus="selectItemFunction(event)"></td>`;
            }
            html_cont +=`</tr>`;
        }
        $("#real_matrix").append(html_cont);
        set_matrix_val();
    }
    
    $("#col_add").on('click',function(){
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

    $("#row_add").on('click',function(){
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


    $("#pie-chartdiv").hide();
    $('#bar-chartdiv').hide();
    $('#donut-chartdiv').hide();
    $('#d3bar-chartdiv').hide();
    $('#table_result').hide();
    $('#newChartArea').hide();
    $('#horizontal-chartdiv').hide();
    $('#line-chartdiv').hide();
    $('#bubble-chartdiv').hide();
    $('#radar-chartdiv').hide();
    $('#radar1-chartdiv').hide();
    $('#polar-chartdiv').hide();

    var content;
    var data = [];
    $('#save_data').on('click',function(e){


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
        for (var j=0;j< $("#row_panel").children().length ; j++)
        {
            content[j]=[];
            for (var i=0;i< $("#col_panel").children().length ; i++)
                content[j][i] = $('#real_matrix tr:eq('+j+')').find("td:eq("+i+") input[type='text']").val();
        }

        data = {
            'id':$("#chart_id").val(),
            'title':$("#title").val(),
            'test_ids' : JSON.stringify(selected_cat),
            'type_id' : $("#edit_chart_type option:selected").val(),
            'content': JSON.stringify(content)
        }; 

        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            }
        });

        $.ajax({
          data: data ,
          url: "../update",
          type: "POST",
          dataType: 'json',
          complete: function (response) {
            save_chart_option($("#chart_id").val());          
            ExpressionCalculation();
          },
          error: function (response) {
              console.log('Error:', response);
          }
      });

      //location.reload(); 
      
      setTimeout(() => {     
        $("#create_chart").show();
      }, 1000);
      
    });   
  
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        }
    });

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
                    operator_flag =1 ;
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
			if(infix_expression[i] !=undefined){
				if (infix_expression[i].includes("question") == true)
				{
                    var queid = infix_expression[i].split("question");
					for (var j=0;j<qdata_max.length; j++)
					{
						if (queid[1] == q_id[j])
							infix_expression[i] =qdata_max[j];
					} 
				}
				else if (infix_expression[i].includes("textgroup") == true)
				{
                    var textid = infix_expression[i].split("question");
					for (var j=0;j<tdata_max.length; j++)
					{
						if (textid[1] == t_id[j])
							infix_expression[i] = tdata_max[j];
					} 
				}
			}
              
        }
        return infix_expression;
    };

    var infix_evaluation= function(infix_expression)
    {
        var temp = [];
        let cnx = "";
        for( let j = 0; j < infix_expression.length; j++){
            cnx += infix_expression[j];
        }
        if(cnx.includes('<div') == true) {
            let formula = cnx;
            return formula;
        }
        cnx = cnx.replace("++", "+");
        cnx = cnx.replace("+*", "*");
        cnx = cnx.replace("+-", "-");
        cnx = cnx.replace("+/", "/");
        cnx = cnx.replace("-*", "*");
        cnx = cnx.replace("--", "-");
        cnx = cnx.replace("-+", "+");
        cnx = cnx.replace("-/", "/");
        cnx = cnx.replace("**", "*");
        cnx = cnx.replace("*-", "-");
        cnx = cnx.replace("*+", "+");
        cnx = cnx.replace("*/", "/");
        cnx = cnx.replace("/*", "*");
        cnx = cnx.replace("/-", "-");
        cnx = cnx.replace("/+", "+");
        cnx = cnx.replace("//", "/");
        cnx = cnx.replace("(+", "(");
        cnx = cnx.replace(")+", ")");
        cnx = cnx.replace("(*", "(");
        cnx = cnx.replace(")*", ")");
        cnx = cnx.replace("(-", "(");
        cnx = cnx.replace(")-", ")");
        cnx = cnx.replace("(/", "(");
        cnx = cnx.replace("/)", ")");
        try {
            let formula = eval(cnx);
            return formula;
        }catch(e){
            return cnx;
        }
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
        var data_testid = data_testid;
        var selected_val = text;
        if ($('#' + selectedItemID).val() != "" && $('#' + selectedItemID).val() != " ")
            selected_val = $('#' + selectedItemID).val() + "+" + text;
        $("#" + selectedItemID).val(selected_val);
    }
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

function line_stacked_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "line";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            options = {
                responsive: true,
                maintainAspectRatio: false,
                responsive: true,
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
                        beginAtZero : true,
                        title: {
                            display: true,
                            text: ''
                        }
                    },
                    y: {
                        beginAtZero : true,
                        stacked: true,
                        title: {
                            display: true,
                            text: ''
                        }
                    }
                }
            };

            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );



            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            var chartHTML = "";
             $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }

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

            
            if((ctxData != "") && (chartData != null)){
                if(chartData.backgroundColor.length == 0){
                    var tempHTML = "";
                    for(var j = 0; j < dCount; j++){
                        tempHTML = "<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input onchange='colorBlur()' type='color' class='form-control chartcolorpicker' style='width:100%;'></div>";
                        $("#option-chartdiv").append(tempHTML);
                    }     
                }
            }


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
                myChart.data.datasets.forEach(dataset => {
                    dataset.pointStyle = chartData.legend.pointstyle;
                    dataset.fill = true;
                });

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 
                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function area_radar_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "radar";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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

            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 


                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function scatter_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "scatter";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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

            var data = generateBubbleData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function radar_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "radar";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function polar_area_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);
    
    const type = "polarArea";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                

                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function pie_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "pie";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = (ctxData != null)?chartData.backgroundColor:[];
            var tmpColorArr = [];
            if(ctxData != null) {
                colorArr.forEach((item, index) => {
                    if(!Array.isArray(item)){
                        tmpColorArr[index] = [];
                        for(var t = 0; t < content.length - 1; t++){
                            tmpColorArr[index].push(generateRandomColor());
                        }
                    }
                });
                
            }
            
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
            
            var data = generatePieData(content, tmpColorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                // myChart.data.datasets.forEach((dataset, index) => {
                //     dataset.backgroundColor = chartData.backgroundColor[index];
                // });

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                

                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function multi_series_pie_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "pie";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generatePieData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                

                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function doughnut_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "doughnut";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){

            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generatePieData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
             $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
            
            if((ctxData != "") && (chartData != null)){
                if(chartData.backgroundColor.length == 0){
                    var tempHTML = "";
                    for(var j = 0; j < dCount; j++){
                        tempHTML = "<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input onchange='colorBlur()' type='color' class='form-control chartcolorpicker' value='#ffffff' style='width:100%;'></div>";
                        $("#option-chartdiv").append(tempHTML);
                    }     
                }
            }


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function combo_bar_line_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "bar";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                

                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function bubble_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "bubble";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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

            var data = generateBubbleData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function point_styling_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "line";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function line_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "line";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
            options = {
                responsive: true,
                maintainAspectRatio: false,
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 
                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function vertical_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "bar";    
    var arrURI = window.location.href.split("/");
    
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
                        beginAtZero : true,
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
                plugins: {
                  legend: {
                    fullWidth: false,
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
            
            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );
                
            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
            
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

            
            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return tooltipItem.dataset.label + " (" + tooltipItem.label + ":" + tooltipItem.formattedValue + ")";
                            // return chartData.tooltip[tooltipItem.dataIndex + " : " + tooltipItem.formattedValue];
                        }
                    }
                }; 

                 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("Apply %!");
                    return;
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}


function stacked_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "bar";
    var arrURI = window.location.href.split("/");
    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']         
            
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
                    beginAtZero : true,
                    stacked: true,
                  },
                  y: {
                    beginAtZero : true,
                    stacked: true
                  }
                }
            };

            var data = generateData(content, colorArr);
            dCount = data.datasets.length;
            config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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


            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                console.log(chartData);
                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                

                if((idx != "doughnut") && (idx != "multi-series-pie") && (idx != "pie") && (idx != "polar-area") && (idx != "radar")){
                    myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                    myChart.options.scales.x.grid.color = chartData.series.xlc;
                    myChart.options.scales.x.ticks.color = chartData.series.xtc;
                    myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                    myChart.options.scales.y.grid.color = chartData.series.ylc;
                    myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                    myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                    myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                }
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }
                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}

function horizontal_draw_edit(content, idx){

    document.getElementById("myChart").remove();
    var canvasElem = document.createElement("canvas");
    canvasElem.id = "myChart";
    document.getElementById("newChartArea").append(canvasElem);

    const type = "bar";    
    var arrURI = window.location.href.split("/");

    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }
            var colorArr = ['#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#F0F0F0', '#0000FF', '#00FFFF', '#0F0F0F', '#AAAAAA', '#B0B0B0']        
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
                        text: 'Chart.js Horizontal Bar Chart'
                    },
                    tooltip: {
                    }
                }
            };

            var data = generateData(content, colorArr);            
            dCount = data.datasets.length;
            var config = {
                type: type,
                data: data,
                options: options
            };

            myChart = new Chart(
                document.getElementById('myChart'),
                config
            );

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            console.log(chartData);
            var chartHTML = "";
            $("#option-chartdiv").html("");
            if(Object.keys(chartData.chart).length == undefined || Object.keys(chartData.chart).length == 0)
            {
                console.log(myChart.data.datasets.length);
                for(var i=0;i<myChart.data.datasets.length;i++)
                {
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = colorArr[i];
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };  
            }
            else {
                for(var i=0;i<Object.keys(chartData.chart).length;i++) {
                    var item=chartData.chart[i];
                    chartHTML = `<div class='color-set'><label>Label:</label><input onblur='labelBlur()' type='text' class='form-control label-text' style='width:100%;'><label>Color:</label><input id="color_pick_${i}" type='color' class='form-control chartcolorpicker' style='width:100%;'></div>`;
                    $("#option-chartdiv").append(chartHTML);
                    $(".chartcolorpicker")[i].value = item;
                    $(".label-text")[i].value = myChart.data.datasets[i].label;
                };
            }
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
            

            if(chartData != null){
                
                myChart.options.plugins.title.display = true;
                myChart.options.plugins.title.text = (chartData.title.title == "")?"Title":chartData.title.title;
                myChart.options.plugins.title.align = chartData.title.align;    
            
                myChart.options.plugins.legend.display = chartData.legend.display;
                myChart.options.plugins.legend.position = chartData.legend.position;
                
               

                myChart.options.plugins.tooltip = {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return chartData.tooltip[tooltipItem.dataIndex];
                        }
                    }
                }; 

                for(var i=0;i<myChart.data.datasets.length;i++)
                    myChart.data.datasets[i].backgroundColor= convertToTransparentColor( $(".chartcolorpicker")[i].value),myChart.data.datasets[i].borderColor = convertToTransparentColor($(".chartcolorpicker")[i].value);
                myChart.canvas.style.height = chartData.axes.height + 'px';
                setTimeout(function(){
                    myChart.canvas.style.width = chartData.axes.width + 'px';
                },300)
                
                myChart.options.scales.x.grid.borderColor = chartData.series.xbc;
                myChart.options.scales.x.grid.color = chartData.series.xlc;
                myChart.options.scales.x.ticks.color = chartData.series.xtc;
                myChart.options.scales.y.grid.borderColor = chartData.series.ybc;
                myChart.options.scales.y.grid.color = chartData.series.ylc;
                myChart.options.scales.y.ticks.color = chartData.series.ytc;
                myChart.options.plugins.tooltip.enabled=chartData.tooltip.display;
                myChart.options.plugins.tooltip.backgroundColor=chartData.tooltip.backgroundColor;
                myChart.options.plugins.tooltip.cornerRadius=chartData.tooltip.radius;
                
                
                myChart.options.scales.x.ticks.font = { size : (chartData.font.xtick==0)?13:chartData.font.xtick };
                myChart.options.scales.y.ticks.font = { size : (chartData.font.ytick==0)?13:chartData.font.ytick };
                myChart.options.plugins.title.font.size = (chartData.font.title==0)?13:chartData.font.title;
                if(chartData.type == "%"){
                    console.log("%");
                }else{
                    myChart.data = data;
                }

                
                myChart.update();

            }

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}


function drawChart(selectedText, content){

    switch(selectedText){
        case "horizontal":
            horizontal_draw_edit(content, "");
            break;
        case "stacked":
            stacked_draw_edit(content, "");
            break;
        case "vertical":
            vertical_draw_edit(content, "");
            break;
        case "line":
            line_draw_edit(content, "");
            break;
        case "point-styling":
            point_styling_draw_edit(content, "");
            break;
        case "bubble":
            bubble_draw_edit(content, "");
            break;
        case "combo-bar-line":
            combo_bar_line_draw_edit(content, "");
            break;
        case "doughnut":
            doughnut_draw_edit(content, "");
            break;
        case "multi-series-pie":
            multi_series_pie_draw_edit(content, "");
            break;
        case "pie":
            pie_draw_edit(content, "");
            break;
        case "polar-area":
            polar_area_draw_edit(content, "");
            break;
        case "radar":
            radar_draw_edit(content, "");
            break;
        case "scatter":
            scatter_draw_edit(content, "");
            break;
        case "area-radar":
            area_radar_draw_edit(content, "");
            break;
        case "line-stacked":
            line_stacked_draw_edit(content, "");
            break;
        default:
            horizontal_draw_edit(content, "");
            break;
    }

    $("#newChartArea").show();
    return;
}

function tooltipBlur(){

    var tooltips = [];
    for(var i = 0; i < $(".tooltip-text").length; i++){
        tooltips.push($(".tooltip-text")[i].value);
    }
    
    myChart.options.plugins.tooltip = {
        callbacks: {
            label: function(tooltipItem, data) {
                return tooltips[tooltipItem.dataIndex];
            }
        }
    }; 

    myChart.update();
    return;
}

function convertToTransparentColor(color, opacity){
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return color + Number(alpha * 255).toString(16).split(".")[0];
}

function colorBlur(){
    myChart.data.datasets.forEach((item,index) => {
        if(Array.isArray(item.backgroundColor))
            for(var v=0;v<item.backgroundColor.length;v++){
                item.backgroundColor[v] = convertToTransparentColor($(".chartcolorpicker")[v].value, 0.5);
                item.borderColor[v] = $(".chartcolorpicker")[v].value;
            }
        else {
            item.backgroundColor = convertToTransparentColor($(".chartcolorpicker")[index].value, 0.5);
                item.borderColor = $(".chartcolorpicker")[index].value;
        }
    });
    myChart.update();
    return;
}

function labelBlur(){
    myChart.data.datasets.forEach((item, index) => {
        item.label = $(".label-text")[index].value;
    });
    myChart.update();
    return;
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

        return 0;
    });

    var resultHTML = "<p></p>";
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
            resultHTML += "<p><span></span>The " + item.label.toLowerCase() + " of " + item.name + " is " + item.value;
            return;
        }
        resultHTML += ", the " + item.label.toLowerCase() + " is " + item.value;
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

function doResponsive(instance) {
    var width = instance.chart.width;
    chart.options.legend.display = width > 500;
    console.log("okay")
    // ...
}

function sortable_tabledraw(content, idx){

jQuery("#th-bcolor").val("#ffffff")
    jQuery("#tb-ocolor").val("#ffffff")
    jQuery("#tb-ecolor").val("#ffffff")
    var arrURI = window.location.href.split("/");

    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }

            sortable_table_draw(content, "");

            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  

            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            if(chartData != null){
                $("#th-size").val(chartData.table.hsize);
                $("#th-fcolor").val(chartData.table.hfcolor);
                $("#th-bcolor").val(chartData.table.hbcolor);
                $("#tb-size").val(chartData.table.bsize);
                $("#tb-fcolor").val(chartData.table.bfcolor);
                $("#tb-ocolor").val(chartData.table.bocolor);
                $("#tb-ecolor").val(chartData.table.becolor);
                $("#tb-width").val(chartData.table.width);
                $("#tb-height").val(chartData.table.height);

                $("#sortable_table th").css("font-size", chartData.table.hsize+'px');
                $("#sortable_table th").css("color", chartData.table.hfcolor);
                $("#sortable_table th").css("background-color", chartData.table.hbcolor);
                $("#sortable_table td").css("font-size", chartData.table.bsize+'px');
                $("#sortable_table td").css("color", chartData.table.bfcolor);
                $("#sortable_table tbody tr:odd").css("background-color", chartData.table.bocolor);
                $("#sortable_table tbody tr:even").css("background-color", chartData.table.becolor);
                $("#sortable_table table").css("width",chartData.table.width+'px')
                $("#sortable_table table").css("height",chartData.table.height+'px')
                for(var i=0;i<$(".custom tr").length;i++)
                    $(".custom tr").eq(i).children().eq(0).css("font-size", $("#th-size").val()+'px');
            }

            $("#options-div .list-group-item").removeClass("active");
            $("#option-tablediv").show();
            $("#option-chartdiv").hide();
            
           // $("#options-div .list-group-item:last-child").addClass("active");

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
}
function responsive_tabledraw(content, idx){

    jQuery("#th-bcolor").val("#ffffff")
    jQuery("#tb-ocolor").val("#ffffff")
    jQuery("#tb-ecolor").val("#ffffff")
    var arrURI = window.location.href.split("/");

    $.ajax({
        data: { id: parseInt(arrURI[arrURI.length - 2]) },
        url: "../get_chart_options",
        type: "GET",
        dataType: 'json',
        contentType : 'application/json; charset=UTF-8',
        success: function(response){
            const ctxData = response['ctxData'][0]['ctxData'];
            
            var chartData = null;
            if((ctxData != "") && (ctxData != null)){
                chartData = JSON.parse(ctxData);
            }


            responsive_table_draw(content, "");


            $("#x-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xbc:"#000000");
            $("#x-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xlc:"#000000");
            $("#x-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.xtc:"#000000");
            $("#y-border-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ybc:"#000000");
            $("#y-line-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ylc:"#000000");
            $("#y-tick-colorpicker").val(((ctxData != "") && (chartData != null))?chartData.series.ytc:"#000000");

            $("#chart-width").val(((ctxData != "") && (chartData != null))?((chartData.axes.width==0)?600:chartData.axes.width):"600");
            $("#chart-height").val(((ctxData != "") && (chartData != null))?((chartData.axes.height==0)?400:chartData.axes.height):"400");

            $("#title-text").val(((ctxData != "") && (chartData != null))?chartData.title.title:"");
            $("#title-align").val(((ctxData != "") && (chartData != null))?chartData.title.align:"center");                

            $("#show-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.display:"true");
            $("#style-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.pointstyle:"circle");
            $("#position-legend").val(((ctxData != "") && (chartData != null))?chartData.legend.position:"top");  
            
            $("#x-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.xtick!=0)?chartData.font.xtick:"13"):"16");  
            $("#y-size-tick").val(((ctxData != "") && (chartData != null))?((chartData.font.ytick!=0)?chartData.font.ytick:"13"):"16");  
            $("#size-title").val(((ctxData != "") && (chartData != null))?((chartData.font.title!=0)?chartData.font.title:"13"):"20");  


            $("#datatype").val(((ctxData != "") && (chartData != null))?chartData.type:"-");
            
            
            
            var chartHTML = "";

            if(chartData != null){
                $("#th-size").val(chartData.table.hsize);
                $("#th-fcolor").val(chartData.table.hfcolor);
                $("#th-bcolor").val(chartData.table.hbcolor);
                $("#tb-size").val(chartData.table.bsize);
                $("#tb-fcolor").val(chartData.table.bfcolor);
                $("#tb-ocolor").val(chartData.table.bocolor);
                $("#tb-ecolor").val(chartData.table.becolor);
                $("#tb-width").val(chartData.table.width);
                $("#tb-height").val(chartData.table.height);
                

                $("#responsive_table th").css("font-size", chartData.table.hsize+'px');
                $("#responsive_table th").css("color", chartData.table.hfcolor);
                $("#responsive_table th").css("background-color", chartData.table.hbcolor);
                $("#responsive_table td").css("font-size", chartData.table.bsize+'px');
                $("#responsive_table td").css("color", chartData.table.bfcolor);
                $("#responsive_table tbody tr:odd").css("background-color", chartData.table.bocolor);
                $("#responsive_table tbody tr:even").css("background-color", chartData.table.becolor);
                $("#responsive_table table").css("width",chartData.table.width+'px')
                $("#responsive_table table").css("height",chartData.table.height+'px')
                
                for(var i=0;i<$(".custom tr").length;i++)
                    $(".custom tr").eq(i).children().eq(0).css("font-size", $("#th-size").val()+'px');

            }

            $("#option-chartdiv").hide();
            $("#option-seriesdiv").hide();
            $("#option-axesdiv").hide();
            $("#option-titlediv").hide();
            $("#option-tooltipdiv").hide();
            $("#option-legenddiv").hide();
            $("#option-tablediv").hide();
            $("#options-div .list-group-item").removeClass("active");
            $("#option-tablediv").show();
            $("#options-div .list-group-item:last-child").addClass("active");

        },
        error: function(response){
            console.log(response);
        }
    });
    
    return 0;
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

        cdata.table.hsize = $("#th-size").val();
        cdata.table.hfcolor = $("#th-fcolor").val();
        cdata.table.hbcolor = $("#th-bcolor").val();
        cdata.table.bsize = $("#tb-size").val();
        cdata.table.bfcolor = $("#tb-fcolor").val();
        cdata.table.bocolor = $("#tb-ocolor").val();
        cdata.table.becolor = $("#tb-ecolor").val();
        cdata.table.height = $("#tb-height").val();
        cdata.table.width = $("#tb-width").val();

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
                type:$("#edit_chart_type option:selected").val(),
                id: mid
            },
            url: "../save_chart",
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