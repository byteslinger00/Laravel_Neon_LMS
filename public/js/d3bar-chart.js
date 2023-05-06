var d3bar_chart_draw = function(content, idx) {


  am4core.ready(function () {
    am4core.disposeAllCharts();
    // Themes begin
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("d3bar-chartdiv"+idx, am4charts.XYChart3D);
    
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
          "visits": val,
          "color": chart.colors.next()
        };
        chart.data.push(dt);
      }
    }
    

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueX = "visits";
    series.dataFields.categoryY = "country";
    series.name = "Visits";
    series.columns.template.propertyFields.fill = "color";
    series.columns.template.tooltipText = "{valueX}";
    series.columns.template.column3D.stroke = am4core.color("#fff");
    series.columns.template.column3D.strokeOpacity = 0.2;
    var eles = document.querySelectorAll("[aria-labelledby$=-title]");
    for(var i=0;i<eles.length;i++){
        eles[i].style.visibility="hidden"
    }

  }); // end am4core.ready()


};

