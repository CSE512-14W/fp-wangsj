/*
var width = 960,
    height = 500;

var fill = d3.scale.category20();

var force = d3.layout.force()
    .size([width, height])
    .nodes([{}]) // initialize with a single node
    .linkDistance(30)
    .charge(-60)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("mousemove", mousemove)
    .on("mousedown", mousedown);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

var cursor = svg.append("circle")
    .attr("r", 30)
    .attr("transform", "translate(-100,-100)")
    .attr("class", "cursor");

restart();

var path = svg.append("svg:g").selectAll("path")
.data(force.links())
.enter().append("svg:path")
.attr("class", function(d) { return "link " + d.type; })
.attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("svg:g").selectAll("circle")
.data(force.nodes())
.enter().append("svg:circle")
.attr("r", 6)
.call(force.drag);

var text = svg.append("svg:g").selectAll("g")
.data(force.nodes())
.enter().append("svg:g");

//A copy of the text with a thick white stroke for legibility.
text.append("svg:text")
.attr("x", 8)
.attr("y", ".31em")
.attr("class", "shadow")
.text(function(d) { return d.name; });

function mousemove() {
  cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
}

function mousedown() {
  var point = d3.mouse(this),
      node = {x: point[0], y: point[1]},
      n = nodes.push(node);

  // add links to any nearby nodes
  nodes.forEach(function(target) {
    var x = target.x - node.x,
        y = target.y - node.y;
    if (Math.sqrt(x * x + y * y) < 30) {
      links.push({source: node, target: target});
    }
  });

  restart();
}

function tick() {
	  path.attr("d", function(d) {
	    var dx = d.target.x - d.source.x,
	        dy = d.target.y - d.source.y,
	        dr = 75/d.linknum;  //linknum is defined above
	    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
	  });

	  circle.attr("transform", function(d) {
	    return "translate(" + d.x + "," + d.y + ")";
	  });

	  text.attr("transform", function(d) {
	    return "translate(" + d.x + "," + d.y + ")";
	  });
	}


function restart() {
  link = link.data(links);

  link.enter().insert("line", ".node")
      .attr("class", "link");

  node = node.data(nodes);
  
  node.enter().insert("circle", ".cursor")
      .attr("class", "node")
      .attr("r", 5)
      .call(force.drag);
  

  force.start();
}

//Starting here

var dataset = [];
var my_nodes = [];
var start, end;
var start_node, end_node;


function handleLinks() {
	links.sort(function(a,b) {
	    if (a.source > b.source) {return 1;}
	    else if (a.source < b.source) {return -1;}
	    else {
	        if (a.target > b.target) {return 1;}
	        if (a.target < b.target) {return -1;}
	        else {return 0;}
	    }
	});
	//any links with duplicate source and target get an incremented 'linknum'
	for (var i=0; i<links.length; i++) {
	    if (i != 0 &&
	        links[i].source == links[i-1].source &&
	        links[i].target == links[i-1].target) {
	            links[i].linknum = links[i-1].linknum + 1;
	        }
	    else {links[i].linknum = 1;};
	};
}
*/


var links = [];
var nodes = [];

var start, end;

var w = TOTAL_WIDTH * 0.65, h = TOTAL_HEIGHT;
var radius = 100;
var dataset = [];

var start_ndoe;
var end_node;


var max_node_name = 0;

var drag = d3.behavior.drag()
			.on("drag", dragAll)
			.on("dragstart", function() {
				d3.event.sourceEvent.stopPropagation(); // silence other listeners
				force.stop();
				d3.select('body').style("cursor", "move");
				
			})
			.on("dragend", dragEnd);


var svg = d3.select("#vis").append("svg:svg");
//.attr("width", w)
//.attr("height", h);


//.call(drag);

var drag_rect = svg.append("rect")
				.attr("width", TOTAL_WIDTH)
				.attr("height", TOTAL_HEIGHT)
				.style("z-index", "1")
				.attr("fill", "white")
				.call(drag);

//Per-type markers, as they don't inherit styles.
svg.append("svg:defs").selectAll("marker")
	.data(["suit", "licensing", "resolved"])
	.enter().append("svg:marker")
	.attr("id", String)
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 15)
	.attr("refY", -1.5)
	.attr("markerWidth", 3)
	.attr("markerHeight", 3)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M0,-5L10,0L0,5");


var center_x = 0;
var center_y = 0;


var edge_not_node = 0;
var selected_edge = 0;
var selected_node = 0;

function toolBoxSetup() {
	if(edge_not_node == 1) {
		$("#sep_button").button("option", "disabled", false);
		if(++ selected_edge > 1) $("#merge_button").button( "option", "disabled", false );
	}
	else if(edge_not_node == 2) {
		if(edit_node != null && edit_node2 == null) $("#remove_button").button( "option", "disabled", false );
		else if(edit_node != null && edit_node2 != null) $("#merge_button").button( "option", "disabled", false );
	}
	else {
		$("#remove_button").button( "option", "disabled", true );
		$("#merge_button").button( "option", "disabled", true );
		$("#sep_button").button( "option", "disabled", true );
	}
}

