[README](README.md) | [Chinese Documentation](README_zh-CN.md)

# Pixiu-Fontkit

Pixiu-Fontkit is a tool for converting ttf fonts into woff and woff2 formats for use on the web.

## Installation

Install with npm:

```bash
npm install pixiu-fontkit
```

## Usage

In your project, create a folder named `fonts` and put your ttf font files in it.

Then, run the following command:

```bash
pfk
```

If you only want to include specific characters in the font, you can add these characters as parameters after the command. For example, if you only want to include the English "Hello" and the Chinese "你好", you can run the following command:

```bash
pfk Hello你好
```

This will generate a folder named `output` in the root directory of the project, which contains the converted woff and woff2 font files, the corresponding css file, and an html demo file.

## Example

Assume you have a font file named `myfont.ttf` in your `fonts` directory. After running pfk, you will get the following files:

- output/myfont.woff
- output/myfont.woff2
- output/myfont.css
- output/myfont.html

In the myfont.css file, you will see the following content:

```css
@font-face {
  font-family: "myfont";
  src:
    url("./myfont.woff2") format("woff2"),
    url("./myfont.woff") format("woff");
  font-weight: normal;
  font-style: normal;
}
```

You can directly link this css file to your project to use this font.

In the `myfont.html` file, you will see a demo using this font. If you specified characters in the command line, then this demo will use the characters you specified. Otherwise, it will display the default demo text "Hello, this is a demo! 你好， 这是演示文字".
