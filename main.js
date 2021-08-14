let link = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj = require("./scorecard");
let fs = require("fs");
let path = require("path");

let iplFolderPath = path.join(__dirname, "IPL");
dirCreater(iplFolderPath);
// console.log(__dirname);
request(link, cb);

function cb(error, response, html){
    if(error){
        console.log(error);// print the error if one occured
    }else if(response.statusCode == 404){
        console.log("Page Not Found")
    }else{
        // console.log(html); // Print the HTML for the request made
        getAllResult(html);
    }
}
function getAllResult(html){
    let searchTool = cheerio.load(html);
    let allResult = searchTool('a[data-hover="View All Results"]');
    let allResultLink = allResult.attr("href");
    let allResultUrl = `https://www.espncricinfo.com${allResultLink}`;
    console.log(allResultUrl);
    request(allResultUrl, allResultCb);
}
function allResultCb(error, response, html){
    if(error){
        console.log(error);// print the error if one occured
    }else if(response.statusCode == 404){
        console.log("Page Not Found")
    }else{
        // console.log(html); // Print the HTML for the request made
        getAllScorecard(html);
    }
}

function getAllScorecard(html){
    let searchTool = cheerio.load(html);
    let linkArr = searchTool("a[data-hover='Scorecard']");
    for(let i=0; i<linkArr.length; i++){
        let scorecardUrl = searchTool(linkArr[i]).attr("href");
        let fullScorecardUrl = `https://www.espncricinfo.com${scorecardUrl}`;
        // console.log(fullScorecardUrl);
        scoreCardObj.processSinglematch(fullScorecardUrl);
        
    }
    
}

function dirCreater(folderPath){
    if(fs.existsSync(folderPath) == false){
        fs.mkdirSync(folderPath);
    }
}