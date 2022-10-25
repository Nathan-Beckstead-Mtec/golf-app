
var courses = null;

var cache = {};
load_cache();
// getCourses();
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

    }
};

function courseChanged(){
    input = document.getElementById("course");
    if (input.value == ""){
        return;
    }
    
    courseId = input.value;
    getCourse(courseId, writeCourse);
}


function writeCourse(Json){
    console.log("writeCourse got this input");
    console.log(Json);


	document.getElementById("info-name").textContent = Json.name;
	document.getElementById("info-address").textContent = Json.addr1 + ((Json.addr2 == null)? "": " ") + Json.addr2 + ", " + Json.city + " " + Json.stateOrProvince;
	document.getElementById("info-phone").textContent   = Json.phone;
	document.getElementById("info-phone").setAttribute("href", "tel:" + Json.phone);
	document.getElementById("info-website").textContent = "website";
	document.getElementById("info-website").setAttribute("href", Json.website);



    if (Json.holeCount != 18){
        console.error("expected a golf course with 18 holes");
    }

    tees = [];
    Json.holes[0].teeBoxes.forEach((data, index) => {
        tees.push({id: data.teeTypeId, name: data.teeType, col: data.teeHexColor, index: index});
    });


    if(true){ //tee-box html genetation from above tee variable
        let tee_html = document.createElement("div");
        // tee_html.outerHTML = `<div class="tee_div" id="tee_div"><p>Tee-box:</p></div>`;
        tee_html.setAttribute("class","tee_div");
        tee_html.id = "tee_div";

        let tee_caption = document.createElement("h6");
        tee_caption.textContent = "Tee-box:";
        tee_html.appendChild(tee_caption);
        let css = "";
        tees.forEach((elem) => {
            let input_tag = document.createElement("input");
            input_tag.setAttribute("type","radio");
            input_tag.setAttribute("name","tee");
            input_tag.setAttribute("value", elem.index);
            // input_tag.outerHTML = `<input type="radio" name="Tee-box">`;
            let id = "tee_" + elem.id
            input_tag.id = id;

            let label_tag = document.createElement("label");
            // label_tag.outerHTML = `<label for="${id}" color="${elelem.col}">${elem.name}</label>`;
            label_tag.setAttribute("for",id);
            label_tag.setAttribute("color",elem.col);
            label_tag.textContent = elem.name;

            css += 
`label[for="${id}"]::before {
    background-color: ${elem.col ?? "transparent"};
}\n`;

            tee_html.appendChild(input_tag);
            tee_html.appendChild(label_tag);
        });
        let css_html = document.createElement("style");
        css_html.textContent = css;
        tee_html.appendChild(css_html);

        tee_html.children[1].setAttribute["checked","checked"];
        document.getElementById("tee_div").replaceWith(tee_html);
    }


    
}

function getCourseFromAPI(course, callback){



    var options ={
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        json: true
    };

    console.debug(options);

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
        console.debug(data);
        cache[course] = data;
        // writeCourse(data);
        callback(data);
    })
    .catch((error) => {
      console.error(`Could not get Couses: ${error}`);
    });
};



function getCourse(courseId, callback){
    if (cache[courseId] == undefined){
        //create spinners
        return getCourseFromAPI(courseId,callback);
        //delete spinners
    }else{
        callback(cache[courseId]);
    }
}


function save_cache(){
    sessionStorage.setItem("cache", JSON.stringify(cache));
}
function load_cache(){
    cache = sessionStorage.getItem("cache") ?? {};
}