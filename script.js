
var courses = null;
getCourses();



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
        console.log("unsanitized input go brrrrrr");
        document.getElementById("course").innerHTML = HTML;
    }
};



async function getCourse(hole){



    var options ={
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        json: true
    };

    console.log(options);

    const response = await fetch("https://golf-courses-api.herokuapp.com/courses/" + hole,options);

    response.json().then(data => {
        console.log(data);
    });



};