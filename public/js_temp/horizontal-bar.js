var horizontal_bar_chart_draw = function (content, idx) {
    am4core.ready(function () {
        am4core.useTheme(am4themes_animated);
        am4core.disposeAllCharts();
    // Create chart instance
        var chart = am4core.create("horizontal-chartdiv"+idx, am4charts.XYChart);

        // Add data
        // chart.data = [{
        // "country": "Research",
        // "visits": 450
        // }, {
        // "country": "Marketing",
        // "visits": 1200
        // }, {
        // "country": "Distribution",
        // "visits": 1850
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
        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.grid.template.location = 0;

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());

        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = "visits";
        series.dataFields.categoryY = "country";

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{visits}";
        valueLabel.label.fontSize = 15;
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 5;
        valueLabel.locationX = 1;
        var eles = document.querySelectorAll("[aria-labelledby$=-title]");
        for(var i=0;i<eles.length;i++){
            eles[i].style.visibility="hidden"
        }
    })

}