function toolBoxClear() {
	edge_not_node = 0;
	selected_edge = 0;
	selected_node = 0;
	
	$("#remove_button").button( "option", "disabled", true );
	$("#merge_button").button( "option", "disabled", true );
	$("#sep_button").button( "option", "disabled", true );
}


function errorMessage(message) {
	
	console.log(message);
	$("#errortext").text(message);
	$("#error").css("visibility", "visible");
	$("#error").show(100, function(){
//		alert("st");
//		$("#error").hide(2000, "linear");
		
		$("#error").delay(2000).slideUp(400);
//		$("#error").css("visibility", "hidden");
	});
	
	
//	$("#error").offset({top: TOTAL_HEIGHT * 0.05, left: TOTAL_WIDTH * 0.5 - $("#error").width / 2 });
}

function infoMessage(message) {
	$("#infotext").text(message);
	$("#info").css("visibility", "visible");
	$("#info").show();
}

function infoMessageClear() {
	$("#info").css("visibility", "hidden");
	$("#info").hide();
}



function mergeNodeOrEdge() {
	if(edge_not_node == 1) mergeEdge();
	else if(edge_not_node == 2) mergeNode();
}


function dragAll() {
//	d3.select('body').style("cursor", "move");
	
//	console.log("drag");
	
//	var offset = $("#vis").offset();
	
//	$("#vis").offset({top: offset.top + d3.event.dy, left: offset.left + d3.event.dx});
	
//	svg.attr("transform", "translate(" + [d3.event.x, d3.event.y] + ")");
	
//	force.on("tick", null);
//	d3.select('rect#no-drag').on('mousedown.drag', null);
	
	
//	circle.on("mousedown.drag", null);
//	circle.on("touchstart.drag", null);
	
//	force.alpha(0);
//	force.stop();
//	circle.each(function(){d3.select(this).call(force.drag().on("drag.force", 
//			function() {
//				alert("Asd");
//				d3.select(this).attr("transform", "translate(" + d3.event.x + "," + d3.event.y + ")");
//			})
//		)});
	
	for(var i=0; i<nodes.length; i++) {
//		if (typeof(myVariable) == "undefined") continue;
		nodes[i].fixed = false;
		nodes[i].x += d3.event.dx;
		nodes[i].y += d3.event.dy;
		
		nodes[i].px += d3.event.dx;
        nodes[i].py += d3.event.dy;
		
	}
	
//	center_x += d3.event.dx;
	tick();
//	
//	start_node.fixed = true;
//	end_node.fixed = true;
	
//	console.log(start_node.x);
	
//	d3.event.stopPropagation();
	
//	refresh();
//	force.start();
}



function dragEnd() {

	for(var i=0; i<nodes.length; i++) {
//		if (typeof(myVariable) == "undefined") continue;
		nodes[i].fixed = nodes[i].selected;
	}
	
	start_node.fixed = true;
	end_node.fixed = true;
	
//	console.log(start_node.x);
	if(mode) d3.select('body').style("cursor", "crosshair");
	else d3.select('body').style("cursor", "default");
	tick();
	force.start();
}



function addMarker() {
	svg.append("svg:defs").selectAll("marker")
	.data(["suit", "licensing", "resolved"])
	.enter().append("svg:marker")
	.attr("id", String)
	.attr("viewBox", "0 -5 10 10")
	.attr("refX", 15)
	.attr("refY", -1.5)
	.attr("markerWidth", 3)
	.attr("markerHeight", 3)
	.attr("orient", "auto")
	.append("svg:path")
	.attr("d", "M0,-5L10,0L0,5");
}


var path, force, text, circle, text_edge;

function handleLinks() {
	//sort links by source, then target
//	links.sort(function(a,b) {
//	    if (a.source > b.source) {return 1;}
//	    else if (a.source < b.source) {return -1;}
//	    else {
//	        if (a.target > b.target) {return 1;}
//	        if (a.target < b.target) {return -1;}
//	        else {return 0;}
//	    }
//	});
//	//any links with duplicate source and target get an incremented 'linknum'
//	for (var i=0; i<links.length; i++) {
//	    if (i != 0 &&
//	        links[i].source == links[i-1].source &&
//	        links[i].target == links[i-1].target) {
//	            links[i].linknum = links[i-1].linknum + 1;
//	        }
//	    else {links[i].linknum = 1;};
//	};
	handleLinknum();
	
	// Compute the distinct nodes from the links.
	links.forEach(function(link) {
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, links: [], fixed: false, selected: false, edit: false});
		link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, links: [], fixed: false, selected: false, edit: false});
	});
	
	links.forEach(function(link) {
		link.source.links.push(link);
	});

}


function handleLinknum() {
	//sort links by source, then target
	links.sort(function(a,b) {
	    if (a.source.name > b.source.name) {return 1;}
	    else if (a.source.name < b.source.name) {return -1;}
	    else {
	        if (a.target.name > b.target.name) {return 1;}
	        if (a.target.name < b.target.name) {return -1;}
	        else {return 0;}
	    }
	});
	//any links with duplicate source and target get an incremented 'linknum'
	for (var i=0; i<links.length; i++) {
	    if (i != 0 &&
	        links[i].source == links[i-1].source &&
	        links[i].target == links[i-1].target) {
	            links[i].linknum = links[i-1].linknum + 1;
	        }
	    else {links[i].linknum = 1;};
	};
}

