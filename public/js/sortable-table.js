var sortable_table_draw = function (content, idx) {
    jQuery("#th-bcolor").val("#ffffff")
    jQuery("#tb-ocolor").val("#ffffff")
    jQuery("#tb-ecolor").val("#ffffff")
    //content = invertMatrix(content);
    var html_content = `<thead><tr><th></th>`;

    for (var k = 1; k < content[0].length; k++) {
        html_content += `<th data-label="mdata">`+ content[0][k] + `</th>`;
    }
    html_content += `</tr></thead>`;

    for (var i = 1; i < content.length; i++) {
        html_content += `<tr>`;
        html_content += `<td>` + content[i][0] + `</td>`;

        for (var s = 1; s < content[i].length; s++) {
            let val = content[i][s];
            if(val == undefined)
                val = 0;
            html_content += `<td class="rwd">` + val + `</td>`;
        }
        html_content += `</tr>`;
    }
    
    var sort_name = "sortable_table" + idx;
    $(`#${sort_name} table`).html(html_content);
    //$(`#${sort_name} table`).DataTable();
    $('.dataTables_length').addClass('bs-select');
    $('#sortable_table'+idx).show();
}