// a candlestick series, by default it expects the provided data to have open, low, high, close, date properties
const candlestickSeries = fc.seriesSvgCandlestick()
    .bandwidth(2);

// adapt the d3 time scale to add discontinuities, so that weekends are removed
const xScale = fc.scaleDiscontinuous(d3.scaleTime())
    .discontinuityProvider(fc.discontinuitySkipWeekends());

const chart = fc.chartCartesian(
        xScale,
        d3.scaleLinear()
    )
    .yOrient('left')
    .svgPlotArea(candlestickSeries);

// use the extent component to determine the x and y domain
const xExtent = fc.extentDate()
    .accessors([d => d.date]);

const yExtent = fc.extentLinear()
    .accessors([d => d.high, d => d.low]);

const parseDate = d3.timeParse("%d-%b-%y");

d3.csv('data.csv',
    // transform the data to use the default candlestick series properties
    row => ({
        open: row.Open,
        close: row.Close,
        high: row.High,
        low: row.Low,
        date: parseDate(row.Date)
    })).then(data => {
    // set the domain based on the data
    chart.xDomain(xExtent(data))
        .yDomain(yExtent(data))

    // select and render
    d3.select('#chart-element')
        .datum(data)
        .call(chart);
});