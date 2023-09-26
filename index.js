#!/usr/bin/env node
/* eslint-disable unicorn/prefer-module */

const fs = require("node:fs");
const path = require("node:path");
const ttf2woff = require("ttf2woff");
const ttf2woff2 = require("ttf2woff2");
const opentype = require("opentype.js");

// 获取命令行参数
const text = process.argv[2];

// 指定的目录
const directory = "./fonts";

// 读取目录中的所有文件
const files = fs.readdirSync(directory);

// 筛选出ttf文件
const ttfFiles = files.filter((file) => path.extname(file) === ".ttf");

console.log(`loading...`);
// 处理每个ttf文件
for (const file of ttfFiles) {
  const readStream = fs.createReadStream(path.join(directory, file));
  const data = [];

  readStream.on("data", (chunk) => {
    data.push(chunk);
  });

  readStream.on("end", async () => {
    let ttf = Buffer.concat(data);

    const font = opentype.loadSync(path.join(directory, file));
    // 如果指定了文字，创建一个只包含这些文字的字体
    if (text) {
      const glyphs = [...text].map((char) => {
        const glyph = font.charToGlyph(char);
        return glyph;
      });

      glyphs.unshift(font.glyphs.get(0)); // 添加.notdef（undefined character）字形

      const newFont = new opentype.Font({
        familyName: "NewFont",
        styleName: "Medium",
        unitsPerEm: font.unitsPerEm,
        ascender: font.ascender,
        descender: font.descender,
        glyphs,
      });

      ttf = Buffer.from(newFont.toArrayBuffer());
    }

    const woff = ttf2woff(ttf);
    const woff2 = ttf2woff2(ttf);

    // 创建输出目录
    const outputDirectory = "output";
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory);
    }

    // 写入woff和woff2文件
    await Promise.all([
      fs.promises.writeFile(
        path.join(outputDirectory, file.replace(".ttf", ".woff")),
        woff,
      ),
      fs.promises.writeFile(
        path.join(outputDirectory, file.replace(".ttf", ".woff2")),
        woff2,
      ),
    ]);

    // 创建CSS文件
    const cssContent = `
@font-face {
    font-family: '${file.replace(".ttf", "")}';
    src: url('./${file.replace(
      ".ttf",
      ".woff2",
    )}?v=${Date.now()}') format('woff2'),
         url('./${file.replace(
           ".ttf",
           ".woff",
         )}?v=${Date.now()}') format('woff');
    font-weight: normal;
    font-style: normal;
}`;

    await fs.promises.writeFile(
      path.join(outputDirectory, file.replace(".ttf", ".css")),
      cssContent,
    );

    // 创建HTML demo文件
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="./${file.replace(
      ".ttf",
      ".css",
    )}?v=${Date.now()}">
</head>
<body>
    <p style="font-family: '${file.replace(".ttf", "")}';">${
      text === undefined ? "Hello, this is a demo! 你好， 这是演示文字" : text
    }</p>
`;

    await fs.promises
      .writeFile(
        path.join(outputDirectory, file.replace(".ttf", ".html")),
        htmlContent,
      )
      .then(() => {
        console.log("Completed successfully!");
      });
  });
}
