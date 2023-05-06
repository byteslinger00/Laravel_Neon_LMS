var polar_chart_draw = function (content, idx) {
    am4core.ready(function() {
        am4core.disposeAllCharts();
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        var chart = am4core.create("polar-chartdiv"+idx, am4charts.RadarChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        
        chart.data = []
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
        
        chart.radius = am4core.percent(100);
        
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.tooltipLocation = 0.5;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.disabled = true;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.labels.template.horizontalCenter = "left";
        valueAxis.renderer.grid.template.disabled = true;
        
        var series1 = chart.series.push(new am4charts.RadarColumnSeries());
        series1.name = "Series 1";
        series1.dataFields.categoryX = "country";
        series1.dataFields.valueY = "visits";
        series1.stroke = am4core.color("#ffffff");
        series1.columns.template.strokeOpacity = 0.2;
        series1.stacked = true;
        series1.sequencedInterpolation = true;
        series1.columns.template.width = am4core.percent(100);
        series1.columns.template.tooltipText = "{valueY}";
        
        var series2 = chart.series.push(series1.clone());
        series2.name = "Series 2";
        series2.fill = chart.colors.next();
        series2.dataFields.valueY = "value2";
        
        var series3 = chart.series.push(series1.clone());
        series3.name = "Series 3";
        series3.fill = chart.colors.next();
        
        series3.dataFields.valueY = "value3";
        
        var series4 = chart.series.push(series1.clone());
        series4.name = "Series 4";
        series4.fill = chart.colors.next();
        series4.dataFields.valueY = "value4";
        
        chart.seriesContainer.zIndex = -1;
        
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.exportable = false;
        chart.scrollbarY = new am4core.Scrollbar();
        chart.scrollbarY.exportable = false;
        
        chart.cursor = new am4charts.RadarCursor();
        chart.cursor.xAxis = categoryAxis;
        chart.cursor.fullWidthXLine = true;
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineX.fillOpacity = 0.1;
        chart.cursor.lineX.fill = am4core.color("#000000");
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    });     // end am4core.ready()
}