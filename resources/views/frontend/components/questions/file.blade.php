<!-- <div class="mb-2">
    <div class="form-group">
    <label for="">Example file input</label>
    <input type="file" class="form-control-file" id="">
  </div>
</div> -->

<!-- <div class="mt-2">
      <img id="preview" src="" width="100%">
      <form id="user_type_image" action="" method="POST" enctype="multipart/form-data">
          @csrf
          <div class="form-group">
              <label class="form-label">Image</label>
              <input type="file" id="img"  class="form-control" name="file" accept="image/*">
              <input type="hidden" id="quiz_img" name="quiz_img" value="">
          </div>
      </form>
  </div>  -->
@php
    $content = json_decode($question->content);
    $number_of_files = $content[0]->number;
    $btn_color= $question->color1 == NULL ? $lesson->color1 : $question->color1;
@endphp
<div class="mt-2">
    <form id="question_type_image" action="" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group">
            <label class="form-label">File</label>
            <input type="file" id="files" class="form-control" name="files[]" accept=<?php $cont=$question->content;
                $obj = json_decode($cont,true);
                $val = ($obj[0]["file_acceptable_exts"]);
                for($i = 0 ; $i< count($val) ; $i ++){
                    echo ".".$val[$i];
                    if($i != count($val)-1)
                        echo ",";
                }
                    ;?> multiple>
            <input type="hidden" name="files" class="files_user" id="{{$question->id}}" value="">
            <input type="hidden" id="user_upload_file" name="user_upload_file" value="">
            <input type="hidden" id="file_q_id" name="user_upload_img" value="{{$question->id}}">
            <input type="hidden" id="num_files" name="num_files" value="{{$number_of_files}}">
            <input type="hidden" id="btn_color" name="num_files" value="{{$btn_color}}">
            <input type="hidden" id="font_style" name="num_files" value="{{$fontstyle2}}">
            
        </div>
    </form>
    <div id="preview">
    </div>
</div> 

<script>
    var filePath = `{{route('user_upload_files')}}`;
    var image_defaultPath = `{{asset('uploads/storage/')}}`
    $("body").append(`<style>#q_<?php echo $question->id ?> .form-label{<?php echo $fontstyle2 ?>}</style>`)
    $("body").append(`<style>#q_<?php echo $question->id ?> #files::file-selector-button{<?php echo $fontstyle2 ?>background:{{$question->color1 == NULL ? $lesson->color1 : $question->color1}};}</style>`)  
</script>