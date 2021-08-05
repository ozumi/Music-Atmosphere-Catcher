d3.csv("../data/seeddataset_with_similar.csv", function(error,data) {
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
		d.visited = 0;
	});

	var maxX = 1 + d3.max(data, function (d) {
			return d.Valance;
		});
	var maxY = 1 + d3.max(data, function (d) {
			return d.Arousal;
		});

	var w = screen.availWidth;
	var h = screen.availHeight;
	var exploerMode = true;
	var padding = 20;
	var dataList = [0, 0, 0, 0, 0, 0];
	var information = [0, 0, 0, 0];
	var xScale = d3.scaleLinear()
		.domain([0, maxX])
		.range([padding, w - padding]);
	var yScale = d3.scaleLinear()
		.domain([0, maxY])
		.range([h - padding, padding]);
	var colors = ["#023858","#045a8d","#0570b0","#3690c0","#74a9cf"]
	var typeNum = {"rock":0, "pop":1, "soundtrack":2, "jazz":3, "metal":4, "electro":5, "world":6, "latin":7, "vocal pop":8, "classical":9, "country":10, "hip hop":11, "reggae":12, "blues":13, "folk":14, "randb":15};
	var visited = [];

	var svg = d3.select("#graph")
		.append("svg")
		.attr("width", w)
		.attr("height", h);

	svg.append("text")
		.attr("class", "axisName1")
		.attr("x", w-50)
		.attr("y", h/2)
		.attr("fill", "yellow")
		.text("Positive");

	svg.append("text")
		.attr("class", "axisName1")
		.attr("x", 50)
		.attr("y", h/2)
		.attr("fill", "gray")
		.text("Negative");

	svg.append("text")
		.attr("class", "axisName2")
		.attr("x", w/2)
		.attr("y", 50)
		.attr("fill", "red")
		.text("Energy");

	svg.append("text")
		.attr("class", "axisName2")
		.attr("x", w/2)
		.attr("y", h-50)
		.attr("fill", "green")
		.text("Relaxed");

	drawPlot(data);

	window.explorerMode = function(){
		exploerMode = true;
		svg.select("#background").remove();
		svg.select("#logs").remove();
		drawPlot(data);
	};

	window.logMode = function(){
		exploerMode = false;
		drawLog();
	};

	window.url = function(){
		if(information[3]!=0) {
			var win = window.open(information[3], '_blank');
			if (win) {
				win.focus();
			}
			else {
				alert("Please allow popups for this website");
			}
		}
	}

	function drawPlot(dataSet) {

		svg.select("#circles").remove();
		svg.select("#nodes").remove();

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
			.attr("fill",  "black")
			.on("mouseover", function () {
				d3.select(this)
					.attr("fill", "cyan");

			})
			.on("mouseout", function () {
				d3.select(this)
					.attr("fill", "black");
			})
			.on("click", function (d) {
				dataList = getDataList(d);
				drawGraph(dataList);
			});
	}

	function splitName(d){
		return d.replace(/\s/gi,"+");
	}

	function getDataList(d){
		//information of this song
		information[0] = d.Artist;
		information[1] = d.Title;
		information[2] = d.Genre;
		information[3] = "http://www.last.fm/music/"+splitName(d.Artist)+"/_/"+splitName(d.Title);

		if(exploerMode) {
			//put similar datas
			retlist = [];
			retlist.push(d.Song_id);
			retlist.push(d.Sim_1);
			retlist.push(d.Sim_2);
			retlist.push(d.Sim_3);
			retlist.push(d.Sim_4);
			retlist.push(d.Sim_5);
			visited.push(d);
		}
		inform(information);
		return retlist;
	}

	function drawGraph(dataList) {

		dataList2 = [];
		svg.select("#nodes").remove();

		var netGroup = svg
			.append("g")
			.attr("id", "nodes")
			.attr("x", 0)
			.attr("y", 0)
			.attr("height", h)
			.attr("width", w);

		netGroup.selectAll("circle")
			.data(dataList)
			.enter()
			.append("circle")
			.attr("cx", function (d, i) {
				return xLocation(d, i);
			})
			.attr("cy", function (d, i) {
				return yLocation(d, i);
			})
			.on("click", clickEvent)
			.transition().delay(function(d,i){return i*200})
			.attr("r", function (d, i) {
				if (i == 0) return 40;
				else return 20;
			})
			.attr("fill", function(d,i){
				if(i == 0) return "#e34a33";
				else return colors[i-1];
			})
			.style("stroke", "white")
			.style("stroke-width","2px");

		function clickEvent(d) {
			var centerD = data.filter(function(s){ if(s.Song_id == d) return s;});
			dataList2 = getDataList(centerD[0]);
			drawGraph(dataList2);
		}
	}

	window.filter = function(title){
		if(exploerMode == true) {
			svg.select("#group").remove();
			var filteredData = [];

			if (title == "all") {
				drawPlot(data);
			}
			else {
				for (var i = 0; i < data.length; i++) {
					if (data[i].Genre == title) {
						filteredData.push(data[i]);
					}
				}
				drawPlot(filteredData);
			}
		}
	};

	function inform(information){
		var artist = document.getElementById("artist");
		var title = document.getElementById("title");
		var genre = document.getElementById("genre");
		var video = document.getElementById("video");
		artist.innerHTML = "<strong>Artist : </strong>" + information[0];
		title.innerHTML = "<strong>Title : </strong>" + information[1];
		genre.innerHTML = "<strong>Genre : </strong>" + information[2];
//		video.innerHTML = "Video : " + information[3];
//		document.getElementById("video").setAttribute("href", information[3]);

	}

	function drawLog() {
		svg.select("#circles").remove();
		svg.select("#nodes").remove();


		var points = d3.range(visited.length).map(function (d) {
			return {x: visited[d].Valance, y: visited[d].Arousal};
		});

		svg.append("rect")
			.attr("id", "background")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h)
			.attr("fill", "black");

		svg.append("text")
			.attr("class", "axisName1")
			.attr("x", w-50)
			.attr("y", h/2)
			.attr("fill", "yellow")
			.text("Positive");

		svg.append("text")
			.attr("class", "axisName1")
			.attr("x", 50)
			.attr("y", h/2)
			.attr("fill", "gray")
			.text("Negative");

		svg.append("text")
			.attr("class", "axisName2")
			.attr("x", w/2)
			.attr("y", 50)
			.attr("fill", "red")
			.text("Energy");

		svg.append("text")
			.attr("class", "axisName2")
			.attr("x", w/2)
			.attr("y", h-50)
			.attr("fill", "green")
			.text("Relaxed");


		var logGroup = svg.append("g")
			.attr("id", "logs")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h);


		var d, next;
		for(var i=0; i<points.length-1; i++) {
			d = points[i];
			next = points[i+1];

			var lines = logGroup.append("line")
				.attr("x1", xScale(d.x))
				.attr("y1", yScale(d.y))
				.attr("x2", xScale(next.x))
				.attr("y2", yScale(next.y))
				.transition().duration(800).delay((i+1)*800)
				.attr("stroke", "yellow")
				.attr("stroke-width", "2");
		}

		/*
		var line = d3.line()
			.curve(d3.curveLinear)
			.x(function(d,i){ console.log(xScale(d.x));return xScale(d.x);})
			.y(function(d,i){ console.log(yScale(d.y));return yScale(d.y);});

		logGroup.selectAll(".line")
			.data(points)
			.enter().append("path")
			.attr("stroke", "yellow")
			.attr("d", line);
*/
		logGroup.selectAll("circle")
			.data(visited)
			.enter().append("circle")
			.attr("cx", function (d, i) {
				return xScale(d.Valance);
			})
			.attr("cy", function (d, i) {
				return yScale(d.Arousal);
			})
			.on("click", function(d){getDataList(d)})
			.transition().duration(800).delay(function(d,i){return i*800;})
			.attr("r", 5)
			.attr("r", 7)
			.style("fill", "orange")
			.style("stroke", "yellow");


	}

	function xLocation(d, i){
		if (d > -1) {
			var t = data.filter(function(s){ if(s.Song_id == d) return s;});
			return xScale(t[0]["Valance"]);
		}
		else return -100;
	}

	function yLocation(d, i){
		if (d > -1) {
			var t = data.filter(function(s){ if(s.Song_id == d) return s;});
			return yScale(t[0]["Arousal"]);
		}
		else return -100;
	}
});

