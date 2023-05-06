var QuestionCreate = function() {

    // Global var
    var currentRow = 1;
    var numberCol = 0;
    var numberRow = 0;
    var updateOutput = function(e) {};
    
    /**
    * Set the Default Question Type to Signle Input
    **/
    //$("#question_type").val("0");
    
    /**
    * On Question Input Type Change
    * Show the Relevant Question Box
    **/
    $('#question_type').change(function() {
        //Hide All Input Question Types
        $(".question-box").hide();
        
        var selected_text = parseInt($("#question_type option:selected").val());
        $("#more_than_one_answer_box").hide();
        $("#score-box").hide();
        switch (selected_text) {
            //Single Input
            case 0:
                $('#single_input_part').show();
                $("#more_than_one_answer_box").show();
                //$("#score-box").show();
                break;
            //Checkbox
            case 1:
                $('#checkbox_part').show();
                $("#score-box").hide();
                break;
            //RadioGroup
            case 2:
                $('#radiogroup').show();
                $("#score-box").hide();
                break;
            //ImagePart
            case 3:
                $('#image_part').show();
                break;
            //Matrix
            case 4:
                $('#matrix_part').show();
                break;
            //Rating
            case 5:
                $('#rating_part').show();
                var increment = 10;
                $("#rating_part .radio").each(function(){
                    $(this).find('.radio_label').val(increment);
                    increment+=10;
                });
                $("#score-box").hide();
                break;
            //Dropdown
            case 6:
                $('#dropdown_part').show();
                break;
            //File
            case 7:
                $('#file_upload_input').show();
                break;
            //Star
            case 8:
                $('#rating_part').show();
                var i = 1;
                $("#rating_part .radio").each(function(){
                    $(this).find('.radio_label').val(i++);
                });
                $("#score-box").hide();
                break;
            //Range
            case 9:
                $('#rangs_part').show();
                break;
            //€
            case 10:
                $('#euro_part').show();
                break;
            default:
                $('#single_input').show();
                break;
        }

    });
    
    // $('.condition-sample').hide();

    $('.qt_name').ready(function () {
        var qt_nm = $('.tree_1').siblings(".qt_name");
        var qt_id = [];
        for(var k = 0; k < qt_nm.length; k++){
            var val = qt_nm[k].value;
            if(val) qt_id[k] = val.split('.')[0];
        }

        if (qt_id.length > 0) {
            for(var i = 0; i < qt_id.length; i++){
                var logiccontent=$(qt_nm[i]).parent().siblings(".logic-content");
                ajax_make_logic(qt_nm[i], qt_id[i], logiccontent);
            }
        }
    })

    var image_part_data = [];
    $(".image-upload-form").on('change', function(e) {
        e.preventDefault();
        var v = $('.image_score').map(function(idx, elem) {
            return $(elem).val();
        }).get();
        let formData = new FormData(this);
        $.ajax({
            type: 'POST',
            url: '/user/questions/upload-images',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response) {
                    if($('#question_id').val()){
                        if(e.target.type == "file"){
                            var imge_names = $(e.target).siblings();
                            $(imge_names[0]).val("");
                            var len = response.img_name.length;
                            $(imge_names[0]).val(response.img_name[len-1]);
                        }
                    }else{
                        var temp_img = {};
                        temp_img['image'] = response.img_name;
                        temp_img['score'] = v;
                        image_part_data = temp_img;
                        console.log(image_part_data);
                    }
                }

            },
            error: function(response) {
                console.log(response);
            }
        })
    });
    
    var question_img_data = [];
    $("#img").on('change', function(e) {
        e.preventDefault();
        let formData = new FormData($("#question_type_image")[0]);
        var route = '/user/questions/upload-images';
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            type: 'POST',
            url: route,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                swal('success','Image uploaded to the server.','success');
                $("#quiz_img").val(response.img_name);
            },
            error: function(response) {
                swal('error','Error in uploading the image.','error');
            }
        })
    });
    
    var check_id = 2;
    var check_dro_id = 2;
    var col_add = 0;

    $('#checkbox_part').on('click', '.del-btnx', function() {
        // var parentID = $(this).parent().attr('id');
        // var id = parentID.split('_')[2];
        // console.log(id);
        $(this).parent().remove();
    });

    $("#check_add").on('click', function() {
        check_id++;
        $("#sortable-10").append(`
        <div class="checkbox">
            <label  style="color:transparent"><input type="checkbox" value="">Option 1 </label>  
            <input class="check_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input type="text" class="checkbox_score" value="0" style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });
    
    $("#check_add_euro").on('click', function() {
        $("#euro_part #sortable-12").append(`
        <div class="checkbox">
            <label  style="color:transparent"><input type="checkbox" value="">Option 1 </label>  
            <input class="check_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input type="text" class="checkbox_score" value="0" style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });


    $('#radio_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });
    
    $(document).on("click", "#euro_part #sortable-12 .checkbox .del-btnx", function(){
        $(this).parent().remove();
    })

    $("#radio_add").on('click', function() {
        check_id++;
        $("#sortable-11").append(`
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="opt_radiogroup">Option 1</label>
            <input class="radio_label" type="text" value="radio" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#dropdown_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });


    $("#dropdown_add").on('click', function() {
        check_id++;
        $("#sortable_drop").append(`
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="radio">Option</label>
            <input class="radio_label" type="text" value="` + check_id + `" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#rating_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });

    $('#rangs_part').on('click', '.del-btnx', function() {
        $(this).parent().remove();
    });

    $("#rating_add").on('click', function() {
        check_id++;
        $("#sortable_rating").append(`
        <div class="radio">
            <label  style=""><input type="radio" name="optradio" checked>Option</label>
            <input class="radio_label" type="text" value="` + check_id + `" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="` + 12 + `">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`);
    });

    $('#image_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().parent().parent().parent().remove();
    });

    $('#col_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    $('#row_panel').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    var html_cont, score_cont;
    $('#mat_update').on('click', function() {
        $('#real_matrix').children().remove();
        $('#score_matrix').children().remove();
        html_cont = `
                        <tr>
                            <td><input type="text" placeholder="" class="form-control" value="  " disabled></td>`;

        for (var i = 2; i <= $("#col_panel").children().length; i++) {
            html_cont += `<td>`;
            var caption = $("#col_panel div:nth-child(" + i + ")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control" value="` + caption + `" disabled>`;
            html_cont += `</td>`;
        }
        html_cont += `</tr>`;

        for (var j = 2; j <= $("#row_panel").children().length; j++) {
            html_cont += `<tr><td width="15%">`;
            var caption = $("#row_panel div:nth-child(" + j + ")").find("input").val();
            html_cont += `<input type="text" placeholder="" class="form-control" value="` + caption + `" disabled></td>`;

            for (var i = 2; i <= $("#col_panel").children().length; i++) {
                html_cont += `<td> <input type="text"  placeholder="" class="form-control" ></td>`;
            }
            html_cont += `</tr>`;
        }
        $("#real_matrix").append(html_cont);

        $("#score_matrix").append(html_cont);
    });

   
    var no_coulmns = 0;
    var questiontype = '';
    var row_column = 0;
    $("#add_col").on('click', function(e) {
        if($('#add-matrix th').length == 0){
            e.preventDefault();
        }else{
            row_column = $('#add-matrix tr').length - 1;
            console.log(row_column);
            questiontype = $("#matrix_symbol").val();
            $('#row_add').data('columns',parseInt($("#row_add").data('columns'))+1);
            var add_q_id = 1;
            col_add++;
            var last_Q_id = parseInt($('#last_q_id').val());
            var q_id = last_Q_id + add_q_id;
            numberCol--;
            var scoreinput = '';
            var radiocol = '';
            if($(".selecttype").val() == "radio"){
                $("#add-matrix").attr('matrix-type', 'radio');
                scoreinput = '<input type="text" data-q_id="q_id'+col_add+'" data-value="" class="form-control col-10 d-inline radioscore" value=""  onchange="radioScore(this)">';
                radiocol = 'col-2';
            }
            if($('#add-matrix tr').length <= 2){
                var add_head_col = '<th scope="row" class="custom-border"><label contenteditable="true" class="form-label">Column</label></th>';
                var add_col = '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+$(".selecttype").val()+' value="" name="matrix'+$(".selecttype").val()+row_column+'" class="form-control radioselected d-inline '+radiocol+' q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="q_id'+col_add+'">'+scoreinput+'</td>';
            }else{
                if(numberCol > 2){
                    var add_col = '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+$(".selecttype").val()+' value="" name="matrix'+$(".selecttype").val()+row_column+'" class="form-control radioselected d-inline '+radiocol+'  q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="q_id'+col_add+'">'+scoreinput+'</td>';
                }
            }
            $("#header_row_col"+(currentRow-1)).append(add_head_col);
            $("#mr"+(currentRow-1)).append(add_col);
            }
    });

    // Delete Row
    $("#add-matrix").on("click", "#delete_matrix_row", function() {
        $(this).closest("tr").remove();
        if($('#add-matrix tr').length == 1){
            $("#header_row_col"+(($('#add-matrix tr').length))).remove();
            $("#add_col").slideDown();
            $('#row_add').data('columns',0);
        }
        currentRow--;
        numberRow--;
     });

    $("#row_add").on('click', function() {
        var columns = parseInt($(this).data('columns'));
        if($('#add-matrix tr').length>=1){
            currentRow =  $('#add-matrix tr').length;
        }
        if($("#question_id").val()){
            col_add = $('#add-matrix tr td').length;
            columns = (col_add/(currentRow-2))-2;
        }
        numberCol = $("#add-matrix tr th").length;
        numberRow = $('#add-matrix tr').length;
        var row_column = numberRow - 1;
        // if($("#mr"+currentRow).length){
        //     currentRow = currentRow + 1;

        // }
        var add_row = '';
        if(numberRow <= 0){
            if(($('#add-matrix tr').length+1) == 1){
                add_row += '<tr id="header_row_col'+currentRow+'"><th class="custom-hide">Action</th><th class=""></th></tr>';
            }
        }
        
        var scoreinput = '';
        var radiocol = '';
        var add_col = '';
        
        if(currentRow > 1){
            row_column ++;
            $("#add_col").slideUp();
            for(var i=0;i<columns;i++){
                col_add++;
                var selecttype = "text";
                if($(".selecttype").val() == "radio" || $("#add-matrix").attr('matrix-type') == "radio"){
                    selecttype = "radio";
                    scoreinput = '<input type="text" data-q_id="q_id'+col_add+'" data-value="" class="form-control col-10 d-inline radioscore" value="" onchange="radioScore(this)">';
                    radiocol = 'col-2';
                }
                add_col += '<td class="col-3 custom-border"><input id="q_id'+col_add+'" type='+selecttype+' value="" name="matrix'+selecttype+row_column+'" class="form-control radioselected d-inline '+radiocol+' q_id[q_id]'+col_add+'" onchange="inputToData(this)" data-questiontype="'+questiontype+'" data-value="" data-selected="false" data-q_id="q_id'+col_add+'">'+scoreinput+'</td>';
            }

        }
        add_row += '<tr id="mr'+currentRow+'"><td class="custom-hide"><button class="btn btn-danger" id="delete_matrix_row"><i class="fa fa-trash"></i></button></td><td scope="row" class="custom-border"><label contenteditable="true" class="form-label ">Row</label></td></tr>';
        
        $("#add-matrix").append(add_row);        
        $("#mr"+currentRow).append(add_col);        
        currentRow++;
        numberCol++;
        // alert($("</div>").append($("#add-matrix").clone()).html());
    //     $("#row_panel").append(`
    //     <div class="row" >
    //         <div class="col-2">
    //             <select class="form-control input-small select2me" data-placeholder="Select...">
    //              <option value="single_input" >Single Input</option>
	// 				<option value="checkbox">Checkbox</option>
	// 				<option value="radiogroup">Radiogroup</option>
	// 				<option value="file">File</option>
    //             </select>
                      
    //         </div>
    //         <div class="col-2">
    //             <input type="text" value="Input" style="z-index:20;" class="form-control">
                
    //         </div>
    //         <div class="col-2">
    //             <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="11">
    //                 <i class="fa fa-trash" style="color:white"></i>
    //             </a>
    //         </div>
    //     </div>
    //    `);
    });


    var content, score;
    var data = [];
    var matrix_data = '';
    $('#save_data').on('click', function(e) {
        
        // alert(document.getElementById("more_than_one_answer").checked);
        
        // alert($("<div />").append($("#add-matrix").clone()).html());
        // return;
        // If FormSubmitFlag is true then submit the form
        var formSubmitFlag = true;
        var errorMessage = "";
        
        //If the Question Text is Missing, Show Error Message
        // if(CKEDITOR.instances.question_content.getData().length<=0){
        //     swal("Warning","Please write the question!","warning");
        //     return;
        // }
        
        //Get Question Type
        var type_id = parseInt($("#question_type option:selected").val());
        //Get Score
        var score = $("#score").val();
        
        // Content for Question Type
        var content;
        // Validate Form Based on the Question Type
        switch(type_id) {
            //Single Input
            case 0:
                var temp_arr = [];
                $value = $("#single_input_part").find("#single_input_value").val()
                temp_arr.push({
                    'value':$value,
                    'width': $("#single_input_part").find("#single_input_width").val(),
                    'height': $("#single_input_part").find("#single_input_height").val()
                })
                content = JSON.stringify(temp_arr);
                break;
            //Checkbox
            case 1:
                var temp_arr = [];
                $("#checkbox_part #sortable-10 .checkbox").each(function(e){
                    if($(this).find(".check_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Checkbox Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".check_label").val();
                    checkbox_content['score'] = $(this).find(".checkbox_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find(".check_box_q").is(":checked") ? 1 : 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_checkbox").val()
                });
                temp_arr.push({
                    'display' : $("#display_checkbox option:selected").text()
                });
                content = JSON.stringify(temp_arr);
                break;
            //RadioGroup
            case 2:
                var temp_arr = [];
                $("#radiogroup .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Group Field Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find("input[type='radio']").is(":checked") ? 1 : 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_radiogroup").val()
                });
                temp_arr.push({
                    'display' : $("#display_radiogroup option:selected").text()
                });
                content = JSON.stringify(temp_arr);
                break;
            //Rating
            case 5:
            //Star
            case 8:
                var temp_arr = [];
                $("#rating_part #sortable_rating .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Group Field Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find("input[type='radio']").is(":checked") ? 1 : 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'col' : $("#display_rating").val(),
                });
                temp_arr.push({
                    'display' : $("#display_rating option:selected").text(),
                });
                temp_arr.push({
                    'color' : $("#color").val()
                });
                content = JSON.stringify(temp_arr);
                break;
            //ImagePart
            case 3:
                var temp_arr = [];
                if($("#question_id").val()){
                    var v = $('.image_score').map(function(idx, elem) {
                        if($(elem).val() != ""){
                        return $(elem).val()}
                    }).get();
                    var images = $('.imge_names').map(function(idx, elem) {
                        if($(elem).val() != ""){
                            return $(elem).val()}
                    }).get();
                    var temp_img = {};
                    temp_img['image'] = images;
                    temp_img['score'] = v;
                    image_part_data = temp_img;
                    temp_arr.push(image_part_data);
                    
                }else{
                    temp_arr.push(image_part_data);
                    // $("#image_part .image_part_file").each(function(e){
                    //     $(this).find(".image_score").val().trim()
                    //     if($(this).find(".image_score").val().trim() == ""){
                    //         formSubmitFlag = false;
                    //         errorMessage = "Image Score Missing!";
                    //     }
                    //     var image_files = {};
                    //     image_files['score'] = ($(this).find(".image_score").val().trim() == 'undefined')?0:$(this).find(".image_score").val().trim();
                    //     temp_arr.push(image_files);
                    // });
                }
                temp_arr.push({
                    'col' : $("#display_image").val()
                });
                temp_arr.push({
                    'display' : $("#display_image option:selected").text(),
                });
                content = JSON.stringify(temp_arr);
                $('#image_part').show();
                break;
            //Matrix
            case 4:
                let text_vals = [];
                let checked_vals = [];
                $('.radioselected').each(function(){
                    let vals = [];
                    vals.push($(this).data('q_id'));
                    vals.push($(this).val());
                    text_vals.push(vals);
                    if($(this).is(":checked")){
                        checked_vals.push($(this).data('q_id'));
                    }
                });
                $('#add-matrix td input[type="radio"]').each(function (i,ele) {
                    let id = $(ele).data("q_id");
                    if(checked_vals.includes(id)) {
                        $(ele).attr('checked', 'checked');
                    }else{
                        $(ele).removeAttr('checked');
                    }
                });
                $("#symbol_matrix_value").html("<tr><th>Value in "+$("#matrix_symbol").val()+"</th></tr>");
                $('#add-matrix td input[type="text"]').each(function (i,ele) {
                    // if($('#add-matrix').attr('matrix-type') == 'checkbox'){
                        let id = $(ele).data("q_id");
                        for(var i = 0; i < text_vals.length; i++) {
                            if(id == text_vals[i][0]) {
                                $(ele).attr('value', text_vals[i][1]);
                                break;
                            }
                        }
                    // }
                });
                $('#add-matrix td input[type="checkbox"]').each(function (i,ele) {
                    if($(ele).is(":checked")){
                        let vals = [];
                        checked_vals.push($(this).data('q_id'));
                    }
                });
                console.log(checked_vals);
                matrix_data = $("<div />").append($("#add-matrix").clone()).html();
                if($("#add-matrix tr").length > 1){
                    formSubmitFlag = true;
                }
                $('#matrix_part').show();
                break;
            //Dropdown
            case 6:
                var temp_arr = [];
                $("#dropdown_part #sortable_drop .radio").each(function(e){
                    if($(this).find(".radio_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Radio Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".radio_label").val();
                    checkbox_content['score'] = $(this).find(".radio_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find("input[type='radio']").is(":checked") ? 1 : 0;
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push($('#display_radio').val());
                content = JSON.stringify(temp_arr);
                break;
            //File
            case 7:
                $('#file_upload_input').show();
                var temp_arr = [];
                $value = $("#file_upload_input").find("#num_files").val();
                var file_acceptable_exts = $("#file_upload_input").find("#file_acceptable_exts").val();
                var file_max_size = $("#file_upload_input").find("#file_max_size").val();
                temp_arr.push({
                    'number':$value,
                    'file_acceptable_exts': file_acceptable_exts,
                    'file_max_size': file_max_size
                })
                content = JSON.stringify(temp_arr);
                break;
            //Range
            case 9:
                var temp_content = {};
                temp_content['min_value'] = $("#rangs_part #range_min_value").val() ?? 0 ;
                temp_content['max_value'] = $("#rangs_part #range_max_value").val() ?? 0;
                temp_content['steps'] = $("#step_value").val() ?? 0;
                score = $("#rangs_part .radio_score").val() ?? 0;
                temp_content['symbol'] = $("#rangs_part #range_symbol").val() ?? 0;
                temp_content['type'] = $("#rangs_part #range_type").val() ?? 0;
                content = JSON.stringify(temp_content);
                break;
            //€
            case 10:
                var temp_arr = [];
                $("#euro_part #sortable-12 .checkbox").each(function(e){
                    if($(this).find(".check_label").val().trim()==""){
                        formSubmitFlag = false;
                        errorMessage = "Checkbox Title Missing!";
                    }
                    var checkbox_content = {};
                    checkbox_content['label'] = $(this).find(".check_label").val();
                    checkbox_content['score'] = $(this).find(".checkbox_score").val().trim() ?? 0;
                    checkbox_content['is_checked'] =  $(this).find("input[type='radio']").is(":checked") ? 1 : 0;
                    checkbox_content['label'] = $(this).find(".check_label").val();
                    temp_arr.push(checkbox_content);
                });
                temp_arr.push({
                    'width': $("#euro_part").find("#euro_input_width").val(),
                    'height': $("#euro_part").find("#euro_input_height").val()
                })
                content = JSON.stringify(temp_arr);
                break;
            default:
                $('#single_input').show();
                break;
        }
        
        if(formSubmitFlag==false){
            swal("error",errorMessage,"error");
            return;
        }
        var selected = [],
            selected_cat = [];
        $('#tests_id option:selected').each(function() {
            selected[$(this).val()] = $(this).val();
        });
        var k = 0;
        for (var i = 0; i < selected.length; i++) {
            if (selected[i] != null) {
                selected_cat[k] = selected[i];
                k++;
            }
        }
        // Bilal Change
        // var route = '/user/questions/update';
        // Original One 
        var route = '/user/questions';
        var answerposition = $("#answerposition").val();
        var imageposition = $("#imageposition").val();
        var answer_aligment = $("#answer_aligment").val();
        var image_aligment = $("#image_aligment").val();
        var question_bg_color = $("#question_bg_color").val();
        var color1 = $("#color1").val();
        var color2 = $("#color2").val();
        var logic = logic_build();
        // if(logic == ""){
        //     alert($(".qt_type").val());
        // }
        
        if($("#question_id").val()){
        
            route = route + "/update";
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            route = route ;  
                // Orignal Ajax 
         //fin ajax 
            $.ajax({
                    data : {
                        /**
                    * Form Data
                    **/
                   'question_id': $("#question_id").val(),
                   '_method' : 'PUT',
                   'type_id': type_id,
                   'test_ids': selected_cat,
                   'question': CKEDITOR.instances.question_content.getData(), //$("#question_content").val(),
                   'help_info': CKEDITOR.instances["help-editor"].getData(), //$("#help-editor").val(),
                   'questionimage': $("#quiz_img").val() ?? null,
                   'score': score,
                   'content': content,
                   'logic': JSON.stringify(logic),
                   'answerposition' : answerposition,
                   'image_aligment' : image_aligment,
                   'answer_aligment' : answer_aligment,
                   'imageposition' : imageposition,
                   'question_bg_color': question_bg_color,
                   //Properties
                   
                   //'page' : $("#question_page").val(),
                   //'order' :$("#question_order").val(),
                   'required': $("#required").is(":checked") ? 1 : 0,
                   'more_than_one_answer': $("#more_than_one_answer").is(':checked') ? 1 : 0,
                   'state': $("#state option:selected").val() ?? null,
                   
                   'titlelocation': $("#title_location option:selected").val() ?? null,
                   'help_info_location': $("#help_info_location option:selected").val() ?? null,
                   
                   'indent': $("#indent").val() ?? null,
                   'width': $("#width").val() ?? null,
                   'min_width': $("#min_width").val() ?? null,
                   'max_width': $("#max_width").val() ?? null,
                   
                   'size': $("#size").val() ?? null,
                   'fontsize': $("#font_size").val() ?? "",
                   
                   'imagefit': $("#image_fit option:selected").val() ?? '',
                   'imagewidth': $.trim($("#image_width").val()) ?? '',
                   'imageheight': $.trim($("#image_height").val()) ?? '',
                   'matrix_data' : matrix_data,
                   
                   'color1': color1,
                   'color2': color2,
                    },
                ////url: "{{ route('questions.store') }}",
                url: route,
                type: "POST",
                dataType: 'json',
                success: function(response) {
                    swal("Success", "Question Updated!", "success");
                },
                error: function(response) {
                    var responseTextObject = jQuery.parseJSON(response.responseText);
                    swal("Error!", "Fill in the form correctly!", "error");
                }
            });
        }
        else{
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            $.ajax({
                data: {
                    /**
                    * Form Data
                    **/
                    'type_id': type_id,
                    'test_ids': selected_cat,
                    'question': CKEDITOR.instances.question_content.getData(), //$("#question_content").val(),
                    'help_info': CKEDITOR.instances["help-editor"].getData(), //$("#help-editor").val(),
                    'questionimage': $("#quiz_img").val() ?? null,
                    'score': score,
                    'content': content,
                    'logic': JSON.stringify(logic),
                    'answerposition' : answerposition,
                    'image_aligment' : image_aligment,
                    'answer_aligment' : answer_aligment,
                    'imageposition' : imageposition,
                    'question_bg_color': question_bg_color,
                    //Properties
                    
                    //'page' : $("#question_page").val(),
                    //'order' :$("#question_order").val(),
                    'required': $("#required").is(":checked") ? 1 : 0,
                    'more_than_one_answer': $("#more_than_one_answer").val() ?? 0,
                    'state': $("#state option:selected").val() ?? null,
                    
                    'titlelocation': $("#title_location option:selected").val() ?? null,
                    'help_info_location': $("#help_info_location option:selected").val() ?? null,
                    
                    'indent': $("#indent").val() ?? null,
                    'width': $("#width").val() ?? null,
                    'min_width': $("#min_width").val() ?? null,
                    'max_width': $("#max_width").val() ?? null,
                    
                    'size': $("#size").val() ?? null,
                    'fontsize': $("#font_size").val() ?? "",
                    
                    'imagefit': $("#image_fit option:selected").val() ?? '',
                    'imagewidth': $.trim($("#image_width").val()) ?? '',
                    'imageheight': $.trim($("#image_height").val()) ?? '',
                    'matrix_data' : matrix_data,

                    'color1': color1,
                    'color2': color2,
                },
                ////url: "{{ route('questions.store') }}",
                url: route,
                type: "POST",
                success: function(response) {
                    if(response.add == 1){
                        $("#add_another_question").css('display','inline');
                    }
                    swal("Success", "Question Created!", "success");
                },
                error: function(response) {
                    var responseTextObject = jQuery.parseJSON(response.responseText);
                    swal("Error!", "Fill in the form correctly!", "error");
                }
            });
        }
        //
    });

    $("#width").on('change', function() {
        $(".main-content").css("width", $("#width").val());
    });
    $("#font_size").on('change', function() {
        $('div').css("font-size", parseInt($("#font_size").val()));
        $('input').css("font-size", parseInt($("#font_size").val()));
    });
    $("#indent").on('change', function() {
        $(".main-content").css("margin-left", parseInt($("#indent").val()));
    });

    $("#image_width").on('change', function() {
        $(".fileinput-preview").css("width", parseInt($("#image_width").val()));
    });

    $("#image_height").on('change', function() {
        $(".fileinput-preview").css("height", parseInt($("#image_height").val()));
    });
    $("#image_fit").on('change', function() {
        $(".fileinput-preview").css("object-fit", $("#image_fit option:selected").text());
    });

    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.file').change(function() {
        let reader = new FileReader();
        reader.onload = (e) => {
            $('.display-image-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);
    });
    
    $('#img').change(function() {

        let reader = new FileReader();
        reader.onload = (e) => {
            $('#preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(this.files[0]);
    });

    $(".image-upload-form").on('click', '.add-btn', function() {
        var lsthmtl = $(".clone-sample").html();
        $(".increment").after(lsthmtl);
    });
    $(".image-upload-form").on("click", ".del-btn", function() {
        $(this).parents(".image_part_file").remove();
    });

    // $(".logic_part").on('click','#logic_open',function(){ 

    //     $("#sortable-14").show();

    // });

    $(".logic_part").on('click', '#condition_add', function() {

        var logichmtl = $(".clone").html();
        var id_list = $('#sortable-14').children().map(function() {
            return $(this).attr('id');
        });
        var len = id_list.length;
        logichmtl = `<div class="logic_condition row " id="logic_condition_`+ len +`" style="padding-top:10px;">` + logichmtl + `</div>`;
        $("#sortable-14").append(logichmtl);
        UITree.init();
    });

    $('.logic_part').on('click', '.del-btnx', function() {
        $(this).parent().parent().remove();
    });

    $(document).on('select_node.jstree','.tree_1', function(e,data) { 

        var str = $('#' + data.selected).text();
        var logiccontent=$(this).parent().siblings(".logic-content");
        var qt_type_in= $(this).parent().siblings(".qt_type");
        var qt_nm = $(this).siblings(".qt_name");

        var name= str.split(".");
        if (name.length>1)
        {
            var qt_id =name[0];            

        e.preventDefault();
    // $(this).html('Sending..');

        $.ajax({
            data: {id:qt_id},
        //url: "{{ route('questions.store') }}",
            url: "get_info",
            type: "GET",
            dataType: 'json',
            success: function(response){
            var type=response[0]['questiontype']; 
            var content= JSON.parse(response[0]['content']);
            var html_append=``; 

            qt_type_in.val(type);
            qt_nm.val(response[0]['id']);


            if (type == 0)
            {
                html_append =
                    `<div class="row main-content"  >
                        <div class="col-8 form-group">
                        <label>Please enter/select the value </label>  
                        <input type="textarea" class="form-control">

                        </div>
                        <div class="col-4">
                            <div class="form-body">                                    
                                <div class="form-group ">
                                    <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                                     style="max-height: 150px;">
                                </div>

                            </div>
                        </div>
                    </div> `;
            }

            if (type == 1)
            {
                html_append =
            `
                <div class="col-8 form-group logic_view">`;
            for(var i = 0; i< content.length; i++)    
                html_append +=
                `<div  class="checkbox">
                    <label><input type="checkbox" class="check_box_q">` + content[i]+ `</label>                      
                </div>`;

            html_append +=       
                `</div>                
                <div class="col-4">
                    <div class="form-body">                                    
                        <div class="form-group ">
                            <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                             style="max-height: 150px;">
                        </div>

                    </div>

            </div>`;
            }

            if (type == 2)
            {
                html_append =`           
                <div class="col-8 form-group logic_view">`;
            for(var i = 0; i< content.length; i++)    
                html_append +=
                `<div  class="radio">
                    <label><input type="radio">` + content[i]+ `</label>                      
                </div>`;

            html_append +=       
                `</div>                
                <div class="col-4">
                    <div class="form-body">                                    
                        <div class="form-group ">
                            <img class="display-image-preview" src="/uploads/image/`+ response[0]['questionimage']+`"
                             style="max-height: 150px;">
                        </div>

                    </div>

            </div>`;
            }

            if (type == 3)
            {
                html_append =`           
                <div class="col-12 form-group logic_view">`;           

                    for(var i = 0;i< content.length; i++)
                        html_append +=
                        `<div class="col-md-3 col-sm-6 image_box" style="padding:10px;width:7vw;height:10vw;" display="inline-flex" >
                            <div  class="checkbox">
                                <input type="checkbox" class="img_check`+ i +`">                      
                                </div>
                            <img src="/uploads/image/` + content[i]+`"  width="90%" height="80%" style="max-width:100%; max-height:100%;">
                            </div>`;

                html_append += `</div>`;


            }

            if (type == 4)
            {
                html_append =
                    `<div class="row main-content"  >
                        <div class="col-12 form-group">
                        <label>Please enter/select the value </label>  
                        <input type="text" class="form-control">

                        </div>

                    </div> `;
            }

            logiccontent.html(html_append);


            },
            error: function(response){
            console.log(response);
            }
        });
        }

        $(this).hide();
    });

    $(".tree_1").hide();
    $(document).on('click', '.qt_name', function(e) {
        //debugger;
        $(this).siblings(".tree_1").show();

    });

    $(document).on('click', '.check_box_q', function () {
        $('.check_box_q').not(this).prop('checked', false);    
    })

    var logic_build = function() {
        var logic = [];
        var id_list;

        id_list = $('#sortable-14').children().map(function() {
            return $(this).attr('id');
        });
        console.log('id_list',id_list);
        for (var i = 0; i < id_list.length; i++) {
            if($("#logic_condition_"+i).length > 0){
                logic[i] = [];
                logic[i][0] = $("#logic_condition_"+i).find(".first_operator").val();
                logic[i][1] = $("#logic_condition_"+i).find(".qt_name").val().split('.')[0];
                logic[i][2] = $("#logic_condition_"+i).find(".operators").val();
                var qt_type = $("#logic_condition_"+i).find(".qt_type").val();
                if (qt_type == 0) {
                    logic[i][3] = [];
                    var k = 0;
                    logic[i][3][k] = $("#logic_condition_"+i).find("textarea").val();
                }
                if (qt_type == 1) {
                    var cnt = $("#logic_condition_"+i).find(".logic_check").children().length;
                    logic[i][3] = [];
                    var k = 0;
                    for (var j = 0; j < cnt; j++) {
                        if ($("#logic_condition_"+i).find(".logic_check  .checkbox_" + j).is(':checked') == true){
                            logic[i][3][k] = $("#logic_condition_"+i).find(".logic_check  .checkbox_" + j).attr('value');
                            k++;
                        }
                    }
                }
                if (qt_type == 2) {
                    var cnt = $("#logic_condition_"+i).find(".logic_radio").children().length; //is(':checked');
                    logic[i][3] = [];
                    var k = 0;
                    for (var j = 0; j < cnt; j++) {
                        if ($("#logic_condition_"+i).find(".logic_radio  .radio_" + j).is(":checked") == true){
                            logic[i][3][k] = $("#logic_condition_"+i).find(".logic_radio  .radio_" + j).attr('value');
                            k++;
                        }
                    }
                    console.log(logic[i][3]);
                }
                if (qt_type == 3) {
                    var cnt = $("#logic_condition_"+i).children().length; //is(':checked');
                    logic[i][3] = [];
                    var k = 0;
                    for (var j = 0; j < cnt; j++) {
                        if ($("#logic_condition_"+i).find(".imagebox_" + j).is(':checked') == true){
                            logic[i][3][k] = $("#logic_condition_"+i).find(".imagebox_" + j).attr('value');
                            k++;
                        }
                    }
                }
                if (qt_type == 4) {
                    logic[i][3] = [];
                    var k = 0;
                    logic[i][3][k] = $("#logic_condition_"+i).find("textarea").val();
                }

                if (qt_type == 5) {
                    var cnt = $("#logic_condition_"+i).find("#sortable_rating").children().length;
                    logic[i][3] = [];
                    var k = 0;
                    for (var j = 0; j < cnt; j++) {
                        if ($("#logic_condition_"+i).find(".radio  .radio_" + j).is(":checked") == true){
                            // var radio = $("#logic_condition_"+i).find(".radio");
                            logic[i][3][k] = j + 1;
                            k++;
                        }
                    }
                }

                if (qt_type == 6) {
                    var cnt = $("#logic_condition_"+i).find("#sortable_drop").children().length;
                    logic[i][3] = [];
                    var k = 0;
                    for (var j = 0; j < cnt; j++) {
                        if ($("#logic_condition_"+i).find(".radio  .radio_" + j).is(":checked") == true){
                            logic[i][3][k] = $("#logic_condition_"+i).find(".radio  .radio_" + j).attr('value');
                            k++;
                        }
                    }
                }

                if (qt_type == 7) {
                    console.log(qt_type);
                }

                if (qt_type == 8) {
                    var cnt = $("#logic_condition_"+i).find("#sortable_stars").children().length;
                    logic[i][3] = [];
                    for (var j = 0; j < cnt; j++) {
                        var k = 0;
                        if ($("#logic_condition_"+i).find(".radio  .radio_" + j).is(":checked") == true){
                            var radio = $("#logic_condition_"+i).find(".radio");
                            logic[i][3][k] = j + 1;
                            k++;
                        }
                    }
                }

                if (qt_type == 9) {
                    console.log(qt_type);
                }

                if(logic[i][1] == '' || logic[i][1] == null) logic.splice(i, 1);
            }
        }
        var newLogic = logic.filter(function(el){
            return el != null || el != "" || el.length != 0;
        })
        return newLogic;
    };

    var ajax_make_logic = function (qt_nm, qt_id, logiccontent) {
        var route = "/user/questions/get_info";
        var html_append=``; 
        var qt_type_in= $(logiccontent).siblings(".qt_type");
        $.ajax({
            data: {id:qt_id},
            url: route,
            type: "GET",
            dataType: 'json',
            success: function(response){
            var type=response[0].questiontype; 
            // var logic_id = response[0].id;
            if(response[0].content != ""){
                var content= response[0].content;
                qt_type_in.val(type);
                $(qt_nm).val(response[0].id+"."+response[0].question);
                if (type == 0)
                {
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    html_append +=
                        `<div class="row main-content" id="cond_`+ response[0].id +`"  >
                            <div class="col-8 form-group">
                            
                            <div class="form-group form-md-line-input">
                                <textarea class="form-control" rows="1">`+ logic_value[0] +`</textarea>
                                <label for="form_control_1">Please enter/select the value</label>
                            </div>                     
                     
                        
                            </div>
                            <div class="col-4">
                                <div class="form-body">                                    
                                    <div class="form-group ">
                                        <img class="display-image-preview" src="/uploads/image/`+ response[0].questionimage+`"
                                         style="max-height: 150px;">
                                    </div>
                    
                                </div>
                            </div>
                        </div> `;
                }

                if (type == 1)
                {
                   var datacontent = JSON.parse(response[0].content);
                   var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    html_append +=
                    `<div class="row main-content" id="cond_`+ response[0].id +`" >                    
                        <div class="col-7 form-group logic_check" style="margin-left:20px;">`;
                        var is_checked = "";
                        if(logic_value.length > 0){
                            var s = 0;
                            $.each(datacontent,function(index,value){
                                if(value.label){
                                    if(logic_value[s] == value.score){
                                        is_checked = 'checked';
                                        s++;
                                    }else{
                                        is_checked = '';
                                        console.log(is_checked);
                                    }
                                    html_append +=
                                    `<div  class="checkbox">
                                        <label><input class="checkbox_`+ index +` check_box_q" value="`+ value.score +`" type="checkbox" `+ is_checked +`>` + value.label+ `</label>
                                    </div>`;
                                }
                            });
                        }else{  
                            $.each(datacontent,function(index,value){
                                if(value.label){
                                    if('is_checked' in value){
                                        if (value.is_checked == 1) {
                                            is_checked = "checked";
                                        }else{
                                            is_checked = "";
                                        }
                                    }
                                    html_append +=
                                    `<div  class="checkbox">
                                        <label><input class="checkbox_`+ index +` check_box_q" value="`+ value.score +`" type="checkbox" `+ is_checked +`>` + value.label+ `</label>               
                                    </div>`;
                                }
                            });
                        }
                        html_append +=       
                                `</div>                
                                <div class="col-4">
                                    <div class="form-body">                                    
                                        <div class="form-group ">
                                            <img class="display-image-preview" src="/uploads/image/`+ response[0].questionimage+`"
                                            style="max-height: 150px;">
                                        </div>
                                    </div>
                                </div>                    
                            </div>`;
                }

                if (type == 2)
                {
                    var datacontent = JSON.parse(response[0].content);
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    html_append +=`
                    <div class="row main-content" id="cond_`+ response[0].id +`"  >       
                        <div class="col-7 form-group logic_radio" style="margin-left:20px;">`;
                        if(logic_value.length > 0){
                            $.each(datacontent,function(index,value){
                                if(value.label){
                                    var is_checked = "";
                                    if(logic_value[0] == value.score){
                                        var is_checked = 'checked';
                                        html_append +=
                                        `<div  class="radio">
                                            <label><input name="radiogroup" value="`+ value.score +`" class="radio_`+ index  +`" type="radio" `+ is_checked +`>` + value.label+ `</label>                      
                                        </div>`;
                                    }else{
                                        html_append +=
                                            `<div  class="radio">
                                                <label><input name="radiogroup" value="`+ value.score +`" class="radio_`+ index  +`" type="radio" `+ is_checked +`>` + value.label+ `</label>                      
                                            </div>`;
                                    }
                                }
                                
                            });
                        }else{
                            $.each(datacontent,function(index,value){
                                if(value.label){
                                    var is_checked = "";
                                    if(('is_checked' in value)){
                                        if (value.is_checked == 1) {
                                            is_checked = "checked";
                                        }
                                    }
                                    html_append +=
                                    `<div  class="radio">
                                        <label><input name="opt_radiogroup" value="`+ value.score +`" class="radio_`+ index  +`" type="radio" `+ is_checked +`>` + value.label+ `</label>                      
                                    </div>`;
                                }
                                
                            });
                        }
                                
                        html_append +=       
                            `</div>                
                            <div class="col-4">
                                <div class="form-body">                                    
                                    <div class="form-group ">
                                        <img class="display-image-preview" src="/uploads/image/`+ response[0].questionimage+`"
                                        style="max-height: 150px;">
                                    </div>
                    
                                </div>
                            </div>                    
                        </div>`;
                }

                if (type == 3)
                {
                    var datacontent = JSON.parse(response[0].content);
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    html_append +=`   
                    <div class="row main-content logic_img" id="cond_`+ response[0]['id'] +`"  >    
                        `;           
                    var s = 0;
                    var image_len = datacontent[0].image.length;
                    for(var i = 0; i < image_len; i++){
                        var is_checked = "";
                        if(logic_value.length > 0){
                            if(logic_value[s] == i){
                                var is_checked = "checked";
                                console.log(is_checked);
                                html_append +=
                                `<div class="col-md-3 col-sm-6 image_box" style="padding-left:20px;width:7vw;height:10vw;" display="inline-flex" >
                                    <div  class="checkbox">
                                        <input class="imagebox_`+ i +`" type="checkbox" class="img_check`+ i +`" `+ is_checked +` value="`+ i +`">                      
                                    </div>
                                    <img src="/uploads/image/` + datacontent[0].image[i] +`"  width="50px" height="50px" style="object-fit:fill">
                                </div>`;
                                s++;
                            }else {
                                html_append +=
                                `<div class="col-md-3 col-sm-6 image_box" style="padding-left:20px;width:7vw;height:10vw;" display="inline-flex" >
                                    <div  class="checkbox">
                                        <input class="imagebox_`+ i +`" type="checkbox" class="img_check`+ i +`" `+ is_checked +` value="`+ datacontent[0].score[i] +`">                      
                                    </div>
                                    <img src="/uploads/image/` + datacontent[0].image[i] +`"  width="50px" height="50px" style="object-fit:fill">
                                </div>`;
                            }
                        }else{
                            if('is_checked' in datacontent[i]){
                                if (datacontent[i]['is_checked'] == 1) {
                                    is_checked = "checked";
                                }
                                html_append +=
                                `<div class="col-md-3 col-sm-6 image_box" style="padding-left:20px;width:7vw;height:10vw;" display="inline-flex" >
                                    <div  class="checkbox">
                                        <input class="imagebox_`+ i +`" type="checkbox" class="img_check`+ i +`" `+ is_checked +` value="`+ datacontent[i].score[i] +`">                      
                                    </div>
                                    <img src="/uploads/image/` + datacontent[i].image[i] +`"  width="50px" height="50px" style="object-fit:fill">
                                </div>`;
                            }
                        }
                    }
                        

                    html_append += `
                        </div>`;
                }

                if (type == 4)
                {
                    html_append =
                        `<div class="row main-content" id="cond_`+ response[0].id +`"  >
                            <div class="col-12 form-group">
                            
                                <div class="form-group form-md-line-input">
                                    <textarea class="form-control" rows="1"></textarea>
                                    <label for="form_control_1">Please enter/select the value</label>
                                </div>  
                            </div>
                        </div> `;
                        html_append = response[0].content;
                }
                if (type == 5) {
                    html_append = '<div class="col-12 form-group" id="sortable_rating">';
                    var cont = JSON.parse(content);
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    var len = 0;
                    for(var i = 0; i < cont.length; i++){
                        if(cont[i].label){
                            len++;
                        }
                    }
                    for(var i = 0; i < len; i++){
                        var is_checked = "";
                        if(logic_value.length > 0){
                            if(logic_value[0] == i + 1){
                                is_checked = "checked";
                            }
                            html_append += `
                                <div class="radio">
                                    <label  style="color:transparent"><input name="rating" class="radio_`+ i +`" value="`+ cont[i].value +`" type="radio" `+ is_checked +`>Option</label>
                                    <input class="radio_label" type="text" value="`+cont[i].label+`" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;" required>
                                    <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                                        <i class="fa fa-trash" style="color:white"></i>
                                    </a>
                                </div>
                                `;
                        }else{
                            if('is_checked' in cont[i]){
                                if (cont[i]['is_checked'] == 1) {
                                    is_checked = "checked";
                                }
                            }
                            html_append += `
                            <div class="radio">
                                <label  style="color:transparent"><input name="rating" class="radio_`+ i +`" value="`+ cont[i].value +`" type="radio" `+ is_checked +`>Option</label>
                                <input class="radio_label" type="text" value="`+cont[i].label+`" style="margin-left:-2vw;;margin-right:5vw;z-index:20;" required>
                                <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                                    <i class="fa fa-trash" style="color:white"></i>
                                </a>
                            </div>
                            `;
                        }
                    }
                    html_append += `</div>`;
                }

                if (type == 6) {
                    html_append = `<div class="col-12  form-group " id="sortable_drop">`;
                    var cont = JSON.parse(content);
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    for(var i = 0; i < cont.length - 1; i++){
                        var is_checked = "";
                        if(logic_value.length > 0){
                            if(logic_value[0] == i + 1){
                                is_checked = "checked";
                            }
                        }
                        else if('is_checked' in cont[i]){
                            if (cont[i]['is_checked'] == 1) {
                                is_checked = "checked";
                            }
                        }
                        html_append += `
                        <div class="radio">
                            <label  style="color:transparent"><input name="dropdown" class="radio_`+ i +`" value="`+ cont[i].value +`" type="radio" `+ is_checked +`>Option 1</label>
                            <input class="radio_label" type="text" value="`+cont[i].label+`" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
                            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                                <i class="fa fa-trash" style="color:white"></i>
                            </a>
                        </div>
                        `;
                    }
                    html_append += `</div>`;
                }

                if (type == 7) {
                    console.log('File');
                }

                if(type == 8){
                    html_append = `<div class="col-12  form-group " id="sortable_stars">`;
                    var cont = JSON.parse(content);
                    var logic_value = $(logiccontent).siblings("input[name='logic_"+ qt_id +"[]']").map(
                        function(){
                            return $(this).val();
                        }
                    ).get();
                    var len = 0;
                    // var logic_val = $(".logic_"+logic_id).val();
                    for(var i = 0; i < cont.length; i++){
                        if(cont[i].label){
                            len++;
                        }   
                    }
                    for(var i = 0; i < len; i++){
                        var is_checked = "";
                        if(logic_value.length > 0){
                            if(logic_value[0] == i + 1){
                                is_checked = "checked";
                            }
                        }else{
                            if('is_checked' in cont[i]){
                                if (cont[i]['is_checked'] == 1) {
                                    is_checked = "checked";
                                }
                            }
                        }
                        html_append += `
                        <div class="radio">
                            <label  style="color:transparent"><input type="radio" class="radio_`+ i +`" value="`+ cont[i].value +`" name="stars" `+ is_checked +`>Option 1</label>
                            <input class="radio_label" type="text" value="`+cont[i].label+`" style="margin-left:-2vw;;margin-right:5vw;z-index:20;border:none;">
                            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="41">
                                <i class="fa fa-trash" style="color:white"></i>
                            </a>
                        </div>
                        `;
                    }
                    html_append += `</div>`;
                }

                if(type == 9){
                    var cont = JSON.parse(content);
                    html_append = `<div class="col-12">`;
                    html_append += `
                        <div class="col-12  form-group " id="sortable_drop1">
                            <div class="radio">
                                <label  style="">
                                    Min Value
                                    <input id="range_min_value" type="text" name="optradio" value="`+cont.min_value+`">
                                </label>
                                Max Value 
                                <input id="range_max_value" type="text" class="radio_label" value="`+cont.max_value+`">
                                <label>Step</label>
                                <input id="step_value" type="text"  class ="radio_score mr-2" placeholder="`+response[0]['score']+`">
                            </div>
                        </div>
                        <div class="col-12">
                        <div class="form-group">
                            <label>Select Symbol</label>
                            <select id="range_symbol" class="form-control">`;

                            if(cont.symbol == "0") html_append += `<option value="0" selected>None</option><option value="1">€</option></select>`;
                            if(cont.symbol == "1") html_append += `<option value="0">None</option><option value="1" selected>€</option></select>`;
                        html_append += `
                            </div>
                                <div class="form-group">
                                    <label>Range Type</label>
                                    <select id="range_type" class="form-control">`;
                            if(cont.symbol == "0") html_append += `<option value="1" selected>Cursor Bar</option><option value="1">+/- Button</option></select>`;
                            if(cont.symbol == "1") html_append += `<option value="2">Cursor Bar</option><option value="1" selected>+/- Button</option></select>`;
                        html_append += `</div>`;
                    html_append += `</div>`;
                    html_append += `</div>`;
                }

                logiccontent.html(html_append);    
            }
            
            
            },
            error: function(response){
            console.log(response);
            }
        });
    }

    return {
        //main function to initiate the module
        init: function() {

        }
    };


    

}();

