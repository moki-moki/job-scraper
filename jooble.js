import cheerio from "cheerio";
import fetch from "node-fetch";
import fs from "fs";

const streamWrite = fs.createWriteStream("infoStud.csv");
streamWrite.write(`Job Name , Company Name , Job Date , Job Tech`);

const URL =
  "https://poslovi.infostud.com/oglasi-za-posao-frontend-developer/nis?category%5B0%5D=5&dist=30&scope=srpoz";

const scrape = async () => {
  const jobs = [];
  let data = await fetch(`${URL}`).then((res) => res.text());
  let $ = await cheerio.load(data);
  await $(".uk-grid-small").each((i, el) => {
    let jobName = $(el).find("h2").text().replace(/\s\s+/g, "");
    let extension = "https://poslovi.infostud.com";
    let jobLink = extension + $(el).find("a").attr("href");
    let companyName = $(el)
      .find(".uk-h4.uk-margin-remove")
      .text()
      .replace(/\s\s+/g, "");
    let jobDate = $(el)
      .find(".uk-margin-remove.uk-text-bold")
      .text()
      .replace(/\s\s+/g, "");
    let tags = $(el).find(".uk-margin-small-top").text().replace(/\s\s+/g, " ");
    streamWrite.write(
      `${jobName}, ${companyName}, ${tags} \n, ${jobLink} \n, ${jobDate} \n`
    );
  });
  console.log("done scraping");
};

scrape();
