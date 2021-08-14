// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
const { table } = require("console");
const { fstat } = require("fs");
function processSinglematch(url) {

    request(url, cb);
}

function cb(error, response, html) {
    if (error) {
        console.log(error); 
    } else if (response.statusCode == 404) {
        console.log("Page Not Found")
    } else {
        // console.log(html);  
        // console.log("html:",);
        dataExtracter(html);
    }
}
function dataExtracter(html) {

    let searchTool = cheerio.load(html);
    let otherInfoElem = searchTool(".event .match-info.match-info-MATCH .description");
    let otherInfo = otherInfoElem.text().split(",");
    let venue = otherInfo[1].trim();
    let date = otherInfo[2].trim();

    let resultInfo = searchTool(".event .match-info.match-info-MATCH .status-text");
    let result = resultInfo.text().trim();


    let bothInningArr = searchTool(".Collapsible")
    let innings = "";
    for (let i = 0; i < bothInningArr.length; i++) {

        // innings = searchTool(bothInningArr[i]).html();
        // fs.writeFileSync(`innings${i+1}.html`, innings);
        let teamNameElem = searchTool(bothInningArr[i]).find("h5");
        let myTeamName = teamNameElem.text();
        myTeamName = myTeamName.split("INNINGS")[0];
        myTeamName = myTeamName.trim();
        // console.log(teamName);

        let opponentTeamName = i == 0 ? searchTool(bothInningArr[1]).text() : searchTool(bothInningArr[0]).text();
        opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();

        let batsManTableBodyAllRows = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        //console.log(batsManTableBodyAllRows.length);
        for (let j = 0; j < batsManTableBodyAllRows.length; j++) {
            let noOfTds = searchTool(batsManTableBodyAllRows[j]).find("td");
            if (noOfTds.length == 8) {
                let playerName = searchTool(noOfTds[0]).text().trim();
                let runs = searchTool(noOfTds[2]).text().trim();
                let balls = searchTool(noOfTds[3]).text().trim();
                let fours = searchTool(noOfTds[5]).text().trim();
                let sixes = searchTool(noOfTds[6]).text().trim();
                let sr = searchTool(noOfTds[7]).text().trim();
                // console.log(myTeamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, sixes, sr);
                teamFolder(myTeamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, sixes, sr);
            }
        }
        
    }
}

function teamFolder(myTeamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, sixes, sr){
    let teamFolderPath = path.join(__dirname,"IPL",myTeamName);
    dirCreater(teamFolderPath);
    let playerNamePath = path.join(teamFolderPath, playerName+".json");
    let contentArr = [];
    let matchObject = {
        myTeamName, playerName, venue, date, opponentTeamName, result, runs, balls, fours, sixes, sr
    }
    contentArr.push(matchObject);

    if(fs.existsSync(playerNamePath)){
        let data = fs.readFileSync(playerNamePath);
        contentArr = JSON.parse(data);
    }

    contentArr.push(matchObject);
    fs.writeFileSync(playerNamePath, JSON.stringify(contentArr));

}

function dirCreater(folderPath){
    if(fs.existsSync(folderPath)==false){
        fs.mkdirSync(folderPath);
    }
}

module.exports = {
    processSinglematch
}