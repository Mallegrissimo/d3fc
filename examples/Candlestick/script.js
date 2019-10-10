// a candlestick series, by default it expects the provided data to have open, low, high, close, date properties
const candlestickSeries = fc.seriesSvgCandlestick()
    .bandwidth(2);

// adapt the d3 time scale to add discontinuities, so that weekends are removed
const xScale = fc.scaleDiscontinuous(d3.scaleTime())
    .discontinuityProvider(fc.discontinuitySkipWeekends());

const yScale = d3.scaleLinear();

const chart = fc.chartCartesian(
        xScale,
        yScale)
    .yOrient('left')
    .svgPlotArea(candlestickSeries);

// use the extent component to determine the x and y domain
const xExtent = fc.extentDate()
    .accessors([d => d.date]);

const yExtent = fc.extentLinear()
    .accessors([d => d.high, d => d.low]);


const parseDate = d3.timeParse("%d-%b-%y");

const mouseevents = {
    mouseover: (selection, d, i) => {
        selection.transition()
            .duration(150)
            .attr('opacity', 0.85)
            .style("cursor", "pointer");
        // .style("stroke", "black")
        console.log(' mouseover fired...' + d.high + ' ' + i);
        const tooltip = d3.select('.trellischart-tooltip');
        tooltip.transition()
            .duration(50)
            .style("opacity", 1);
        let tooltip_html = `High:${d.high.toFixed(2)}<br/>Low:${d.low.toFixed(2)}<br/>Open:${d.open.toFixed(2)}<br/>Close:${d.close.toFixed(2)}<br/>`;
        console.log(tooltip_html);
        tooltip.html(tooltip_html)
            .style("left", (xScale(d.date) + 100) + "px")
            .style("top", (yScale(d.high) - 80) + "px");
    },
    mouseout: (selection, d, i) => {
        selection.transition()
            .duration(50)
            // .style("stroke", "none")
            .attr('opacity', 1)
            .style("cursor", "default");

        d3.select('.trellischart-tooltip')
            .transition()
            .duration(500)
            .style("opacity", 0)
            .style("display", "block");
        console.log(' mouseout fired...' + d.high + ' ' + i);
    }
};
d3.select('#chart-element').append("div")
    .attr("class", "trellischart-tooltip")
    .style("opacity", 0)
    .style("display", "none")
    .style("position", "absolute");
d3.csv('data.csv',
    // transform the data to use the default candlestick series properties
    row => ({
        open: Number(row.Open),
        close: Number(row.Close),
        high: Number(row.High),
        low: Number(row.Low),
        date: parseDate(row.Date),
        mouseevents: mouseevents
    })).then(data => {
    // set the domain based on the data
    chart.xDomain(xExtent(data))
        .yDomain(yExtent(data))
        .decorate(function(sel) {
            console.log('entered decorate....');
        });

    // select and render
    d3.select('#chart-element')
        .datum(data)
        .call(chart);
});