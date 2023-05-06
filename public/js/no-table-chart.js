var no_table_chart_draw = function (content, idx) {
    var html_content = ``;

    for (var k = 1; k < content[0].length; k++) {
        html_content += `<span>`+ content[0][k] + `</span>`;
    }

    for (var i = 1; i < content.length; i++) {
        html_content += `<br>`;
        html_content += `<label>` + content[i][0] + `</label>`;

        for (var s = 1; s < content[i].length; s++) {
            let val = content[i][s];
            if(val == undefined){
                val = 0;
            }
            html_content += `<span>` + val + `</span>`;
        }
    }
    $('#no_table_chart'+idx).html(html_content);
    $('#no_table_chart'+idx).show();
}