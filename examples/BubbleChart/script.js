d3.json('data.json').then(data => {
    // convert string properties to numbers
    data.forEach(function(d) {
        d.income = Number(d.income);
        d.population = Number(d.population);
        d.lifeExpectancy = Number(d.lifeExpectancy);
    });

    var regions = d3.set(data.map(d => d.region));
    var color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(regions.values());

    var legend = d3.legendColor()
        .scale(color);

    d3.select('#legend')
        .call(legend);

    var size = d3.scaleLinear().range([40, 1600])
        .domain(fc.extentLinear()
            .accessors([d => d.population])(data));

    var pointSeries = fc.seriesSvgPoint()
        .crossValue(d => d.income)
        .mainValue(d => d.lifeExpectancy)
        .size(d => size(d.population))
        .decorate((sel) => {
            sel.enter()
                .attr('fill', d => color(d.region));
        });

    var chart = fc.chartCartesian(
            d3.scaleLog(),
            d3.scaleLinear()
        )
        .xDomain(fc.extentLinear()
            .accessors([d => d.income])(data))
        .yDomain(fc.extentLinear()
            .accessors([d => d.lifeExpectancy])(data))
        .chartLabel('The Wealth & Health of Nations')
        .xLabel('Income (dollars)')
        .yLabel('Life expectancy (years)')
        .xTickFormat(d3.format(',d'))
        .xTicks(2)
        .yOrient('left')
        .svgPlotArea(pointSeries);

    d3.select('#bubble-chart')
        // remove the loading text from the container
        .text(null)
        .datum(data)
        .call(chart);
});