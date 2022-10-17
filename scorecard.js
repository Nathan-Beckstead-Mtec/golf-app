
class scorecard{
    #card;
    #data;
    
    constructor(id, api_course, tee, players){
        //id         - id selector for the parent element of the table.
        //api_course - the object returned from the api
        //tee        - the index into the above object for the selected tee
        //players    - an array of strings of the players


        this.card = document.getElementById(id);
        this.players = players;

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

		this.players.forEach((player, index) => {
			html += `<tr id="table_${index}"><td>${player}</td>` + `<td></td>`.repeat(23) + `</tr>`; //magic number 23: 23 = 9 holes in + "in" + 9 holes out + "out" + the 3 total columns
		});

        html += `</tbody></table>`;

        console.log(html);
		this.card.innerHTML = html;
    }


}

