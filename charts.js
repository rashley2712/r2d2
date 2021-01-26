            function drawStarChart() {
                var dataTable = new google.visualization.DataTable();
                dataTable.addColumn({ type: 'string', id: 'Star' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
    
                currentStar = "none";
                for (var i in seeingData['dates']) {
                    if (seeingData['star'][i] != currentStar) {
                        if (currentStar!="none") dataTable.addRow( [ currentStar, beginTime, finishTime ]);
                        currentStar = seeingData['star'][i];
                        beginTime = seeingData['dates'][i];
                    }
                    finishTime = seeingData['dates'][i];
                }
                dataTable.addRow( [ currentStar, beginTime, finishTime ]);
                var chart = new google.visualization.Timeline(document.getElementById('stars'));
                var options = {
                    backgroundColor: "#f5f4f0", 
                    hAxis: {
                        maxValue: endTime, 
                        minValue: startTime
                        },   
                };
                chart.draw(dataTable, options);
                return chart;

            }

            function drawAirmassSeeingChart() {
                var data =  new google.visualization.DataTable();
                data.addColumn('number', 'airmass');
                data.addColumn('number', 'seeing');
                for (var i in seeingData['dates']) {
                    meanSeeing = (seeingData['seeing_trans'][i] + seeingData['seeing_long'][i]) / 2;
                    airmass = parseFloat(seeingData['airmass'][i]);
                    data.addRow([airmass, meanSeeing]);
                }
                var chart = new google.visualization.ScatterChart(document.getElementById('airmass'));
                var options = {
                    title: 'Airmass vs Seeing', 
                    hAxis: {title: 'airmass',
                            titleTextStyle: { italic: false }
                            },
                    vAxis: {title: 'seeing (arcsec)',
                            titleTextStyle: { italic: false }
                            },
                    backgroundColor: "#f5f4f0", 
                    series: {
                        0: { pointShape: 'square',
                        visibleInLegend: false },
                    },
                    dataOpacity: 0.4,
                    trendlines: {
                        0: {
                        type: 'linear',
                        color: 'blue',
                        lineWidth: 1,
                        opacity: 0.3,
                        visibleInLegend: false
                        }
                    }
                    
                }
                chart.draw(data, options);
                return chart;
            }

            function drawSeeingChart() {
                var data =  new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Seeing Long');
                data.addColumn('number', 'Seeing Trans');
                for (var i in seeingData['dates']) {
                    data.addRow([seeingData['dates'][i], parseFloat(seeingData['seeing_trans'][i]), parseFloat(seeingData['seeing_long'][i])]);
                }
				console.log("seeing");
				console.log(startTime);
                console.log(endTime);
                
                var options = {
                    title: 'Seeing',
                    legend: { position: 'in' }, 
                    dataOpacity: 1.0,
                    vAxis: {
                        title: 'FWHM (arcsec)',
                        titleTextStyle: { italic: false }
                        },
                    hAxis: {
                        title: 'Time',
                        maxValue: endTime, 
                        minValue: startTime,
                        titleTextStyle: { italic: false },
                        format: 'HH:mm',
                        },
                    chartArea: { 
                        backgroundColor: "#f5f4f0", 
                        width: 600,
                        }, 
                    backgroundColor: "#f5f4f0", 
                    series: {
                        0: { pointShape: 'square' },
                        1: { pointShape: 'triangle' },
                    },
                    explorer: { 
                        actions: ['dragToZoom', 'rightClickToReset'],
                        maxZoomIn: 0.01 
                        },
                };
                if ((endTime - startTime) > 86400*1000) options.hAxis.format = "yyyy-MM-dd";

                var chart = new google.visualization.ScatterChart(document.getElementById('seeing'));
               
                chart.draw(data, options);
               
                return chart;
		}
			

		function drawPositionChart() {
                var data =  new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'mean_x');
                data.addColumn('number', 'mean_y - 95');
                for (var i in seeingData['dates']) {
		    var seeingDate = new Date(Date.parse(seeingData['dates'][i]));
		    data.addRow( [
						seeingDate, 
						parseFloat(seeingData['mean_x'][i]),
						parseFloat(seeingData['mean_y'][i] - 95)
					]);
				}
				
                var options = {
                    title: 'Delta centroid position',
                    legend: { position: 'in' }, 
                    dataOpacity: 1.0,
                    vAxis: {
                        titleTextStyle: { italic: false },
						title: 'delta (pixels)',
						},
                    hAxis: {
                        title: 'Time',
                        maxValue: endTime, 
                        minValue: startTime,
                        titleTextStyle: { italic: false },
						format: 'HH:mm',
                        },
                    chartArea: { 
                        backgroundColor: "#f5f4f0", 
                        width: 600,
                        }, 
                    backgroundColor: "#f5f4f0", 
                    series: {
						0: { 
							pointShape: 'diamond',
						},
						1: { 
							pointShape: 'diamond',
						},
                    },
                    explorer: { 
                        actions: ['dragToZoom', 'rightClickToReset'],
                        maxZoomIn: 0.01 
                        },
                };
                if ((endTime - startTime) > 86400*1000) options.hAxis.format = "yyyy-MM-dd";

                var chart = new google.visualization.ScatterChart(document.getElementById('position'));
                
                chart.draw(data, options);
                return chart;
            }


            function drawStatsChart() {
                seeing = [];
                for (var i in seeingData['dates']) seeing.push((seeingData['seeing_trans'][i] + seeingData['seeing_long'][i])/2 );
                
                var n = seeing.length;
                var sum = 0;
                for (var i in seeing) sum = sum + seeing[i];
                var mean = sum/n;
                var variance = 0;
                for (var i in seeing) variance+= (seeing[i] - mean)**2;
                var std = Math.sqrt(variance/(n-1));
                console.log("Mean: " + mean);
                console.log("Std deviation: " + std);
                seeing.sort(function(a,b){ return a-b; });
                var midpoint = Math.floor(n / 2);
                if (n % 2) median = seeing[midpoint]; else var median = (seeing[midpoint - 1] + seeing[midpoint]) / 2.0;
                console.log("Median: " + median);

                data =  new google.visualization.DataTable();
                data.addColumn('number', 'Seeing');
                options = {
                    backgroundColor: "#f5f4f0", 
                    title: "median: " + decimalPlacesFloat(median, 2) + " mean: " + decimalPlacesFloat(mean, 2) + " stddev: " + decimalPlacesFloat(std, 2), 
                    hAxis: {title: 'seeing (arcsec)',
                            titleTextStyle: { italic: false }
                            },
                    vAxis: {title: 'N',
                            titleTextStyle: { italic: false }
                            },
                    legend: {position: 'none'},
                    histogram: { hideBucketItems: true }
                    };
                
                for (var i in seeing) data.addRow([seeing[i]]);

                chart = new google.visualization.Histogram(document.getElementById('stats'));

                google.visualization.events.addListener(chart, 'ready', function () {
                    var medianPixel = chart.getChartLayoutInterface().getXLocation(median);
                    var meanPixel = chart.getChartLayoutInterface().getXLocation(mean);
                    var axisLeft = chart.getChartLayoutInterface().getChartAreaBoundingBox().left;
                    var yTop = chart.getChartLayoutInterface().getChartAreaBoundingBox().top;
                    var yHeight = chart.getChartLayoutInterface().getChartAreaBoundingBox().height;
                    var overlay = document.getElementById('stats_overlay');
                    var canvasHeight = overlay.height;
                    var canvasWidth = overlay.width;
                    var ctx = overlay.getContext("2d");
                    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                    ctx.setLineDash([6, 2]);
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(medianPixel, canvasHeight - yTop);
                    ctx.lineTo(medianPixel, canvasHeight - (yTop + yHeight));
                    ctx.stroke();
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    ctx.moveTo(meanPixel, canvasHeight - yTop);
                    ctx.lineTo(meanPixel, canvasHeight - (yTop + yHeight));
                    ctx.stroke();
                    
                  });
                chart.draw(data, options);
                return chart;
            }
