import tinymce from "tinymce/tinymce";
import 'tinymce/themes/silver';

// Any plugins you want to use has to be imported
//import 'tinymce/plugins/advlist';
//import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
//import 'tinymce/plugins/charmap';
//import 'tinymce/plugins/print';
//import 'tinymce/plugins/preview';
//import 'tinymce/plugins/anchor';
//import 'tinymce/plugins/searchreplace';
//import 'tinymce/plugins/visualblocks';
//import 'tinymce/plugins/code';
//import 'tinymce/plugins/fullscreen';
//import 'tinymce/plugins/insertdatetime';
//import 'tinymce/plugins/media';
//import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
//import 'tinymce/plugins/help';
//import 'tinymce/plugins/wordcount';

import "style-loader!tinymce/skins/ui/oxide-dark/skin.min.css";

var chatter_tinymce_toolbar = $('#chatter_tinymce_toolbar').val();
var chatter_tinymce_plugins = $('#chatter_tinymce_plugins').val();

const options = {
    skin: false,
	plugins: chatter_tinymce_plugins,
	toolbar: chatter_tinymce_toolbar,
	menubar: false,
	statusbar: false,
	content_css : '/vendor/skyraptor/chatter/assets/css/tinymce.css',
    template_popup_height: 380,
    paste_as_text: true,
}

// Initiate the tinymce editor on any textarea with a class of richText
tinymce.init(Object.assign({
	selector:'textarea.richText',
	height : '220',
	setup: function (editor) {
        editor.on('init', function(args) {
        	// The tinymce editor is ready
            document.getElementById('new_discussion_loader').style.display = "none";
            if(!editor.getContent()){
                document.getElementById('tinymce_placeholder').style.display = "block";
            }
			document.getElementById('chatter_form_editor').style.display = "block";

            // check if user is in discussion view
            if ($('#new_discussion_loader_in_discussion_view').length > 0) {
                document.getElementById('new_discussion_loader_in_discussion_view').style.display = "none";
                document.getElementById('chatter_form_editor_in_discussion_view').style.display = "block";
            }
        });
        editor.on('keyup', function(e) {
        	content = editor.getContent();
        	if(content){
        		//$('#tinymce_placeholder').fadeOut();
        		document.getElementById('tinymce_placeholder').style.display = "none";
        	} else {
        		//$('#tinymce_placeholder').fadeIn();
        		document.getElementById('tinymce_placeholder').style.display = "block";
        	}
        });
    }
}, options));

export default function initializeNewTinyMCE(id){
    tinymce.init(Object.assign({
        selector:'#'+id,
        height : '300',
    }, options));
}