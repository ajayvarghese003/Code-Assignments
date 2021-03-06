function DrawChart(obj) {
    var chartValues, maxChartValue, element, two,
        elem = obj.elem, // dom element in which graph should be plotted
        width = obj.width, // width of graph
        height = obj.height; // height of graph 

    init();

    // variable initializing is done here
    function init() {
        chartValues = obj.data || chartValueGenerator(0, 50, 50); // generates graph data
        maxChartValue = Math.max.apply(null, chartValues);
        element = document.querySelector(elem);
        element.innerHTML = "";
        two = new Two({
            width: width,
            height: height
        }).appendTo(element);
        // document.getElementById('chartValues').textContent = chartValues;
    }

    // validation are done here
    if (!element) {
        console.error('Element : ' + elem + ', Not Found');
        return false;
    }

    if (chartValues.length == 0) {
        console.error('Insufficient Data to plot Chart');
        return false;
    }

    drawBarGraph();
    // placeLabels();

    // Graph plotting is done here
    function drawBarGraph() {
        var xAxisDots = chartValues.length,
            xAxisDotsWidth = width / xAxisDots,
            xPos = xAxisDotsWidth / 2,
            yAxisDotsWidth = height / (maxChartValue + 2),
            yPos = height - xAxisDotsWidth / 2,
            graphHeight = height - xAxisDotsWidth / 3,
            lineStroke = (xAxisDotsWidth / 3) * 2;

        var xPos1;
        console.log(xPos, "Out of Tween");

        // Below function is called repeatedly to draw the line to its height from 0
        var updateCallback = function() {
            var y2 = this.y;
            var line = two.makeLine(
                this.x,
                yPos,
                this.x,
                y2
            );
            console.log(y2, "Inside Tween");
            line.linewidth = lineStroke;
            line.cap = 'round';
            line.stroke = '#FF8000';
            two.update();
        }

        for (var i = 0; i < chartValues.length; i++) {
            var y2Pos = graphHeight - (chartValues[i] * yAxisDotsWidth);
            var tween = new TWEEN.Tween({
                    x: xPos,
                    y: yPos
                })
                .to({
                    x: xPos,
                    y: y2Pos
                }, 1000)
                .onUpdate(updateCallback)
                .easing(TWEEN.Easing.Back.Out)
                .start();
            xPos = xPos + xAxisDotsWidth;
        }
        animate();
    }


    // Here Graph is updated for every change in x value which varies according to time.
    function animate(time) {
        requestAnimationFrame(animate);
        TWEEN.update(time);
    }

    function placeLabels() {
        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        document.querySelector('#chart-cont > svg > g').appendChild(group);
        group.setAttributeNS(null, 'text-anchor', 'end');
        group.appendChild(text);
        group.setAttributeNS(null, 'x', '0');
        group.setAttributeNS(null, 'y', '0');
        group.setAttributeNS(null, 'fill', '#333');
        text.appendChild(document.createTextNode('50'));
        text.setAttributeNS(null, 'x', '0');
        text.setAttributeNS(null, 'y', '0');
    }

    // Graph Data are generated here
    function chartValueGenerator(min, max, count) {
        chartValues = [];
        for (var i = 0; i < count; i++) {
            var value = Math.ceil((Math.random() * max) + min);
            chartValues[i] = value;
        }
        console.log('Chart Data :', chartValues);
        return chartValues;
    }

    document.getElementById('resetBtn').onclick = function() {
        init();
        drawBarGraph();
    }
}