var mode = 0;	//0 for explore, 1 for edit

function setMode() {
	mode = 1 - mode;
	if(mode) {
		d3.select('body').style("cursor", "crosshair");
	}
	else {
		d3.select('body').style("cursor", "default");
		resetToModeOne();
	}
	toolBoxClear();
}

function resetToModeOne() {
	if(edit_node != null) {
		edit_node.edit = false;
		edit_circle.attr("fill", "#ccc");
		edit_node = null;
		edit_circle = null;
	}
	
	if(edit_node2 != null) edit_node2.edite = false;
	if(edit_circle2 != null) edit_circle2.attr("fill", "#ccc");
	edit_node2 = null;
	edit_circle2 = null;
	
	for(var i=0; i<edit_path.length; i++) {
		edit_path[i].edit = false;
	}
	edit_path = [];
	
	resetColor();
}



function historyChangeSeparate(p, p_list) {
	links_n = [];
	for(var i=0; i<links.length; i++) {
		if(links[i] != p) links_n.push(links[i]);
	}
	
	for(var i=0; i<p_list.length; i++) {
		links_n.push(p_list[i]);
		p.source.links.push(p_list[i]);
	}
	
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
//	history_str_length.push(path_string_length);
	
	links = links_n;
	
}


function assignLinkNum(s, p_list) {
	var max_ln = 0;
//	for(var i=0; i<s.links.length; i++) {
//		if(s.links[i].linknum > max_ln) max_ln = s.links[i].linknum;
//	}
	
	for(var i=0; i<links.length; i++) {
		if(links[i].source == s && links[i].linknum > max_ln) {
			max_ln = links[i].linknum;
//			console.log(max_ln, links[i].content);
		}
	}
	
//	console.log(max_ln);

	for(var i=1; i<p_list.length; i++) {
		p_list[i].linknum = ++ max_ln;
	}
}


function separateOneEdge(p) {
	if(p.path.length <= 1) return;
	
	var s = p.source;
	var t = p.target;
	var c = p.content;
	
	var p_list = []
	
	for(var i=0; i<p.path.length; i++) {
		link_n = {source: s, target: t, type: "suit", content: c, clicked: p.clicked, linknum: p.linknum, path:[p.path[i]]};
//		links.push(link_n);
		p_list.push(link_n);
	}
	
	historyChangeSeparate(p, p_list);
	assignLinkNum(s, p_list);
	
	
	refresh();
	
}


var edit_path = [];

var edit_node = null;
var edit_circle = null;

var edit_node2 = null;
var edit_circle2 = null;

function separateEdge() {
	var t1 = +new Date();
	
	for(var i=0; i<edit_path.length; i++) {
		separateOneEdge(edit_path[i]);
		edit_path[i].edit = false;
	}
	
	edit_path = [];
	
	var t2 = +new Date();
	console.log(t2 - t1);
}


function historyChangeMerge(p, p_list) {
	links_n = [];
	for(var i=0; i<links.length; i++) {
		if($.inArray(links[i], p_list) < 0) links_n.push(links[i]);
	}
	
	links_n.push(p);
	
	p.source.links.push(p);
	
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
//	history_str_length.push(path_string_length);
	
	links = links_n;
	
}


function reassignLinknumMerge(p, p_list, s) {
	var ln = 1;
	var cur_links = [];
	for(var i=0; i<links.length; i++) {
		if(links[i].source == s) cur_links.push(links[i]);
	}
	
	for(var i=0; i<cur_links.length; i++) {
		if($.inArray(cur_links[i], p_list) < 0) {
			cur_links[i].linknum = ln++;
//			console.log(links[i].content + "," + ln);
		}
	}
	p.linknum = ln;
}

function mergeCorrectEdges(s, t) {
	var e = edit_path[0];
	var path_n = [];
	var path_set = {};
	
	for(var i=0; i<edit_path.length; i++) {
		var tmp_e = edit_path[i];
		for(var j=0; j<tmp_e.path.length; j++) {
			path_set[tmp_e.path[j]] = tmp_e.path[j];
		}
	}
	for(var key in path_set) path_n.push(key);
	
	link_n = {source: s, target: t, type: "suit", linknum: e.linknum, content: e.content, clicked: e.clicked, path: path_n};

	reassignLinknumMerge(link_n, edit_path, s);
	historyChangeMerge(link_n, edit_path);
	
	refresh();
}


function disEdit(wrong) {
	for(var i=0; i<edit_path.length; i++) {
		edit_path[i].edit = false;
	}
	resetColor();
	edit_path = [];
	
	toolBoxClear();
	if(wrong) errorMessage("not valid edges to merge")
}


function mergeEdge() {

	var t1 = +new Date();
	
	if(edit_path.length <= 1) {
		disEdit(true);
		return;
	}
	
	var s = edit_path[0].source;
	var t = edit_path[0].target;
	var wrong = false;
	for(var i=1; i<edit_path.length; i++) {
		if(edit_path[i].source != s || edit_path[i].target != t) {
			wrong = true;
			break;
		}
		if(edit_path[i].content !== edit_path[0].content) {
			wrong = true;
			break;
		}
	}
	
	if(!wrong) {
		mergeCorrectEdges(s, t);
	}
//	console.log(wrong);
	disEdit(wrong);
	
	var t2 = +new Date();
	console.log(t2 - t1);
	
}


