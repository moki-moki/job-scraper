import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";

const writeStream = fs.createWriteStream("helloworld.csv");

writeStream.write(`Job, Company Name, \n`);

const URL =
  "https://www.helloworld.rs/oglasi-za-posao-frontend-developer/nis?tag=21%2C316&cat=281";

const getData = async () => {
  const jobs = [];
  const data = await fetch(`${URL}`).then((res) => res.text());
  const $ = await cheerio.load(data);
  await $(".uk-grid-small").each((i, el) => {
    const jobName = $(el)
      .find(".uk-margin-small-bottom")
      .text()
      .replace(/\s\s+/g, "");
    const companyName = $(el)
      .find(".company_name_with_link")
      .text()
      .replace(/\s\s+/g, " ");
    const extension = "https://www.helloworld.rs";
    const link = extension + $(el).find(".job-link").attr("href");
    const tags = $(el).find(".preview").text().replace(/\s\s+/g, " ");

    const job = {
      jobTitle: jobName,
      companyName,
      tags,
      jobLink: link,
    };
    jobs.push(job);

    //write to csv
    writeStream.write(`${jobName}, ${companyName} \n, ${tags} \n, ${link} \n`);
  });
  console.log("done scraping");
  return {
    jobs,
  };
};

getData();
