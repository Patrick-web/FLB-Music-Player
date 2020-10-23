import Parser from "rss-parser";
const parser = new Parser();

function fetchRssData(rssLink){
    let feed = await parser.parseURL("https://feeds.simplecast.com/dLRotFGk");
    console.log(feed.title)
}

getRSS(websiteURL){
       
}