
var TextgroupCreate = function () {

    for (var ids = 0; ids < 10; ids++) {
        if (ids != 0)
            $("#text_" + ids).hide();
        for (var j = 0; j < 10; j++)
            if (j != 0)
                $(".logic_condition_" + j).hide();
    }


    $(".condition_add").on('click', function () {

        var d = $(this).siblings(".sortable-14").find(".logic_cnt").val();
        d++;
        if (d == 10) d = 0;
        $(this).siblings(".sortable-14").find(".logic_cnt").val(d.toString());
        var text_id = $(this).siblings(".sortable-14").find(".logic_cnt").attr("id").split("_")[2];

        $("#text_" + text_id + " .logic_condition_" + (d - 1)).show();

    });

    $('.logic_part').on('click', '.del-btnx', function () {
        $(this).parent().parent().remove();
    });

    var text_id = 0
    $(document).on('click', '#text_add', function () {
        text_id++;
        if (text_id == 10) text_id = 0;
        $("#text_" + text_id).show();
    });

    $(document).on('click', ':checkbox', function () {
        var main_content = $(this).closest('.main-content');
        $(main_content).find(':checkbox').not(this).prop('checked', false);    
    })

    $(".tree_3").hide();
    $(document).on('click', '.qt_name', function (e) {

        $(this).siblings(".tree_3").show();

    });

    var logic = [];
    var id_list = [];

    var logic_build = function () {           
        var first_id=0;     
      
        var temp = $('.sortable-14 .main-content').map(function() {
            return $(this).attr('id');
        }); 
   
        var t=0;  id_list[0]=[];
        for (var k=0;k< temp.length;k++)
        {
            if (temp[k] == "cond_0")
            {
                t++; first_id=1;
            }
            else
            {
                if(first_id==1)
                {
                    id_list[t]=[];
                    first_id=0;
                }
                id_list[t].push(temp[k]);
            }
        }
       
           
        for (var k=0;k<id_list.length;k++ )
        {
            logic[k] =[];
            for (var i=0;i<id_list[k].length; i++)
            {
                logic[k][i] =[];
                logic[k][i][0] = $("#text_"+k+" .sortable-14 .logic_condition_"+i).find(".first_operator").val();                
                logic[k][i][1] = id_list[k][i].split("_")[1];
                logic[k][i][2] = $("#text_"+k+" .sortable-14 .logic_condition_"+i).find(".operators").val();
                var qt_type = $("#text_"+k+" .sortable-14 .logic_condition_"+i).find(".qt_type").val();

                if(qt_type == 0)
                {
                    logic[k][i][3] =$("#text_"+k+" #"+id_list[k][i]).find("textarea").val();
                }
                if(qt_type == 1)
                {
                    var cnt=$("#text_"+k+" #"+id_list[k][i]).find(".logic_check").children().length;
                    //logic[k][i][3] =0;
                    let checkeds = [];
                    for (var j=0;j< cnt; j++)
                    {
                        let check_val = 0;
                        if( $("#text_"+k+" #"+id_list[k][i]).find(".logic_check  .checkbox_"+j).is(':checked') == true)
                            check_val = 1;
                        checkeds.push(check_val);
                            //logic[k][i][3]+= Math.pow(2,cnt-j-1);
                    }
                    logic[k][i][3] = JSON.stringify(checkeds);
                }
                if(qt_type == 2)
                {
                    var cnt= $("#text_"+k+" #"+id_list[k][i]).find(".logic_radio").children().length;//is(':checked');
                    //logic[k][i][3] =0;
                    let checkeds = [];
                    for (var j=0;j< cnt; j++)
                    {
                        let check_val = 0;
                        if($("#text_"+k+" #"+id_list[k][i]).find(".logic_radio  .radio_"+j).is(':checked') == true)
                            check_val = 1;
                        checkeds.push(check_val);
                            //logic[k][i][3]+= Math.pow(2,cnt-j-1);
                    }
                    logic[k][i][3] = JSON.stringify(checkeds);
                }
                if(qt_type == 3)
                {
                    var cnt=$("#text_"+k+" #"+id_list[k][i]).children().length;//is(':checked');
                    //logic[k][i][3] =0;
                    let checkeds = [];
                    for (var j=0; j< cnt; j++)
                    {
                        let check_val = 0;
                        if($("#text_"+k+" #"+id_list[k][i]).find(".imagebox_"+j).is(':checked') == true)
                            check_val = 1;
                        checkeds.push(check_val);
                            //logic[k][i][3]+= Math.pow(2,cnt-j-1);
                    }
                    logic[k][i][3] = JSON.stringify(checkeds);
                }
                if(qt_type == 4) {
                    let input_vals = [];
                    let rowcnt = $("#text_" + k + " #" + id_list[k][i]).find('table tbody tr').length;
                    let colcnt = $("#text_" + k + " #" + id_list[k][i]).find('table tbody th').length;
                    let input_idx = 1;
                    for (let i = 1; i < rowcnt; i++) {
                        for (let j = 1; j < colcnt; j++) {
                            let input_val = $('#q_id'+input_idx).val();
                            input_vals.push(input_val);
                            input_idx++;
                        }
                    }
                    logic[k][i][3] = JSON.stringify(input_vals);
                    //logic[k][i][3] = $("#text_" + k + " #" + id_list[k][i]).find("textarea").val();
                }

                if(qt_type == 5 || qt_type == 8)
                {
                    var cnt=$("#text_"+k+" #"+id_list[k][i]).find(".logic_radio").children().length;
                    //logic[k][i][3] =0;
                    let checkeds = [];
                    for (var j=0;j< cnt; j++)
                    {
                        let check_val = 0;
                        if( $("#text_"+k+" #"+id_list[k][i]).find(".logic_radio  .radio_"+j).is(':checked') == true)
                            check_val = 1;
                        checkeds.push(check_val);
                            //logic[k][i][3]+= Math.pow(2,cnt-j-1);
                    }
                    logic[k][i][3] = JSON.stringify(checkeds);
                }

                if(qt_type == 6)
                {
                    var cnt=$("#text_"+k+" #"+id_list[k][i]).find(".logic_radio").children().length;
                    //logic[k][i][3] =0;
                    let checkeds = [];
                    for (var j=0;j< cnt; j++)
                    {
                        let check_val = 0;
                        if( $("#text_"+k+" #"+id_list[k][i]).find(".logic_radio  .radio_"+j).is(':checked') == true)
                            check_val = 1;
                        checkeds.push(check_val);
                            //logic[k][i][3]+= Math.pow(2,cnt-j-1);
                    }
                    logic[k][i][3] = JSON.stringify(checkeds);
                }
            }
        }
    };


    var data = [];
    $(document).on('click', '#save_data', function (e) {

        logic_build();

        var selected = [], selected_cat = [];
        $('#tests_id option:selected').each(function () {
            selected[$(this).val()] = $(this).val();
        });

        for (var i = 0; i < selected.length; i++) {
            if (selected[i] != null)
                selected_cat.push(selected[i]);
        }

        var content = [];
        var score = [];
        for (var i = 0; i < id_list.length; i++) {
            content[i] = $("#textarea_" + i).val();
            score[i] = $("#score_" + i).val();
        }

        data = {
            'title': $("#title").val(),
            'score': JSON.stringify(score),
            'test_ids': JSON.stringify(selected_cat),
            //'order' :$("#question_order").val(),
            // 'imageheight' : $.trim($("#image_height").val()),
            'content': JSON.stringify(content),
            'logic': JSON.stringify(logic)
        };
        e.preventDefault();

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
            data: {data: data},
            url: "store",
            type: "POST",
            dataType: 'json',
            complete: function (response) {
                //alert("Data is successfully stored.");

            },
            error: function (response) {
                console.log('Error:', response);
            }
        });

        location.reload();
    });


    return {
        //main function to initiate the module
        init: function () {

        }
    };

}();





