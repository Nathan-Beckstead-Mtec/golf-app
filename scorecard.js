var DEBUG = true;


class scorecard{
    //card;
    #data;
    //this.card
    // strokes;
    
    constructor(id, api_course, tee, players, players_hcp = null){
        //id         - id selector for the parent element of the table.
        //api_course - the object returned from the api
        //tee        - the index into the above object for the selected tee
        //players    - an array of strings of the players

        this.thus = this;
        this.card = document.getElementById(id);
        this.card_id = id;
        if (this.card == undefined){
            console.error("Scorecard element with id " + id + " could not be found");
        }

        this.players = players;
        this.playerCount = players.length;

        let data = [];
        for(let i = 0; i < api_course.holeCount; i++){
            let thishole = api_course.holes[i].teeBoxes[tee];
            let temp = {};
            temp.yards = thishole.yards;
            temp.par = thishole.par;
            temp.hcp = thishole.hcp;
            data[i] = temp;
        }
        this.#data = data;

        this.strokes = Array(this.playerCount);
        //custom fill because linked arrays for rows are bad;
        for (let i = 0; i < this.strokes.length; i++){
            this.strokes[i] = new Array(18).fill(0);
        }
        console.table(this.strokes);

        /*
        anti-regression unit test
        let unit_test = new scorecard("na","",0,["bob","luigi"],[0,0]);
        unit_test.setstroke(0,0,4);
        console.assert(unit_test.strokes[1][0] == 0);
        */

        if (players_hcp == null){
            this.players_hcp = Array(this.playerCount).fill(0);
        }else{
            this.players_hcp = players_hcp;
        }
    }

    generate(){

        let html;
        if (true){ //indentation for thead generation
            html = `<thead>
            <tr id="t-hole">
            <th>Hole</th>
            <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>Out</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
                <th>15</th>
                <th>16</th>
                <th>17</th>
                <th>18</th>
                <th>In</th>
                <th>Total</th>
                <th>HCP</th>
                <th>Net</th>
            </tr>`;
            let html_yard = `<tr id="t-yard">	<th>Yardage</th>`;
            let html_handicap = `<tr id="t-handicap">	<th>Handicap</th>`;
            let html_par = `<tr id="t-par">	<th>Par</th>`;

            let par_total = 0;
            let par_half = 0;
            let yard_total = 0;
            let yard_half = 0;
            
            
            this.#data.forEach((hole, index) => {
                html_yard += `<th>` + hole.yards + `</th>`;
                html_handicap += `<th>` + hole.hcp + `</th>`;
                html_par += `<th>` + hole.par + `</th>`;
                
                par_total  += hole.par;
                par_half   += hole.par;
                yard_total += hole.yards;
                yard_half  += hole.yards;

                if (index == 8){
                    html_yard += `<th>` + yard_half + `</th>`;
                    html_handicap += `<th class="t-null"></th>`;
                    html_par += `<th>` + par_half + `</th>`;
                    par_half = 0;
                    yard_half = 0;
                }
            });
            
            html_yard += `<th>` + yard_half + `</th>`;
            html_handicap += `<th class="t-null"></th>`;
            html_par += `<th>` + par_half + `</th>`;


            html_yard += `<th>` + yard_total + `</th>`;
            html_handicap += `<th class="t-null"></th>`;
            html_par += `<th>` + par_total + `</th>`;
            html_yard     += `<th class="t-null"></th><th class="t-null"></th></tr>`;
            html_handicap += `<th class="t-null"></th><th class="t-null"></th></tr>`;
            html_par      += `<th class="t-null"></th><th class="t-null"></th></tr>`;

