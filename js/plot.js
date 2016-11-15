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

	var w = screen.availWidth * 0.83;
    var h = screen.availHeight * 0.85;

	var padding = 20;   // 이유
	var dataList = [0, 0, 0, 0, 0, 0];
	var information = [0, 0, 0];
	var xScale = d3.scaleLinear()
		.domain([0, maxX])
		.range([padding, w - padding]);
	var yScale = d3.scaleLinear()
		.domain([0, maxY])
		.range([h - padding, padding]);
	var colors = d3.scaleOrdinal(d3.schemePastel1); // 어디에 쓰는건지

	var typeNum = {"rock":0, "pop":1, "soundtrack":2, "jazz":3, "metal":4, "electro":5, "world":6, "latin":7, "vocal pop":8, "classical":9, "country":10, "hip hop":11, "reggae":12, "blues":13, "folk":14, "randb":15};

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
			.attr("fill", function(d){
				if(d.visited==0) return "black";
				else return "red";
			})
			.on("mouseover", function () {
				d3.select(this)
					.attr("fill", "cyan");

			})
			.on("mouseout", function () {
				d3.select(this)
					.attr("fill", "black");
			})
			.on("click", function (d) {
				//var center = d.Song_id;
				//dataList[0] = center;
                dataList[0] = d.Song_id;

				//information of this song
				information[0] = d.Artist;
				information[1] = d.Title;
				information[2] = d.Genre;

				//put similar datas
				dataList[1] = d.Sim_1;
				dataList[2] = d.Sim_2;
				dataList[3] = d.Sim_3;
				dataList[4] = d.Sim_4;
				dataList[5] = d.Sim_5;
				d.visited = 1;

				inform(information);
				drawGraph(dataList);
			});
	}

	function drawGraph(dataList) {

		svg.select("#group").remove();  // 왜 지워 주는지

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
			.attr("cx", function (d, i) {
				return xLocation(d, i);
			})
			.attr("cy", function (d, i) {
				return yLocation(d, i);
			})
			.transition()
			.attr("r", function (d, i) {
				if (i == 0) return 70;
				else return 50;
			})
			.attr("fill", function(d,i){
				console.log(i);
				return colors(i);
			});


		var textgroup = netGroup
			.selectAll("text")
			.data(dataList)
			.enter()
			.append("text")
			.attr("class", "text")
			.attr("x", function (d, i) {
				 return xLocation(d, i);
			 })
		 	.attr("y", function (d, i) {
				 return yLocation(d, i);
			 })
			.transition()
			.text(function (d, i) {
				var resultArtist;
				var resultTitle;
				var j = 0;
				console.log(d);
				if(d != -1) {
					while (1) {
						if (data[j].Song_id == d) {
							console.log("index : ", j);
							resultArtist = data[j].Artist;
							resultTitle = data[j].Title;
							break;
						}
						j++;
					}
					return resultArtist + "-" + resultTitle;
				}
			});
	}

	window.filter = function(title){

		svg.select("#group").remove();
		var filteredData = [];

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
		artist.innerHTML = "Artist : " + information[0];
		title.innerHTML = "Title : " + information[1];
		genre.innerHTML = "Genre : " + information[2];
	}

	function xLocation(d, i){
		if(i == 0) return w/2;
		else {
			if (d == -1) return -100;
			else {
				if (i == 1) return w / 2 + 100;
				else if (i == 2) return w / 2 + 200;
				else if (i == 3) return w / 2 + 50;
				else if (i == 4) return w / 2 - 200;
				else if (i == 5) return w / 2 - 150;
			}
		}

	}

	function yLocation(d, i){
		if (i == 0) return h / 2;
		else {
			if (d == -1) return -100;
			else {
				if (i == 1) return h / 2 - 200;
				else if (i == 2) return h / 2;
				else if (i == 3) return h / 2 + 200;
				else if (i == 4) return h / 2 + 100;
				else if (i == 5) return h / 2 - 150;
			}
		}
	}

});

