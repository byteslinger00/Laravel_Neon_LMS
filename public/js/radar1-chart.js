var radar1_chart_draw = function (content, idx) {
    am4core.ready(function () {
        am4core.disposeAllCharts();
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);
        var chart = am4core.create("radar1-chartdiv"+idx, am4charts.RadarChart);

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
        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.axisFills.template.fill = chart.colors.getIndex(2);
        valueAxis.renderer.axisFills.template.fillOpacity = 0.05;

        /* Create and configure series */
        var series = chart.series.push(new am4charts.RadarSeries());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.name = "Score";
        series.strokeWidth = 3;
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    })
}