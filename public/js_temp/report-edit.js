var ReportEdit = function () {

    var chart_data;

    var textgroup_data;

    $(document).ready(function(){

        $.ajax({

            //data: {id:qt_id},

            url: "../get_code",

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

    });

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
        var origin_content= CKEDITOR.instances["summary-ckeditor"].getData();
        content = "";
        //content = $("#preview").html();
        var published = 0;
        if($('input[name = "published"]').is(':checked')) published = 1; 
        data = {
            'id':$("#id").val(),
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
            url: "../update",
            type: "POST",
            dataType: 'json',
            complete: function (response) {
                alert("Data is successfully stored");
            },
            error: function (response) {
                console.log('Error:', response);
            }
        });
    });

    CKEDITOR.on("instanceReady", function(event) {
        event.editor.on("beforeCommandExec", function(event) {
            // Show the paste dialog for the paste buttons and right-click paste
            if (event.data.name == "paste") {
                event.editor._.forcePasteDialog = true;
            }
            // Don't show the paste dialog for Ctrl+Shift+V
            if (event.data.name == "pastetext" && event.data.commandData.from == "keystrokeHandler") {
                event.cancel();
            }
        })
    });

    return {
        //main function to initiate the module
        init: function () {
        }
    };

}();











