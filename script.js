
var courses = null;
getCourses();
var cache = {};
var courseId = null;
var tees;

//[
//	{
//		"id": 1,
//		"name": "pro",
//		"col": "#443C30"
//	},
//	{
//		"id": 2,
//		"name": "champion",
//		"col": "#6e869e"
//	},
//	{
//		"id": 3,
//		"name": "men",
//		"col": "#ffffff"
//	},
//	{
//		"id": 4,
//		"name": "women",
//		"col": "#ff0000"
//	}
//]



function getCourses(){



    var options ={
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        json: true
    };

    console.log(options);

    const responsePromise = fetch("https://golf-courses-api.herokuapp.com/courses",options);


    responsePromise
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      write(data);
    })
    .catch((error) => {
      console.error(`Could not get Couses: ${error}`);
    });

    function write(data){
        courses = data.courses;
        /*
        <select name="cars" id="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="mercedes">Mercedes</option>
            <option value="audi">Audi</option>
	    </select>
        */
        HTML = `<option value="" selected disabled>Select Golf Course</option>`;
        courses.forEach(course => {
            HTML += `<option value="${course.id}">${course.name}</option>\n`;
        });
        console.error("unsanitized input go brrrrrr");
        input = document.getElementById("course");
        input.innerHTML = HTML;
        input.addEventListener("change",courseChanged);

    }
};

function courseChanged(){
    input = document.getElementById("course");
    if (input.value == ""){
        return;
    }
    
    courseId = input.value;
    if (cache[courseId] == undefined){
        //create spinners
        getCourse(courseId);
        //delete spinners
    }else{
        writeCourse(cache[courseId]);
    }
}


function writeCourse(Json){
    console.log("writeCourse got this input");
    console.log(Json);
    let HTML =
    `<h1 id="info-name">${Json.name}</h1>
		<p id="info-address">${Json.addr1}${Json.addr2 == null? "": " " + Json.addr2}, ${Json.city} ${Json.stateOrProvince}</p>
		<div class="contact">
		<a id="info-phone" href="tel:${Json.phone}">${Json.phone}</a>
		<a id="info-website" href="${Json.website}" target="_blank">website</a>
	</div>`;
    document.getElementById("info").innerHTML= HTML;


    if (Json.holeCount != 18){
        console.error("expected a golf course with 18 holes");
    }

    tees = [];
    Json.holes[0].teeBoxes.forEach(data => {
        tees.push({id: data.teeTypeId, name: data.teeType, col: data.teeHexColor});
    });

}

function getCourse(course){



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
      cache[course] = data;
      writeCourse(data);
    })
    .catch((error) => {
      console.error(`Could not get Couses: ${error}`);
    });
};