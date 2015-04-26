/**
 * Created by Ashwin on 4/26/2015.
 */

$( document ).ready(function() {

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    // Bring life to the dials
    getData = function(){
        setTimeout(function () {
            $.ajax({
                url: "/getData",
                success: function(data){

                    drawDials(data);
                    getData();
                },
                error: function(error){
                    console.log(error);
                }
            });

            function drawDials(data){
                data = data.data;

                for (name in data){
                    var _name = name;
                    name = name.split(" ").join("_");
                    if($("#" + name).length){
                        var chart = $("#" + name).highcharts(),
                            point,
                            newVal,
                            inc;

                        if (chart) {
                            point = chart.series[0].points[0];

                            newVal = data[_name].resources.core.limit - data[_name].resources.core.remaining;
                            point.update(newVal);
                        }

                    } else {
                        var dial = $(".dial-container").clone();
                        dial.find(".dial").attr("id", name);
                        dial.removeClass("dial-container").removeClass("hide").appendTo(".view");
                        dial.find("#" + name).highcharts(Highcharts.merge(gaugeOptions, {
                            yAxis: {
                                min: 0,
                                max: 5000,
                                title: {
                                    text: _name
                                }
                            },

                            credits: {
                                enabled: false
                            },

                            series: [{
                                name: _name,
                                data: [data[_name].resources.core.limit - data[_name].resources.core.remaining],
                                dataLabels: {
                                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
                                    '<span style="font-size:12px;color:silver">calls made</span></div>'
                                }
                            }]

                        }));

                    }
                }
            }

        }, 5000);
    }
    getData();



});