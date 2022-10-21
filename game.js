// import { scorecard } from "./scorecard";
var test_data;
var test_scorecard;

load();

function resume_load(){

	console.log("loaded ... running");
	let players = ["Luigi","Bob Ross", "Joenathan Ligma"];
	test_scorecard = new scorecard("card",test_data, 0, players);
	test_scorecard.generate();
	window.setTimeout(wait_a_bit,200);
}

function wait_a_bit(){
	// test_scorecard.getcell(2,1).innerHTML = `<input type="tel" oninput="test_scorecard.setstroke(3,1,this.value)" style="font-size:1em;">`;
}


function save() {
	localStorage.setItem('test_data', JSON.stringify(test_data));
	console.log("saved");
}

function load() {
	let temp_data = localStorage.getItem("test_data");
	if (temp_data == null) {
		console.log("couldn't accsess or find saved list");
		FetchCourse("11819");
	} else {
		test_data = JSON.parse(temp_data);
		resume_load();
	}
}






function FetchCourse(course){



    var options ={
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        json: true
    };

    console.log(options);

    const responsePromise = fetch("https://golf-courses-api.herokuapp.com/courses/" + course,options);

    responsePromise
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
		data = data.data;
		console.log(data);
		test_data = data;
		save();
		resume_load();
    })
    .catch((error) => {
      console.error(`Could not get Couses: ${error}`);
    });
};