function addEditEdge(p, edge) {
	
	var pos = $.inArray(p, edit_path);
	if(pos < 0) {
		edit_path.push(p);
		edge.attr("fill", "purple");
		p.edit = true;
	}
	else {
		edit_path.splice(pos, 1);
		edge.attr("fill", "steelblue");
		p.edit = false;
	}
}


var add_node_path = null;
var add_node_edge = null;


var add_path_dragged = false;

var path_clicked = false;

var dragAddNode = d3.behavior.drag()
				.on("drag", function(){
					add_path_dragged = false;
					if(mode) {
						addNodeDrag();
					}
				})
				.on("dragstart", function(){
					if(mode) {
						infoMessage("drag horizontally to find a position to add a node");
	//					console.log("start drag");
						if (d3.event.defaultPrevented) return;
						d3.event.sourceEvent.stopPropagation(); // silence other listeners
						d3.select('body').style("cursor", "move");
					}
					
				})
				.on("dragend", function(){
					if(mode) {
						infoMessageClear();
//						console.log("end drag");
						d3.select('body').style("cursor", "crosshair");
						
						if(add_path_dragged) {
							addNodeDragEnd();
							add_path_dragged = false;
						}
					}
				});
				


var addNodePos = 0;
var addNodeName = 1000;


function addNodeHistory(n, ln1, ln2) {
	
	
	lns = [];
	for(var i=0; i<links.length; i++) {
		if(links[i] != add_node_path) lns.push(links[i]);
	}
	lns.push(ln1);
	lns.push(ln2);
	
	add_node_path.source.links.push(ln1);
	n.links.push(ln2);
	
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
	
	links = lns;
	nodes.push(n);
}


function addNodeDragEnd() {
	
	var t1 = +new Date();
	
	var ln = [];
	var s = add_node_path.source;
	var t = add_node_path.target;
	
	var c = add_node_path.content;
	var c1 = c.substring(0, addNodePos);
	var c2 = c.substring(addNodePos);
	
	var n = {name: ++ max_node_name, fixed: false, edit: false, links: [], selected: false};
	
	var ln1 = {source: s, target: n, type: "suit", linknum: 1, content: c1, path: add_node_path.path};
	var ln2 = {source: n, target: t, type: "suit", linknum: 1, content: c2, path: add_node_path.path};
	
	addNodeHistory(n, ln1, ln2);
	
	refresh();
	
	var t2 = +new Date();
	console.log(t2 - t1);
}


function addNodeDrag() {
//	console.log("drag");
//	console.log(add_node_path);
	var dx = d3.event.x;
	var c = add_node_path.content;
	
	
	if(c.length <= 1) return;
	var pos = Math.floor(c.length / 2);
	console.log()
	pos += Math.floor((dx - add_node_start_x) / 20);
	
	
	if(pos < 1) pos = 1;
	if(pos > c.length - 1) pos = c.length - 1;
	
//	console.log(pos);
	
	$("#content").html("<font color=\"red\">" +  c.substring(0,pos) + "  |  " + c.substring(pos) + "</font>");
	addNodePos = pos;
	
	add_path_dragged = true;
}


function addNode() {
	var p = edit_path[0];
}


function historyRemoveNode(links_n, nodes_n) {
	
	
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
	
	links = links_n;
	nodes = nodes_n;
	
	handleLinknum();
	
	edit_node = null;
	edit_circle.attr("fill", "#ccc");
	edit_circle = null;
	
	edit_node2 = null;
	if(edit_circle2 != null) edit_circle2.attr("fill", "#ccc");
	edit_circle2 = null;
	
}

function historyMergeNode(n, lns, in1, in2, out1, out2) {
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
	
	var ns = [];
	for(var i=0; i<nodes.length; i++) {
		if(nodes[i] != edit_node && nodes[i] != edit_node2) ns.push(nodes[i]);
	}
	ns.push(n);
	
	
	links_n = [];
	for(var i=0; i<links.length; i++) {
		if(links[i].target != edit_node 
				&& links[i].target != edit_node2
				&& links[i].source != edit_node
				&& links[i].source != edit_node2)
			links_n.push(links[i]);
	}
	for(var i=0; i<lns.length; i++) links_n.push(lns[i]);
	links = links_n;
	
	nodes = ns;
	
	handleLinknum();
}



function directParent(n1, n2) {
	for(var i=0; i<links.length; i++) {
		if(links[i].source == n1 && links[i].target == n2) return true;
		if(links[i].target == n1 && links[i].source == n2) return true;
	}
	
	return false
}


