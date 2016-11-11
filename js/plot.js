d3.csv("../data/seeddataset2.csv", function(error,data) {
	//read data
	data.forEach(function (d) {
		d.Song_id = +d.Song_id;
		d.Title = d.Title;
		d.Artist = d.Artist;
		d.Valance = +d.Valance;
		d.Arousal = +d.Arousal;
		d.Genre = d.Genre
	});

		var maxX = 1 + d3.max(data, function (d) {
				return d.Valance;
			});
		var maxY = 1 + d3.max(data, function (d) {
				return d.Arousal;
			});

		var w = 1590;
		var h = 655;
		var padding = 20;
		var dataList = [0, 0, 0, 0, 0, 0];
		var xScale = d3.scaleLinear()
			.domain([0, maxX])
			.range([padding, w - padding]);
		var yScale = d3.scaleLinear()
			.domain([0, maxY])
			.range([h - padding, padding]);

		var svg = d3.select("#graph")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

		drawPlot(data);


	function drawPlot(dataSet) {

		svg.select("#circles").remove();

		var circles = svg
			.append("g")
			.attr("id", "circles")
			.attr("width", w)
			.attr("height", h);

		circles.selectAll("circle")
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

			//	var xPosition = parseFloat(d3.select(this).attr("x")) + 10;
			//	var yPosition = parseFloat(d3.select(this).attr("y")) / 2;
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
					//data 의 id가 center인 애으ㅣ
					//dataList[1] = d.first;
					//dataList[2] = d.second;
					//
				}

				drawGraph(dataList);
			});
	}

	filter();

	function drawGraph(dataList){

		svg.select("#group").remove();

		var netGroup = svg
			.append("g")
			.attr("id", "group")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", h)
			.attr("width", w);

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
		//while (filteredData.length) { filteredData.pop(); }
		var genres = document.getElementsByName("genre");
		//console.log(genres.length);
		for(var i in genres.length){
			console.log(genres.item[i].Artist);
			genres[i].onclick = function() {
				var title = genres.item[i].getAttribute("title");

				//genre.addEventListener('click', function(){
				console.log(title);
				/*
				 for(var i=0; i<data.length; i++){
				 console.log(data[i].Genre);
				 if(data[i].Genre == title) {
				 filteredData.push(data[i]);
				 }
				 }
				 console.log(filteredData.length);
				 drawPlot(filteredData);*/
			}}
		//})
	}
});

