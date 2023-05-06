var QuestionEdit = function () {

    var updateOutput = function (e) {
    };

    var check_id=2;

    $('#checkbox_part').on('click','.del-btnx',function(){
        $(this).parent().remove();
    });

    $("#check_add").on('click',function(){
        console.log(check_id);
        check_id++;
        $("#sortable-10").append(`
        <div class="checkbox">
            <label  style="color:transparent"><input type="checkbox" value="">Option 1 </label>  
            <input class="check_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label  >Score</label>
            <input  class="checkbox_score" type="text"   value="" style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="`+12+`">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`
        );
    });

    $('#radio_part').on('click','.del-btnx',function(){
        $(this).parent().remove();
    });


    $("#radio_add").on( 'click',function(){
        console.log(check_id);
        check_id++;
        $("#sortable-11").append(`
        <div class="radio">
            <label  style="color:transparent"><input type="radio" name="optradio" checked>Option 1</label>
            <input class="radio_label" type="text" value="Check1" style="margin-left:-2vw;margin-right:5vw;z-index:20;border:none;">
            <label label>Score</label>
            <input class="radio_score" type="text"  style="margin-right:1vw">
        
            <a class="btn btn-xs mb-2 btn-danger del-btnx" style="cursor:pointer;" data-id="`+12+`">
                <i class="fa fa-trash" style="color:white"></i>
            </a>
        </div>`
        );
    });

    $('#image_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().parent().parent().parent().remove();
    });


    $('#col_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
    });

    $('#row_panel').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
    });

    var html_cont,score_cont;
    $('#mat_update').on('click',function(){
        $('#real_matrix').children().remove();
        $('#score_matrix').children().remove();
            html_cont= `
                        <tr>
                            <td><input type="text" placeholder="" class="form-control" value="#" disabled></td>`;

            for (var i=2;i<= $("#col_panel").children().length ; i++)
            {
                html_cont +=`<td>`;
                var caption = $("#col_panel div:nth-child("+i+")").find("input").val();
                html_cont += `<input type="text" placeholder="" class="form-control" value="`+caption+`" disabled>`;
                html_cont += `</td>`;
            }
            html_cont += `</tr>`;

            for (var j=2;j<= $("#row_panel").children().length ; j++)
            {
                html_cont +=`<tr><td width="15%">`;
                var caption = $("#row_panel div:nth-child("+j+")").find("input").val();
                html_cont += `<input type="text" placeholder="" class="form-control" value="`+caption+`" disabled></td>`;

                for (var i=2;i<= $("#col_panel").children().length ; i++)
                {
                    html_cont += `<td> <input type="text"  placeholder="" class="form-control" ></td>`;
                }
                html_cont +=`</tr>`;
            }
        $("#real_matrix").append(html_cont);             

        $("#score_matrix").append(html_cont); 

    });



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
    });   

    $('#question_type').change(function() {
        $("#single_input_part").hide();
        $('#radio_part').hide();
        $('#checkbox_part').hide();
        $('#image_part').hide();
        $('#matrix_part').hide();
        $('#image_fit').hide();

        var selected_text= $( "#question_type option:selected").text();
       
        switch(selected_text)
        {
            case "Single Input":                
                $('#single_input_part').show();
                break;
            case "Check Box":                
                $('#checkbox_part').show();
                break;
            case "RadioGroup":                
                $('#radio_part').show();
                break;
            case "Dropdown":                
                $('#radio_part').show();
                break;
            case "Image":                
                $('#image_part').show(); 
          
                break;

            case "Matrix":                
                $('#matrix_part').show();
                break;
            default:                           
                $('#single_input_part').show();
                break;
        }
        
    });



    var content, score;
    var data = [];
    $('#save_data').on('click',function(e){

        logic_build();
        var type_id= $( "#question_type option:selected").val();
        var selected=[],selected_cat=[];
        $('#tests_id option:selected').each(function(){
         selected[$(this).val()]=$(this).val();
           });

         var k=0;
         for (var i=0;i<selected.length; i++)
         {
             if (selected[i] != null) 
             {
                 selected_cat[k]= selected[i];k++;
             }
         }


        if (type_id == 0)
        {
            content = $.trim($("#qt_single_input").val());
            score= $.trim($("#score_id").val());         
        }
        if (type_id ==1 )
        {
            content=[]; score=[];
            for (var i=1;i<= $("#sortable-10").children().length ; i++)
            {
                content.push($("#sortable-10 div:nth-child("+i+")").find(".check_label").val());
                score= $("#score_id").val();
                //score.push($("#sortable-10 div:nth-child("+i+")").find(".checkbox_score").val());
            }
        }
        if(type_id==2)
        {
            content=[]; score=[];
            for (var i=1;i<= $("#sortable-11").children().length ; i++)
            {
                content.push($("#sortable-11 div:nth-child("+i+")").find(".radio_label").val());
                score= $("#score_id").val();
                //score.push($("#sortable-11 div:nth-child("+i+")").find(".radio_score").val());
            }
        }

        if(type_id == 3)
        {
            content=[]; score=[];
            for (var i=0;i< image_part_data.length ; i++)
            {                 
                content[i] = image_part_data[i];
            }
            if (content.length==0)
            for (var i=1;i<= $("#sortable-13").children().length ; i++)
            {
                content[i-1] = $("#sortable-13 div:nth-child("+i+")").find(".file_nm").val()
            }
        
            for (var i=1;i<= $("#sortable-13").children().length ; i++)
            {
                //score.push($("#sortable-13 div:nth-child("+i+")").find(".image_score").val());
                score= $("#score_id").val();
            }
        
        }
        var customerId;
        if(type_id == 4)
        {   
            content=[];
            score=[];
            //console.log($("#row_panel").children().length);
            for (var j=0;j< $("#row_panel").children().length ; j++)
            {

                content[j]=[];
                score[j]=[];
                for (var i=0;i< $("#col_panel").children().length ; i++)
                {  
                    content[j][i] = $('#real_matrix tr:eq('+j+')').find("td:eq("+i+") input[type='text']").val();  
                   score= $("#score_id").val();
                   // score[j][i] = $('#score_matrix tr:eq('+j+')').find("td:eq("+i+") input[type='text']").val();  
                }
            }
        }
        

        data = {
        'question_id':  $("#question_id").val(),
        'question' : CKEDITOR.instances.question_content.getData(),//$("#question_content").val(),
        'help_info' : CKEDITOR.instances["help-editor"].getData(),//$("#help-editor").val(),
        'questionimage': (image_part_data.length>0) ? image_part_data[0]:original_image, 
        'score' : score,//JSON.stringify(score),       
        'test_ids' : JSON.stringify(selected_cat),
        'type_id' : type_id,
        //'page' : $("#question_page").val(),
        //'order' :$("#question_order").val(),
       
        'width' : $("#width").val(),
        'indent' : $("#indent").val(),
        'required' : $("#required").val(),
        'min_width' : $("#min_width").val(),
        'max_width' : $("#max_width").val(),
        'size' : $("#size").val(),
        'more_than_one_answer' : $("#more_than_one_answer").val(),
        'fontsize' : $("#font_size").val(),
        'titlelocation' : $("#title_location option:selected").val(),
        'help_info_location' : $("#help_info_location option:selected").val(),
        'state' : $("#state option:selected").val(),
        'imagefit' : $("#image_fit option:selected").val(),      
        'imagewidth' : $.trim($("#image_width").val()),        
        'imageheight' : $.trim($("#image_height").val()),
        'content': JSON.stringify(content),
        'logic': JSON.stringify(logic)        
        };  
        e.preventDefault();
        console.log(data);
        //break;
        //return;
       // $(this).html('Sending..');
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
          data: {data:data} ,
        //url: "{{ route('questions.store') }}",
          url: "../update",
          type: "POST",
          dataType: 'json',
          complete: function (response) {
            
           alert("Question is successfully updated.");  
         
          },
          error: function (response) {
              console.log('Error:', response);
          }
      });
      //location.href="../";

    });   

    $("#width").on('change', function(){
        $(".main-content").css("width",$("#width").val());
    });
    $("#font_size").on('change', function(){
        $('div').css("font-size", parseInt($("#font_size").val()) );
        $('input').css("font-size", parseInt($("#font_size").val()) );
    });
    $("#indent").on('change', function(){
        $(".main-content").css("margin-left",parseInt($("#indent").val()) );
    });

    $("#image_width").on('change', function(){
        $(".fileinput-preview").css("width", parseInt($("#image_width").val()) );
    });

    $("#image_height").on('change', function(){
        $(".fileinput-preview").css("height", parseInt($("#image_height").val()) );
    });
    $("#image_fit").on('change', function(){
        $(".fileinput-preview").css("object-fit",$("#image_fit option:selected").text());
    });
  
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $('.file').change(function(){
      
        let reader = new FileReader();
        reader.onload = (e) => { 
          $('.display-image-preview').attr('src', e.target.result); 
        }
        reader.readAsDataURL(this.files[0]); 

    });

    var image_part_data = [];

    var original_image;

    if ($( "#question_type option:selected").val()==3)
        original_image = $('.file_nm').val();
    else
         original_image= $('.file_name').val();

    $(".image-upload-form").on('change', function(e){
        e.preventDefault();
        let formData = new FormData(this);
        
        $.ajax({
           type:'POST',
           url: `../upload-images`,
            data: formData,
            cache:false,
            contentType: false,
            processData: false,
            success: function(response){
              if (response) {
                console.log(response);  
                var result=JSON.parse(response);
                image_part_data = result['img_name'];
                $('.file_name').val(result['img_name']) ;
              }

            },
            error: function(response){
               console.log(response);
            }
        })
   });

   $(".imagelist-upload-form").on('submit', function(e){
    e.preventDefault();
    let formData2 = new FormData(this);
    
    $.ajax({
       type:'POST',
       url: `../upload-images`,
        data: formData2,
        cache:false,
        contentType: false,
        processData: false,
        success: function(response){
          if (response) {
            console.log(response);  
            var result=JSON.parse(response);            
            image_part_data = result['img_name'];
            $("#imagelist_submit").prop("disabled" ,false);
            
          }

        },
        error: function(response){
           console.log(response);
        }
    })
});
   $(".imagelist-upload-form").on('click','.add-btn',function(){ 
    var lsthmtl = $(".clone").html();
    $(".increment").after(lsthmtl);
    });
    $(".imagelist-upload-form").on("click",".del-btn",function(){ 
        $(this).parents(".hdtuto").remove();
    });

    $(".logic_part").on('click','#logic_open',function(){ 
     
        $("#sortable-14").show();

    });

    $(".logic_part").on('click','#condition_add',function(){ 
     
        var logichmtl = $(".clone_condition").html();
        $(".first_logic_condition").after(logichmtl);
    });
        
    $('.logic_part').on('click','.del-btnx',function(){
        $(this).parent().parent().remove();
    });

    $(document).on('select_node.jstree','.tree_2', function(e,data) { 
   
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
                        <div class="col-12 form-group">
                            <label>Please enter/select the value </label>  
                            <textarea class="form-control" rows="1"></textarea>                    
                        </div>                       
                    </div> `;
            }

            if (type == 1)
            {
                html_append =
                `<div class="col-8 form-group logic_view">`;
                for(var i = 0; i< content.length; i++)    
                    html_append +=
                    `<div  class="checkbox">
                        <label><input type="checkbox" >` + content[i]+ `</label>                      
                    </div>`;
                
                html_append +=       
                    `</div>`;
            }

            if (type == 2)
            {
                html_append =`           
                <div class="col-12 form-group logic_radio">`;
                for(var i = 0; i< content.length; i++)    
                    html_append +=
                    `<div  class="checkbox">
                        <label><input type="radio" name="optradio`+content[0] +`">` + content[i]+ `</label>                      
                    </div>`;
                            
                html_append +=       
                    `</div>`;
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
                            <text class="form-control" rows="1"></textarea>                    
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

    $(".tree_2").hide();
    $(document).on('click','.qt_name', function(e){
         $(this).siblings(".tree_2").show();     

    });

    var logic = [];
    var logic_build = function () {
        
        var id_list ;      
      
        id_list = $('#sortable-14 .main-content').map(function() {
            return $(this).attr('id');
        });              

        for (var i=0;i<id_list.length ; i++)
        {
            
                logic[i] =[];
                logic[i][0] = $("#sortable-14 div:nth-child("+(i+1)+")").find(".first_operator").val();                
                logic[i][1] = id_list[i].split("_")[1];
                logic[i][2] = $("#sortable-14 div:nth-child("+(i+1)+")").find(".operators").val();
                var qt_type = $("#sortable-14 div:nth-child("+(i+1)+")").find(".qt_type").val();

                if(qt_type == 0)
                {
                    logic[i][3] =$("#"+id_list[i]).find("textarea").val();
                }
                if(qt_type == 1)
                {
                    var cnt=$("#"+id_list[i]).find(".logic_check").children().length;
                    logic[i][3] =0;
                    for (var j=0;j< cnt; j++)
                    {
                        if( $("#"+id_list[i]).find(".logic_check  .checkbox_"+j).is(':checked') == true)
                            logic[i][3]+= Math.pow(2,cnt-j-1);
                    }               
                }
                if(qt_type == 2)
                {
                    var cnt= $("#"+id_list[i]).find(".logic_radio").children().length;//is(':checked');
                    logic[i][3] =0;
                    for (var j=0;j< cnt; j++)
                    {
                        if($("#"+id_list[i]).find(".logic_radio  .radio_"+j+":checked").val()=="on")
                            logic[i][3]+= Math.pow(2,cnt-j-1);
                    }               
                }
                if(qt_type == 3)
                {
                    var cnt=$("#"+id_list[i]).children().length;//is(':checked');
                    logic[i][3] =0;
                    for (var j=0; j< cnt; j++)
                    {
                        if($("#"+id_list[i]).find(".imagebox_"+j).is(':checked') == true)
                            logic[i][3]+= Math.pow(2,cnt-j-1);
                    }               
                }
                if(qt_type == 4)
                {
                    logic[i][3] = $("#"+id_list[i]).find("textarea").val();             
                }
            
            

        }  
    };


    return {
        //main function to initiate the module
        init: function () {   

        }

    };

}();

