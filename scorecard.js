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

        this.strokes = Array(this.playerCount).fill(Array(18).fill(0));

        if (players_hcp == null){
            this.players_hcp = Array(this.playerCount).fill(0);
        }else{
            this.players_hcp = players_hcp;
        }
    }

    generate(){
        let html = `<table><thead>
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
		html += `</thead><tbody>`;

        let temphtml;
		this.players.forEach((player, index) => {
            temphtml = `<tr id="table_${index}"><td>${player}</td>`;
                // for (let i = 0; i < 23; i++){
                //     //magic number 23: 23 = 9 holes in + "in" + 9 holes out + "out" + the 3 total columns
                //     let hole = i - (i >= 9? 1 : 0);
                //     let cellid
                //     if (i == 9){
                //         cellid = this.id + "_" + index.toString() + "_"
                //     }else{
                //         cellid = this.id + "_" + index.toString() + "_" + hole.toString();
                //     }


                //     temphtml += `<td id="${cellid}"></td>`;
                // }

                
                //magic number 23: 23 = 9 holes in + "in" + 9 holes out + "out" + the 3 total columns
                temphtml += `<td></td>`.repeat(23) ;
                
            temphtml += `</tr>`; 
            html += temphtml;
		});
        
        html += `</tbody></table>`;

        console.log(html);
		this.card.innerHTML = html;
        this.renderHCP();
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
        console.log("(" + x + ","+ y + ")");
        console.log(out);
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
        this.strokes[playerIndex][hole] = value;
        
        let tout  = sum(Array.from(this.strokes[playerIndex]).splice(0,9));
        let tin   = sum(Array.from(this.strokes[playerIndex]).splice(9));
        let total = sum(Array.from(this.strokes[playerIndex]));
        let net   = total - this.players_hcp[playerIndex];

        this.setcell(hole,playerIndex,value);
        this.setcellXY(10,playerIndex+4,tout);
        this.setcellXY(20,playerIndex+4,tin);
        this.setcellXY(21,playerIndex+4,total);
        this.setcellXY(23,playerIndex+4,net);




        function sum(arr){
            return arr.reduce(
                (prev, curr) => {
                    return prev + curr;
                },
                0
            );
        }
    }
    
}

