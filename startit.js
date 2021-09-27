import puppeteer from "puppeteer";
import fs from "fs/promises";

const URL = "https://startit.rs/poslovi/";

const scrapeStartIt = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: "networkidle2" });
  //Selects a job and checks boxes
  await page.click("#button-vrsteposlova");
  await page.click("#vrsteposlova > label:nth-child(2)");
  await page.click("#frontend");
  await page.click("#js");
  await page.click("#backend");
  //select location
  await page.click("#button-lokacija");
  await page.click("#lokacija > label:nth-child(11)");

  await page.waitForTimeout(5000);

  let jobs = await page.evaluate(() => {
    let individualJob = [];

    let selectEl = document.querySelectorAll(
      "div.wrapper-new-mini-oglas > h1 > a"
    );

    selectEl.forEach((i) => {
      individualJob.push(i.innerHTML.trim());
      individualJob.push(i.getAttribute("href"));
    });

    return {
      individualJob,
    };
  });

  const jobsObj = {
    job: [jobs.individualJob],
  };

  fs.writeFile("startIt.txt", JSON.stringify(jobsObj.job, null, 2), (err) => {
    if (err) console.log(err);
  });

  await browser.close();
};

scrapeStartIt();
