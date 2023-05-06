<div class="mb-2">
    <div class="checkbox-input" data-required="@if($question->required=="1") 1 @else 0 @endif">
        @php
            $temp_val =1;
            $content = json_decode($question->content);
            foreach($content as $key => $c){
                if(isset($c->col)) $col = $c->col;
            }
        @endphp
        <div class="row check_content">
            @foreach($content as $key => $c)
                @if(isset($c->label))
                <div class="{{$col}}">
                    <div class="form-check">
                        <div class="square-check gradient-bg">
                            <input class="form-check-input {{' checkbox_'.$key}}" name="checkbox-radio" type="radio" data-qid="{{$question->id}}" data-key="{{$key+1}}" value="{{$c->score}}" {{(isset($identy[$question->id]))?($identy[$question->id]==$c->score)?'data-opendiv='.$ids[$question->id]:'':''}} name="flexRadioDefault"  id="{{$question->id}}">
                            {{$c->label}}
                            <div class="square-check--content"></div>
                        </div>
                    </div>
                </div>
                @endif
                @php
                    $temp_val++;
                @endphp
            @endforeach
        </div>
    </div>
    <span class="message mt-2"></span>
</div>