function mergeNode() {
	
	
	var t1 = +new Date();
	
	if(edit_node == null || edit_node2 == null) {
		toolBoxClear();
		return;
	}
	if(directParent(edit_node, edit_node2)) {
		toolBoxClear();
//		console.log("do not support direct parent-child nodes");
		errorMessage("do not support direct parent-child nodes");
		
		edit_node = null;
		edit_circle.attr("fill", "#ccc");
		edit_circle = null;
		
		edit_node2 = null;
		edit_circle2.attr("fill", "#ccc");
		edit_circle2 = null;
		return;
	}
	
	var n = {name: ++ max_node_name, fixed: false, edit: false, links: [], selected: false};
	
	
	var in1 = [], in2 = [], out1 = [], out2 = [];
	
	for(var i=0; i<links.length; i++) {
		if(links[i].target == edit_node) in1.push(links[i]);
		if(links[i].target == edit_node2) in2.push(links[i]);
		if(links[i].source == edit_node) out1.push(links[i]);
		if(links[i].source == edit_node2) out2.push(links[i]);
	}

	var lns = [];
	
	var l = in1;
	for(var i=0; i<l.length; i++) {
		var ln = {source: l[i].source, target: n, type: "suit", content: l[i].content, clicked: false, linknum: l[i].linknum, path: l[i].path};
		lns.push(ln);
		l[i].source.links.push(ln);
	}
	
	l = in2;
	for(var i=0; i<l.length; i++) {
		var ln = {source: l[i].source, target: n, type: "suit", content: l[i].content, clicked: false, linknum: l[i].linknum, path: l[i].path};
		lns.push(ln);
		l[i].source.links.push(ln);
	}
	
	l = out1;
	for(var i=0; i<l.length; i++) {
		var ln = {source: n, target: l[i].target, type: "suit", content: l[i].content, clicked: false, linknum: l[i].linknum, path: l[i].path};
		lns.push(ln);
		n.links.push(ln);
	}
	
	l = out2;
	for(var i=0; i<l.length; i++) {
		var ln = {source: n, target: l[i].target, type: "suit", content: l[i].content, clicked: false, linknum: l[i].linknum, path: l[i].path};
		lns.push(ln);
		n.links.push(ln);
	}
	
	historyMergeNode(n, lns, in1, in2, out1, out2);
	
	refresh();
	
	edit_node = null;
	edit_circle.attr("fill", "#ccc");
	edit_circle = null;
	
	edit_node2 = null;
	edit_circle2.attr("fill", "#ccc");
	edit_circle2 = null;
	
	
	var t2 = +new Date();
	console.log(t2 - t1);
	
}



function removeNode() {
	
	var t1 = +new Date();
	
	var in_edge = [];
	var out_edge = [];
	var links_n = [];
	
	var nodes_n = [];
	
	for(var i=0; i<nodes.length; i++) {
		if(nodes[i] != edit_node) nodes_n.push(nodes[i]);
	}
	
	for(var i=0; i<links.length; i++) {
		if(links[i].source == edit_node) out_edge.push(links[i]);
		else if(links[i].target == edit_node) in_edge.push(links[i]);
		else links_n.push(links[i]);
	}
	
	var path_map = {};
	for(var i=0; i<in_edge.length; i++) {
		var s = in_edge[i].source;
		var c = in_edge[i].content;
		for(var j=0; j<in_edge[i].path.length; j++) {
			p = in_edge[i].path[j];
			path_map[p] = {source: s, c1: c, linknum: in_edge[i].linknum};
		}
	}
	
	for(var i=0; i<out_edge.length; i++) {
		var t = out_edge[i].target;
		console.log(t);
		var c = out_edge[i].content;
		for(var j=0; j<out_edge[i].path.length; j++) {
			p = out_edge[i].path[j];
			path_map[p].target = t;
			path_map[p].c2 = c;
		}
	}
	
	console.log(out_edge);
	
	for(var p in path_map) {
		map = path_map[p];
//		console.log(map);
		ln = {source: map.source, target: map.target, content: map.c1 + map.c2, type:"suit", path: [p], linknum: 1, clicked: false};
		links_n.push(ln);
		map.source.links.push(ln);
	}
	
	historyRemoveNode(links_n, nodes_n);
	
	refresh();
	
	var t2 = +new Date();
	console.log(t2 - t1);
}


function addEditNode(n, n_circle) {
	
	if(n == edit_node) {
		edit_node.edit = false;
		edit_circle.attr("fill", "#ccc");
		edit_node = edit_node2;
		edit_circle = edit_circle2;
		
		edit_node2 = null;
		edit_circle2 = null;
	}
	else if(n == edit_node2) {
		edit_node2.edit = false;
		edit_circle2.attr("fill", "#ccc");
		
		edit_node2 = null;
		edit_circle2 = null;
	}
	else {
		if(edit_node == null) {
			edit_node = n;
			edit_circle = n_circle;
			n.edit = true;
			n_circle.attr("fill", "orange");
		}
		else if(edit_node2 == null) {
			edit_node2 = n;
			edit_circle2 = n_circle;
			n.edit = true;
			n_circle.attr("fill", "orange");
		}
		else {
			edit_node.edit = false;
			edit_circle.attr("fill", "#ccc");
			
			edit_node = n;
			edit_circle = n_circle;
			n.edit = true;
			n_circle.attr("fill", "orange");
		}
	}
	
//	if(edit_node != null) {
//		if(edit_node2 != null) {
//			edit_node.edit = false;
//			edit_circle.attr("fill", "#ccc");
//		}
//		else {
//			
//		}
//	}
//	
//	if(edit_node == n) {
//		edit_node = null;
//		return;
//	}
//	
//	edit_node = n;
//	edit_circle = n_circle;
//	n.edit = true;
//	n_circle.attr("fill", "orange");
	
//	console.log(edit_node);
//	console.log(edit_node2);
}



