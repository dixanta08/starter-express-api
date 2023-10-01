const PORT = process.env.PORT || 8000
const express = require("express");
const axios = require("axios").default;
const cheerio = require("cheerio");

const app = express();

const newspapers = [
  {
    name: "planetf1",
    address: "https://www.planetf1.com/news",
    base: "",
  },
  {
    name: "express",
    address: "https://www.express.co.uk/sport/f1-autosport",
    base: "https://www.express.co.uk",
  },
  {
    name: "skysports",
    address: "https://www.skysports.com/f1",
    base: "",
  },
  {
    name: "racingnews365",
    address: "https://racingnews365.com/f1-news",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/sport/formula1",
    base: "",
  },
];

const articles = [];

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

app.get("/", (req, res) => {
  res.json("Welcome to home page");
});

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("Red Bull")', html).each(function () {
        if ($(this).children("img").length === 0) {
          const title = $(this).text().replace(/\s+/g, " ").trim();

          const url = $(this).attr("href");

          if (title && title.length > 0) {
            articles.push({
              title,
              url: newspaper.base + url,
              source: newspaper.name,
            });
          }
        }
      });
    })
    .catch((e) => {
      console.error(e);
    });
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;
  const newspaperSource = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].name;
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticle = [];

      $('a:contains("Red Bull")', html).each(function () {
        if ($(this).children("img").length === 0) {
          const title = $(this).text().replace(/\s+/g, " ").trim();

          const url = $(this).attr("href");

          if (title && title.length > 0) {
            specificArticle.push({
              title,
              url: newspaperBase + url,
              source: newspaperSource,
            });
          }
        }
      });
      res.json(specificArticle);
    })
    .catch((e) => {
      console.error(e);
    });
});
