#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const ttf2woff = require("ttf2woff");
const ttf2woff2 = require("ttf2woff2");

// 指定的目录
let dir = "./fonts";

// 读取目录中的所有文件
let files = fs.readdirSync(dir);

// 筛选出ttf文件
let ttfFiles = files.filter((file) => path.extname(file) === ".ttf");

console.log(`loading...`);
// 处理每个ttf文件
ttfFiles.forEach((file) => {
  let readStream = fs.createReadStream(path.join(dir, file));
  let data = [];

  readStream.on("data", (chunk) => {
    data.push(chunk);
  });

  readStream.on("end", async () => {
    let ttf = Buffer.concat(data);
    let woff = ttf2woff(ttf);
    let woff2 = ttf2woff2(ttf);

    // 创建输出目录
    let outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // 写入woff和woff2文件
    await Promise.all([
      fs.promises.writeFile(
        path.join(outputDir, file.replace(".ttf", ".woff")),
        woff
      ),
      fs.promises.writeFile(
        path.join(outputDir, file.replace(".ttf", ".woff2")),
        woff2
      ),
    ]);

    // 创建CSS文件
    let cssContent = `
    @font-face {
        font-family: '${file.replace(".ttf", "")}';
        src: url('./${file.replace(".ttf", ".woff2")}') format('woff2'),
             url('./${file.replace(".ttf", ".woff")}') format('woff');
        font-weight: normal;
        font-style: normal;
    }`;

    await fs.promises.writeFile(
      path.join(outputDir, file.replace(".ttf", ".css")),
      cssContent
    );

    // 创建HTML demo文件
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="./${file.replace(".ttf", ".css")}">
    </head>
    <body>
        <p style="font-family: '${file.replace(
          ".ttf",
          ""
        )}';">Hello, this is a demo!</p>
    </body>
    </html>
    `;

    await fs.promises.writeFile(
      path.join(outputDir, file.replace(".ttf", ".html")),
      htmlContent
    );
  });
});
