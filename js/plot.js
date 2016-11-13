d3.csv("../data/seeddataset2.csv", function(error,data) {
	//read data
	data.forEach(function (d) {
		d.Song_id = +d.Song_id;
		d.Title = d.Title;
		d.Artist = d.Artist;
		d.Valance = +d.Valance;
		d.Arousal = +d.Arousal;
		d.Genre = d.Genre;
		d.Sim_1 = +d.Sim_1;
		d.Sim_2 = +d.Sim_2;
		d.Sim_3 = +d.Sim_3;
		d.Sim_4 = +d.Sim_4;
		d.Sim_5 = +d.Sim_5;
		d.have_sim = +d.have_sim;
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
		var information = [0, 0, 0];
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

				//information of this song
				information[0] = d.Artist;
				information[1] = d.Title;
				information[2] = d.Genre;

				//put similar datas
				for (var i = 1; i < 6; i++) {
					dataList[i] = i;
					//data 의 id가 center인 애으ㅣ
					//dataList[1] = d.first;
					//dataList[2] = d.second;
					//
				}

				inform(information);
				drawGraph(dataList);
			});
	}


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
			.attr("cx", function(d,i){return i*100 + 100;})//주황색 동그라미들 좌표
			.attr("cy", h/2)
			.attr("r", 30)
			.attr("fill", "orange");
	}

	var prev = 0;
	var current = document.getElementById("all");
	window.filter = function(title){
		var filteredData = [];
		/*
		prev = current;
		var current = document.getElementById(title);
		prev.checked = "off";
		current.value.autocomplete = "on";
	*/
		console.log(title);
		if(title == "all") {
			drawPlot(data);
			console.log(filteredData.length);
		}
		else {
			for (var i = 0; i < data.length; i++) {
				if (data[i].Genre == title) {
					filteredData.push(data[i]);
				}
			}
			console.log(filteredData.length);
			drawPlot(filteredData);
		}
	}

	function inform(information){
		var artist = document.getElementById("artist");
		var title = document.getElementById("title");
		var genre = document.getElementById("genre");
		artist.innerHTML = information[0];
		title.innerHTML = information[1];
		genre.innerHTML = information[2];
		console.log(information[0]);
	}

});

