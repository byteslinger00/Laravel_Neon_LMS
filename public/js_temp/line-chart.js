var line_chart_draw = function (content, idx) {
    am4core.ready(function () {
        am4core.disposeAllCharts();
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("line-chartdiv"+idx, am4charts.XYChart);
        chart.paddingRight = 10;

        // Add data
        // chart.data = [{
        // "year": "2004",
        // "value": 0.445
        // }, {
        // "year": "2005",
        // "value": 0.47
        // }];
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
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0.5;
        categoryAxis.startLocation = 0.5;
        categoryAxis.endLocation = 0.5;

        // Create value axis
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.baseValue = 0;

        // Create series
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "visits";
        series.dataFields.categoryX = "country";
        series.strokeWidth = 2;
        series.tensionX = 0.77;

        // bullet is added because we add tooltip to a bullet for it to change color
        var bullet = series.bullets.push(new am4charts.Bullet());
        bullet.tooltipText = "{visitsY}";

        bullet.adapter.add("fill", function(fill, target){
            if(target.dataItem.valueY < 0){
                return am4core.color("#FF0000");
            }
            return fill;
        })
        var range = valueAxis.createSeriesRange(series);
        range.value = 0;
        range.endValue = -1000;
        range.contents.stroke = am4core.color("#FF0000");
        range.contents.fill = range.contents.stroke;

        // Add scrollbar
        var scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        chart.cursor = new am4charts.XYCursor();
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    }); // end am4core.ready()
}