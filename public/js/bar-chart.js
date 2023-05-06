var bar_chart_draw =function(content, idx) {
    am4core.ready(function() {
        am4core.disposeAllCharts();
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("bar-chartdiv"+idx, am4charts.XYChart);
        
        // Add data
        // chart.data = [{
        //   "country": "USA",
        //   "visits": 2025
        // }, {
        //   "country": "China",
        //   "visits": 1882
        // }, {
        //   "country": "Japan",
        //   "visits": 1809
        // }, {
        //   "country": "Germany",
        //   "visits": 1322
        // }, {
        //   "country": "UK",
        //   "visits": 1122
        // }, {
        //   "country": "France",
        //   "visits": 1114
        // }, {
        //   "country": "India",
        //   "visits": 984
        // }, {
        //   "country": "Spain",
        //   "visits": 711
        // }, {
        //   "country": "Netherlands",
        //   "visits": 665
        // }, {
        //   "country": "Russia",
        //   "visits": 580
        // }, {
        //   "country": "South Korea",
        //   "visits": 443
        // }, {
        //   "country": "Canada",
        //   "visits": 441
        // }, {
        //   "country": "Brazil",
        //   "visits": 395
        // }];
        
        // Create axes
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
                country: name,
                visits: val
              };
              chart.data.push(dt);
          }
        }
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        
        categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
          if (target.dataItem && target.dataItem.index & 2 == 2) {
            return dy + 25;
          }
          return dy;
        });
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.name = "Visits";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.fillOpacity = .8;
        
        var columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    }); // end am4core.ready()
};