function parsePath(path_str) {
	tmp_str = path_str.substring(1, path_str.length - 1);
	result = tmp_str.split(";");
	
	return result;
}


var cached_search_path = [];


function searchPath(c_path, c_edge) {
	
	cached_search_path = [];
	
	var edges = svg.selectAll("path")[0];
	for(var i=3; i<edges.length; i++) {
		var d3_edge = d3.select(edges[i]);
		var data = d3_edge.data()[0];
		
		for(var j=0; j<c_path.length; j++) {
			if($.inArray(c_path[j], data.path) >= 0) {
				d3_edge.attr("stroke", "orange");
				cached_search_path.push(d3_edge);
				
				break;
			}
		}
	}
}



function queryText(text_id) {
	searchPath([text_id.substring(4)], null);
	return 0;
}


function resetColor() {
	var edges = svg.selectAll("path")[0];
	for(var i=3; i<edges.length; i++) {
		var d3_edge = d3.select(edges[i]);
		if(d3_edge.data()[0].edit) d3_edge.attr("stroke", "purple");
		else d3_edge.attr("stroke", "steelblue");
	}
}


var path_string_length_tmp = 0;
var path_string_length = 0;


var searchPathRecur = function (c_path, node, target_link, html, str_length) {
//	console.log(c_path);
	if(node == start_node) {
		$('#content').html("");
		path_string_length_tmp = 0;
		
		for(var i=0; i<links.length; i++) links[i].visited = [];
		
	}
	if(node == end_node) {
		var last_text = $('#content').html();
		var id = "path" + c_path[0];
		var call_func = "onmouseover=\"queryText(this.id);\" onmouseout=\"resetColor()\""
		var div_sig = "<div class=\"content_div\" id=\"" +id + "\" " + call_func + ">";
		
		path_string_length_tmp += str_length;
		
		$('#content').html(last_text + div_sig + html + "</div>");
//		console.log(c_path);
//		console.log(div_sig);
		
//		$("#" + id).mouseover(function() {
//			queryText(id);
//		});
	}
	
	var ls = node.links;
	
	for(var i=0; i<ls.length; i++) {
		
		if($.inArray(ls[i],links) >= 0)
		for(var j=0; j<c_path.length; j++) {
			
			var pos = $.inArray(c_path[j], ls[i].path);
//			console.log(ls[i].content + ":" + i + "," + j + "," + pos + "," + c_path[j]);

			var pos2 = $.inArray(c_path[j], ls[i].visited);
			
			if(pos >= 0 && pos2 < 0) {
				ls[i].visited.push(c_path[j]);
				
				var next_html = "";
				if(ls[i] == target_link) {
					next_html = html + "<font color=\"red\"> " + ls[i].content + " </font>";
				}
				else {
					next_html = html + " " + ls[i].content;
				}
				
//				console.log(ls[i].target.name);
//				console.log(c_path);
//				console.log(ls[i].path[pos] + "," + ls[i].content);
				var next_html = searchPathRecur([ls[i].path[pos]], ls[i].target, target_link, next_html, str_length + ls[i].content.length);
				
			}
		}
	}
	
}


function searchPathOut() {
	for(var i=0; i<cached_search_path.length; i++) {
		if(!cached_search_path[i].data()[0].edit) cached_search_path[i].attr("stroke", "steelblue");
		else cached_search_path[i].attr("stroke", "purple");
	}
}


var cached_nodes = [];

var history_nodes = [];
var history_links = [];
var history_path = [];

var history_str_length = [];


function constrainOnPath(path, edge, edge_raw) {
	cached_nodes = [];
	
	node_set = {};
	
	for(var i=0; i<cached_search_path.length; i++) {
//		cached_nodes.push(cached_search_path[i].data()[0].source);
//		cached_nodes.push(cached_search_path[i].data()[0].target);
		node_set[cached_search_path[i].data()[0].source.name] = cached_search_path[i].data()[0].source;
		node_set[cached_search_path[i].data()[0].target.name] = cached_search_path[i].data()[0].target;
	}

	for(var key in node_set) cached_nodes.push(node_set[key]);
	
	
	
	if(cached_nodes.length == nodes.length && cached_search_path.length == links.length) {
		path.clicked = false;
		return;
	}
	
	path_string_length = path_string_length_tmp;
	
	history_nodes.push(nodes.slice(0));
	history_links.push(links.slice(0));
	history_path.push(path);
	history_str_length.push(path_string_length);
	
	nodes = cached_nodes;
	
	var tmp_links = []
	for(var i=0; i<cached_search_path.length; i++) {
		var tmp_link = cached_search_path[i].data()[0];
		tmp_links.push(tmp_link)
		
		if(tmp_link != path && tmp_link.clicked) tmp_link.clicked = false;
	}
	
	links = tmp_links;
	path.clicked = true;
	
	refresh();
	
//	d3.selectAll("circle").call(force.drag);
	
}


