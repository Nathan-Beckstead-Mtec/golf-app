// import { scorecard } from "./scorecard";
var DEBUG = true;
var test_data;
var test_scorecard;

/*
var params = new URLSearchParams(window.location.search),
      first = params.get("first"),
      second = JSON.parse(params.get("second"));

*/

var scores;
start();
function start(){
	// constructor(id, api_course, tee, players, players_hcp = null)
	var params = new URLSearchParams(window.location.search);
	let course = params.get("course");
	let tee = params.get("tee");
	let players = [];
	let hcp = [];
	
	let i = 1;
	while(i<5){
		let p = params.get("p" + i);
		if (!p){
			break;
		}
		players.push(p);
		hcp.push(params.get("hp" + i) ?? 0);
		i++;
	}
	if (DEBUG){
		console.table({players:players,hcp:hcp});
	}


	getCourse(course, data => {
		scores = new scorecard("card", data, tee, players, hcp);
		scores.generate();
		scores.renderHCP();
	});
}


