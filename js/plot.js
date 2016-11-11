
d3.csv("../data/seeddataset2.csv", function(error,data){
	//read data
	data.forEach(function(d) 
	{ d.Song_id = +d.Song_id;
	  d.Title = d.Title;
	  d.Artist = d.Artist;
	  d.Valance = +d.Valance;
	  d.Arousal = +d.Arousal;
	  d.Genre = d.Genre});

/*
d3.csv("../data/similardata_final_final.csv", function(error,data2){
	//read second data
	data2.forEach(function(d)
	{ d.seedID = +d.Seed_id;
	  d.id = +d.id;
	  d.title = +d.Title;
	  d.artist = +d.Artist;
	  d.similarity = +d.Similarity});
*/

var maxX = 1 + d3.max(data, function(d) {return d.Valance;});
var maxY = 1 + d3.max(data, function(d) {return d.Arousal;});

var w = 1590;
var h = 655;
var padding = 20;
var dataList = [0,0,0,0,0,0];
var xScale = d3.scaleLinear()
		.domain([0, maxX])
		.range([padding, w-padding]);
var yScale = d3.scaleLinear()
		.domain([0, maxY])
		.range([h-padding, padding]);


var svg = d3.select("#graph")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

svg.selectAll("text")
  .enter()
  .append("text")
  .text("Positive")
  .attr("x", w-padding)
  .attr("y", h/2)
  .attr("text-anchor", "middle");

	drawPlot(data);

	function drawPlot(dataSet) {

		svg.selectAll("circle")
			.data(dataSet)
			.enter()
			.append("circle")
			.attr("cx", function (d) {
				return xScale(d.Valance);
			})
			.attr("cy", function (d) {
				return yScale(d.Arousal);
			})
			.attr("r", 3)
			.attr("fill", "black")
			.on("mouseover", function (d) {
				d3.select(this)
					.attr("fill", "cyan");

				var xPosition = parseFloat(d3.select(this).attr("x")) + 10;
				var yPosition = parseFloat(d3.select(this).attr("y")) / 2;
			})
			.on("mouseout", function () {
				d3.select(this)
					.attr("fill", "black");
			})
			.on("click", function (d) {
				var center = d.Song_id;
				dataList[0] = center;

				//put similar datas
				for (var i = 1; i < 6; i++) {
					dataList[i] = i;
				}

				drawGraph(dataList);
			});
		filter();
	}

	function drawGraph(dataList){
		var w = 1590;
		var h = 655;

		svg.select("group").remove();

		var netGroup = svg
			.append("g")
			.attr("id", "group")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", 100)
			.attr("width", 100);

		var networks = netGroup
			.selectAll("circle")
			.data(dataList)
			.enter()
			.append("circle")
			.transition()
			.attr("cx", function(d,i){return i*100 + 100;})
			.attr("cy", h/2)
			.attr("r", 30)
			.attr("fill", "orange");
	}

	function filter(){
		var filteredData = [];
		var genre = document.getElementById('pop');
		genre.addEventListener('click', function(){
			alert('Hello world');

			for(var i=0; i<length.data; i++){
				if(data[i].Genre == "pop")
					filteredData.push(data[i]);
					console.log(i);
			}
			console.log(length.filteredData);
			drawPlot(filteredData);
		})

	}

});