            html += html_yard + html_handicap + html_par;
            html += `</thead>`;
        }
        let table = document.createElement("table");
        table.innerHTML = html;
        let tbody = document.createElement("tbody");



        this.players.forEach((player, index) => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td>${player}</td>`;


                for (let i = 1; i <= 23; i++){
                    //magic number 23: 23 = 9 holes in + "in" + 9 holes out + "out" + the 3 total columns
                    let hole = i - (i >= 10? 1 : 0);
                    let td = document.createElement("td");
                    if (i == 10 || i >= 20){
                        //out in total hcp net
                    }else{
                        let put = document.createElement("input");
                        // <input type="tel" oninput="test_scorecard.setstroke(3,1,this.value)" style="font-size:1em;"></input>
                        // <input type="tel" maxlength="2"></input>
                        put.setAttribute("type","tel");
                        put.setAttribute("maxlength","2");
                        put.setAttribute("hole",hole);
                        put.setAttribute("player_index",index);

                        put.addEventListener("input",(event)=>{this.input_handler(event)},{passive: true});

                        td.appendChild(put);
                    }


                    tr.appendChild(td);
                }

            tbody.appendChild(tr);
		});
        table.appendChild(tbody);

        if (true){ //do col group 
            let colgroup = document.createElement("colgroup");
            let element;

            element = document.createElement("col");
            element.setAttribute("span","1");
            element.setAttribute("class","sticky");
            colgroup.appendChild(element);

            element = document.createElement("col");
            element.setAttribute("span","9");
            element.setAttribute("class","normal");
            colgroup.appendChild(element);

            element = document.createElement("col");
            element.setAttribute("span","1");
            element.setAttribute("class","sticky");
            colgroup.appendChild(element);

            element = document.createElement("col");
            element.setAttribute("span","9");
            element.setAttribute("class","normal");
            colgroup.appendChild(element);

            element = document.createElement("col");
            element.setAttribute("span","4");
            element.setAttribute("class","sticky");
            colgroup.appendChild(element);

            table.appendChild(colgroup);
        }


        this.card.appendChild(table);
    }

    input_handler(event){
        let input = event.target;
        let hole = Number.parseInt(input.getAttribute("hole"));
        let player_index = Number.parseInt(input.getAttribute("player_index"));

        this.setstroke(hole,player_index,input.value);
    }

    
    renderHCP(){
        this.players_hcp.forEach((hcp, index) => {
            this.setcellXY(22,index + 4,hcp,false);
        });
    }

    getcellXY(x,y){
        let out = this.card.children[0];
        //        div       table
        
        //0 indexed cordanates
        //bounds
        if (y < 0 || y > this.playerCount + 3){
            console.error("#getcellXY, index (" + x + ","+ y + ") out of bounds in y axis");
            return null;
        };
        if (x < 0 || x >  23){
            console.error("#getcellXY, index (" + x + ","+ y + ") out of bounds in x axis");
            return null;
        };

        if (y > 3){
            out = out.children[1];
            //    tbody
            y -= 4;
        } else{
            out = out.children[0];
            //    thead
        }
        // console.log("(" + x + ","+ y + ")");
        // console.log(out);
        out = out.children[y].children[x];
        //    tbody     tr          th/td
        return out;
    }
    getrowY(y){
        let out = this.card.children[0];
        //        div       table
        
        //0 indexed
        if (y < 0 || y > this.playerCount + 3){
            console.error("#getrowY, index (" + y + ") out of bounds in y axis");
            return null;
        };
        if (y > 3){
            out = out.children[1];
            //    tbody
            y -= 4;
        } else{
            out = out.children[0];
            //    thead
        }
        out = out.children[y];
        //        tr
        return out;
    }
    getrowPlayer(y){
        let out = this.card.children[0].children[1];
        //        div       table       tbody
        
        //0 indexed
        if (y < 0 || y > this.playerCount){
            console.error("#getrowPlayer, index (" + y + ") out of bounds in y axis");
            return null;
        };
        out = out.children[y+4];
        //        tr
        return out;
    }
    getcell(hole, playerindex){
        //hole is 1-indexed
        //player index id 0-indexed


        if (playerindex < 0 || playerindex > this.playerCount){
            console.error("#getcell, index (" + hole + ","+ playerindex + ") out of bounds in playerIndex axis");
            return null;
        };
        if (hole < 0 || hole >  18){
            console.error("#getcell, index (" + hole + ","+ playerindex + ") out of bounds in hole axis");
            return null;
        };

        hole += hole > 9? 1 : 0;
        playerindex += 4;
        return this.getcellXY(hole,playerindex);
    }

    setcellXY(x,y,value, hiddenZero = true){
        if (value == '0' && hiddenZero){
            value = "";
        }
        this.getcellXY(x,y).textContent = value;
    }

    setcell(hole, playerindex,value, hiddenZero = true){
        if (value == '0' && hiddenZero){
            value = "";
        }
        this.getcell(hole, playerindex).textContent = value;
    }

    setstroke(hole,playerIndex,value){
        value = Number.parseInt(value);
        if (isNaN(value)){
            value = 0;
        }


        console.debug("(" + hole + "," + playerIndex + ")");
        this.strokes[playerIndex][hole - 1] = value;

        console.group();
        let sum_this_list;

        sum_this_list = Array.from(this.strokes[playerIndex]).splice(0,9);
        let tout  = sum(sum_this_list);

        sum_this_list = Array.from(this.strokes[playerIndex]).splice(9);
        let tin   = sum(sum_this_list);

        sum_this_list = Array.from(this.strokes[playerIndex]);
        let total = sum(sum_this_list);

        let net   = total - this.players_hcp[playerIndex];
        console.groupEnd();

        // this.setcell(hole,playerIndex,value);
        this.setcellXY(10,playerIndex+4,tout);
        this.setcellXY(20,playerIndex+4,tin);
        this.setcellXY(21,playerIndex+4,total);
        this.setcellXY(23,playerIndex+4,net);




        function sum(arr){
            console.groupCollapsed();
            console.debug("Summing: ");
            console.table(arr);
            let out = arr.reduce(
                (prev, curr) => {
                    return prev + curr;
                },
                0
            );
            console.debug("got: " + out);
            console.groupEnd();
            return out;
        }
    }
    
}