function goBackHistory() {
	
	if(history_nodes.length == 0) return;
	
	nodes = history_nodes.pop();
	links = history_links.pop();
	
	history_str_length.pop();
	if(history_str_length.length > 0) path_string_length = history_str_length.pop();
	else path_string_length = 0;

	
	history_path.pop();
	
	for(var i=0; i<links.length; i++) {
		links[i].clicked = false;
	}
	if(history_path.length > 0) {
		history_path[history_path.length - 1].clicked = true;
	}
	
	refresh();
}


function refresh() {
	force.stop();
	
	d3.selectAll("path").remove();
	d3.selectAll("circle").remove();
	d3.selectAll("text").remove();
	
	handleLinknum();
	
	addMarker();
	addAll();
	
	toolBoxClear();
}


function showStats() {
	var num_nodes = nodes.length;
	var num_edges = links.length;
	var orig_str_length = path_string_length;
	var cur_str_length = 0;
	var comp_ratio;
	
	if(orig_str_length <= 0) {
		orig_str_length = 0;
		for(var i=0; i<links.length; i++) {
			orig_str_length += links[i].content.length * links[i].path.length;
		}
	}
	
	for(var i=0; i<links.length; i++) {
//		orig_str_length += links[i].content.length * links[i].path.length;
		cur_str_length += links[i].content.length;
	}
	
	comp_ratio = Math.floor((1 - cur_str_length * 1.0 / orig_str_length) * 1000) / 1000.0;
	
	$("#stats").html("lattice stats:"
					+ "<br> <br> num nodes: " + num_nodes 
					+ "<br> num edges: " + num_edges
					+ "<br> original string length: " + orig_str_length
					+ "<br> lattice string length: " + cur_str_length
					+ "<br> compression ratio: " + comp_ratio);
}


function addAll() {
	
	start_node.fixed = true;
	start_node.x = 300;
	start_node.y = 200;

	
	end_node.fixed = true;
	end_node.x = 700;
	end_node.y = 600;
	
	force = d3.layout.force()
	    .nodes(d3.values(nodes))
	    .links(links)
	    .size([w, h])
	    .linkDistance(function(d) {return 80 * Math.sqrt(d.content.length);})
	    .charge(-300)
	    .on("tick", tick)
	    .start();
	
	path = svg.append("svg:g").selectAll("path")
	    .data(force.links())
	  .enter().append("svg:path")
	    .attr("class", function(d) { return "link " + d.type; })
	    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
	    .attr("stroke", "steelblue")
	    .attr("id", function(d) {return d.source.name + "," + d.target.name + "," + d.linknum;})
	    .attr("stroke-width", function(d) {return d.path.length * 1.2 + 1 + "px";})
		.on("mouseover", 
			function(d, i) {
				searchPath(d.path, d3.select(this));
				searchPathRecur(d.path, start_node, d, "", 0);
				d3.select(this).attr("stroke", "red");
				
//				$('#content').text(d.content);
			}
		)
		.on("mouseout",
			function(d, i) {
				searchPathOut();
//				if(typeof cached_clicked_edge != 'undefined') {
//					d3.select(svg.selectAll("path")[0][cached_clicked_edge]).attr("stroke", "purple");
//				}
			}
		)
		.on("mousedown",
			function(d) {
				add_node_path = d;
				add_node_edge = d3.select(this);
				add_node_start_x = d3.mouse(this)[0];
//				console.log(add_node_start_x);
			}
		)
		.on("click",
			function(d, i) {
				if (d3.event.defaultPrevented) return;
//				d3.event.sourceEvent.stopPropagation();
//				console.log("clicked");
				if(mode) {
					
					if(edge_not_node == 2) {errorMessage("cannot operate on both edges and nodes"); return;}
					
					addEditEdge(d, d3.select(this));
					d3.select(this).attr("fill", "purple");
					
					edge_not_node = 1;
					toolBoxSetup();
				}
				else {
					if(d.clicked) {
						goBackHistory();
					}
					else {
						constrainOnPath(d, d3.select(this), i);
					}
				}
				
			}
		)
		.call(dragAddNode);
	
	circle = svg.append("svg:g").selectAll("circle")
	    .data(force.nodes())
	  .enter().append("svg:circle")
	    .attr("r", 6)
	    .attr("fill", "#ccc")
	    .attr("stroke",
	    	function(d) {
	    		if(d == start_node || d == end_node) return "#4DB84D";
	    		else if(d.fixed) return "#FF5959";
		    	return "black";
	    	}
	    )
	    .on("click",
	    	function(d) {
	    		if(d != start_node && d != end_node) {

	    			if(mode) {
	    				
	    				if(edge_not_node == 1) {errorMessage("cannot operate on both edges and nodes"); return;}
	    				
	    				addEditNode(d, d3.select(this));
	    				
	    				edge_not_node = 2;
	    				toolBoxSetup();
	    			}
	    			else{
	    				if(!d.fixed) {
		    				d3.select(this).attr("stroke", "#FF5959");
		    				
		    			}
		    			else {
		    				d3.select(this).attr("stroke", "black");
		    			}
		    			d.fixed = !d.fixed;
		    			d.selected = !d.selected;
	    			}
	    		}
	    			
	    	}
	    )
	    .call(force.drag);
		
	
	text = svg.append("svg:g").selectAll("g")
	    .data(force.nodes())
	  .enter().append("svg:g");
	
	// A copy of the text with a thick white stroke for legibility.
	text.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .attr("class", "shadow")
	    .text(function(d) { return d.name; });
	
	text.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .text(function(d) { return d.name; });
	
	
	text_edge = svg.append("svg:g").selectAll("g")
			.data(force.links())
		.enter().append("svg:g");
	text_edge.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .attr("class", "shadow")
	    .text(function(d) { return d.content; });

	text_edge.append("svg:text")
	    .attr("x", 8)
	    .attr("y", ".31em")
	    .text(function(d) { return d.content; });
	
	showStats();
}





// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
	
	circle.attr("transform", function(d) {
		if(d.name == start) {
//			d.fixed = true;
//			d.x = 200;
//			d.y = 200;
		}
		if(d.name == end) {
//			d.fixed = true;
//			d.x = 400;
//			d.y = 400;
		}
		
		if(d.selected) {
			d.fixed = true;
		}
		
//		console.log(d.x);
//		console.log(d.x + (float)svg.attr("cx"));
		
	    return "translate(" + d.x + "," + d.y + ")";
	});
	
	
	path.attr("d", function(d) {
		
		var linknum = d.linknum/2;
		if(d.linknum % 2) linknum ++;
		
		var dx = d.target.x - d.source.x,
	        dy = d.target.y - d.source.y,
	        dr = radius/linknum;  //linknum is defined above
			sweep = d.linknum % 2;
			
		var len = Math.sqrt(dx * dx + dy * dy);
		if(len > 1.5 * dr) dr = Math.pow(dr, 1.2);
	    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0," + sweep + "," + d.target.x + "," + d.target.y;
	});
	
	
	text.attr("transform", function(d) {
	    return "translate(" + d.x + "," + d.y + ")";
	});
	  
	text_edge.attr("transform", function(d) {
		var linknum = d.linknum / 2;
		if(d.linknum % 2) linknum ++;
		
		var dr = radius/linknum;
		var diff_x = d.source.x - d.target.x;
		var diff_y = d.source.y - d.target.y;
		var len = Math.sqrt(diff_x * diff_x + diff_y * diff_y);

		var mid_x = (d.source.x + d.target.x)/2;
		var mid_y = (d.source.y + d.target.y)/2;
		
		dx = -diff_y;
		dy = diff_x;
		if(d.linknum % 2 == 0) {
			dx = -dx;
			dy = -dy;
		}
		
		if(len > 1.5 * dr) dr = Math.pow(dr, 1.2);
		
		var portion = len/dr * 0.1;
		
		mid_x += dx * portion;
		mid_y += dy * portion;
		
		return "translate(" + mid_x + "," + mid_y + ")";
	});

}


function drawGraph() {
	
	//for(var i=start; i<=end; i++) {
	//	n = {x:200, y:400};
	//	nodes.push(n);
	//}
	
	for(var i=0; i<dataset.length; i++) {
		var s = dataset[i]['start'],
		e = dataset[i]['end'],
		c = dataset[i]['content'];
		p = parsePath(dataset[i]['path']);
		
		if(s != e) links.push({source: s, target: e, type: "suit", content: c, path: p, clicked: false});
	}
	
	//links.push({source: start_node, target: end_node});
	
	handleLinks();
	start_node = nodes[start];
	end_node = nodes[end];
	
	
	addAll();
	//restart();
}	


function loadPage(sel) {
	
	
	
	force.stop();
	
	links = [];
	nodes = [];
	
	
	d3.selectAll("path").remove();
	d3.selectAll("circle").remove();
	d3.selectAll("text").remove();
	
	resetColor();
	
	cached_nodes = [];
	cached_search_path = [];
	history_nodes = [];
	history_links = [];
	history_path = [];

	history_str_length = [];

	path_string_length_tmp = 0;
	path_string_length = 0;
	
	add_node_path = null;
	add_node_edge = null;

	add_path_dragged = false;

	path_clicked = false;
	
	edit_path = [];
	edit_node = null;
	edit_node2 = null;
	edit_circle = null;
	edit_circle2 = null;
	
	max_node_name = 0;
	dataset = [];
	
	edge_not_node = 0;
	selected_edge = 0;
	selected_node = 0;
	
	path = null;
	
	var file_name = "";
	if(sel == 0) file_name = "data/simple.fst";
	else file_name = "data/simple2.fst";
	
	addMarker();
	readData(file_name);
	
//	refresh();
}


function readData(file_name) {
	console.log(file_name);
	d3.csv(file_name, function(data) {
		data.forEach(function(d){
			d['start'] = + d['start'];
			d['end'] = + d['end'];
			
			if(d['start'] > max_node_name) max_node_name = d['start'];
			if(d['end'] > max_node_name) max_node_name = d['end'];
		});
		
		dataset = data;
		start = dataset[0]['start'];
		end = dataset[dataset.length - 1]['start'];
		
		
		drawGraph();
		
	});
}
		




