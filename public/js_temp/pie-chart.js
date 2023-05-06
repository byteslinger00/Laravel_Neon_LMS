var pie_chart_draw= function(content, idx) {

  am4core.ready(function () {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_material);

    am4core.useTheme(am4themes_animated);

    // Themes end

    var chart = am4core.create("pie-chartdiv"+idx, am4charts.PieChart3D);

    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.data = [];
    for(let i = 1; i < content.length; i++) {
      for (let j = 1; j < content[0].length; j++) {
        let name = content[i][0] + "(" + content[0][j] + ")";
        if(content[0][j] == undefined || content[0][j] == null || content[0][j] == "")
          name = content[i][0];

        let val = content[i][j];
        if(val == undefined || isNaN(val))
          val = 0;
        if (Array.isArray(content[i][j]) === true)
          val = 10;
        var dt = {
          "country": name,
          "visits": val
        };
        chart.data.push(dt);
      }
    }

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;
    chart.legend = new am4charts.Legend();
    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "visits";
    series.dataFields.depthValue = "visits";
    series.dataFields.category = "country";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;
    var eles = document.querySelectorAll("[aria-labelledby$=-title]");
    for(var i=0;i<eles.length;i++){
        eles[i].style.visibility="hidden"
    }
  });
}; // end am4core.ready()

