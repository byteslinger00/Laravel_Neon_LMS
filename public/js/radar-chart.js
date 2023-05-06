var radar_chart_draw = function (content, idx) {
    am4core.ready(function () {
        am4core.disposeAllCharts();
        var chart = am4core.create("radar-chartdiv"+idx, am4charts.RadarChart);

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

        /* Create and configure series */
        var series = chart.series.push(new am4charts.RadarSeries());
        series.dataFields.valueY = "litres";
        series.dataFields.categoryX = "country";
        series.name = "Sales";
        series.strokeWidth = 3;
        series.zIndex = 2;

        var series2 = chart.series.push(new am4charts.RadarColumnSeries());
        series2.dataFields.valueY = "visits";
        series2.dataFields.categoryX = "country";
        series2.name = "Score";
        series2.strokeWidth = 0;
        series2.columns.template.fill = am4core.color("#CDA2AB");
        series2.columns.template.tooltipText = "Series: {name}\nCategory: {categoryX}\nValue: {valueY}";
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    })
}