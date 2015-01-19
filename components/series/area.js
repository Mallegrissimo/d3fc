(function(d3, fc) {
    'use strict';

    fc.series.area = function() {

        // convenience functions that return the x & y screen coords for a given point
        var x = function(d) { return area.xScale.value(area.xValue.value(d)); };
        var y0 = function(d) { return area.yScale.value(area.y0Value.value(d)); };
        var y1 = function(d) { return area.yScale.value(area.y1Value.value(d)); };

        var area = function(selection) {

            selection.each(function(data) {

                var container = d3.select(this)
                    .selectAll('.area-series')
                    .data([data]);

                container.enter()
                    .append('g')
                    .classed('area-series', true)
                    .append('path');

                var areaData = d3.svg.area()
                    .x(x)
                    .y0(y0)
                    .y1(y1);
                container.select('path')
                    .attr('d', areaData);

                area.decorate.value(container);
            });
        };

        area.decorate = fc.utilities.property(fc.utilities.fn.noop);
        area.xScale = fc.utilities.property(d3.time.scale());
        area.yScale = fc.utilities.property(d3.scale.linear());
        area.y0Value = fc.utilities.functorProperty(0);
        area.y1Value = fc.utilities.property(fc.utilities.valueAccessor('close'));
        area.xValue = fc.utilities.property(fc.utilities.valueAccessor('date'));


        return area;
    };
}(d3, fc));