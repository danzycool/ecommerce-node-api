const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = (temp, product) => {
  let info = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  info = info.replace(/{%IMAGE%}/g, product.image);
  info = info.replace(/{%FROM%}/g, product.from);
  info = info.replace(/{%ID%}/g, product.id);
  info = info.replace(/{%DESCRIPTION%}/g, product.description);
  info = info.replace(/{%NUTRITION%}/g, product.nutrients);
  info = info.replace(/{%PRICE%}/g, product.price);
  info = info.replace(/{%QUANTITY%}/g, product.quantity);

  if (!product.organic) {
    info = info.replace(/{%ORGANIC%}/g, "Not Organic");
  } else {
    info = info.replace(/{%ORGANIC%}/g, "Organic");
  }
  return info;
};

const indexTemp = fs.readFileSync(`${__dirname}/template/index.html`, "utf-8");
const cardTemp = fs.readFileSync(
  `${__dirname}/template/tempCard.html`,
  "utf-8"
);
const pageTemp = fs.readFileSync(`${__dirname}/template/page.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const port = 8000;
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardhtml = dataObj
      .map((el) => {
        return replaceTemplate(cardTemp, el);
      })
      .join("");

    const outPut = indexTemp.replace("{%DESCRIPTION_CARD%}", cardhtml);
    res.end(outPut);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const product = dataObj[query.id];
    const pageHtml = replaceTemplate(pageTemp, product);
    const outPutPage = indexTemp.replace("{%DESCRIPTION_CARD%}", pageHtml);
    res.end(outPutPage);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`App running on port ${port}`);
});
