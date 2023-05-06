var ReportCreate = function () {
    var chart_data;
    var textgroup_data;


    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
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
            if (selected[i]!= null || typeof(selected[i]) !=  "undefined") 
                {
                    selected_cat[k]= selected[i];
                    k++;
                }
         }

        var origin_content = CKEDITOR.instances["summary-ckeditor"].getData();
        origin_content = origin_content.toString();
        content = "";
        //content = $("#preview").html().toString();
        var published = 0;
        if($('input[name = "published"]').is(':checked')) published = 1;
        data = {  
            'title':$("#title").val(),              
            'test_ids' : JSON.stringify(selected_cat),
            'origin_content': JSON.stringify(origin_content),
            'content': JSON.stringify(content),
            'published': published,
        }; 
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        $.ajax({
          data: {data:data} ,
          url: "store",
          type: "POST",
          dataType: 'json',
          complete: function (response) {
          
            alert("Data is successfully stored");             
         
          },
          error: function (response) {
              console.log('Error:', response);
          }
      });

      //location.reload(); 
   
    }); 

    return {
        //main function to initiate the module
        init: function () {   
          
                $.ajax({
                    //data: {id:qt_id},
                    url: "get_code",
                    type: "GET",
                    dataType: 'json',
                    success: function(response){
                        chart_data=response.charts;
                        textgroup_data =response.textgroups;   
                    },
                    error: function(response){
                        console.log(response);
                    }
                });
             
        }
    };

}();





