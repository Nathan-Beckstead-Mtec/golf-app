


async function getCourses(){



    var options ={
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        json: true
    };

    console.log(options);

    const response = await fetch("https://golf-courses-api.herokuapp.com/courses",options);

    response.json().then(data => {
        console.log(data);
    });



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