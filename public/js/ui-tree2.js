var UITree2 = function () {



    var handleSample2 = function () {

        $('.tree_2').jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }            
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "plugins": ["types"]
        });
        
             


        $('.tree_2').on('select_node.jstree', function(e,data) { 
         
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
                url: "../get_info",
                type: "GET",
                dataType: 'json',
                success: function(response){
                var type=response[0]['questiontype']; 
                var content= JSON.parse(response[0]['content']);
                var html_append=``; 

                qt_type_in.val(type);
                qt_nm.val(response[0]['id']+"."+response[0]['question']);


                if (type == 0)
                {
                    html_append =
                        `<div class="row main-content"  >
                            <div class="col-8 form-group">
                            <input type="text" class="form-control" value="`+response[0]['question']+`">
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
                `<div class="row main-content"  >
                    <div class="col-8 form-group logic_view">
                    <input type="text" class="form-control" value="`+response[0]['question']+`">`;
                for(var i= 0; i< content.length; i++)    
                    html_append +=
                    `<div  class="checkbox">
                        <label><input type="checkbox" >` + content[i]+ `</label>                      
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
                    </div>
                    
                </div>`;
                }

                if (type == 2)
                {
                    html_append =`
                <div class="row main-content"  >           
                    <div class="col-8 form-group logic_view">
                    <input type="text" class="form-control" value="`+response[0]['question']+`">`;
                for(var i= 0; i< content.length; i++)    
                    html_append +=
                    `<div  class="radio">
                        <label><input type="radio" name="optradio">` + content[i]+ `</label>                      
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
                    </div>
                    
                </div>`;
                }

                if (type == 3)
                {
                    html_append =`   
                    <div class="row main-content"  >           
                        <div class="col-12 form-group ">
                            <input type="text" class="form-control" value="`+response[0]['question']+`">
                            </div>`;           
                    
                        for(var i=0;i< content.length; i++)
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
                            <input type="text" class="form-control" value="`+response[0]['question']+`">
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

        // handle link clicks in tree nodes(support target="_blank" as well)
       


        
    }

    
    return {
        //main function to initiate the module
        init: function () {

           
            handleSample2();

        }

    };

}();