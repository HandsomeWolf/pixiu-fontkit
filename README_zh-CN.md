[README](README.md) | [中文文档](README_zh-CN.md)

# Pixiu-Fontkit

Pixiu-Fontkit 是一个用于将 ttf 字体转换为 web 上使用的 woff 和 woff2 格式的工具。

## 安装

使用 npm 安装：

```bash
npm install -g pixiu-fontkit
```

## 使用

在你的项目中，创建一个名为 `fonts` 的文件夹，并将你的 ttf 字体文件放入其中。

然后，运行以下命令：

```bash
pfk
```

如果你只想在字体中包含特定的文字，你可以在命令后面添加这些文字作为参数。例如，如果你只想包含英文的 "Hello" 和中文的 "你好"，你可以运行以下命令：

```bash
pfk Hello你好
```

这将会在项目的根目录下生成一个名为 `output` 的文件夹，其中包含转换后的 woff 和 woff2 字体文件，以及对应的 css 文件和一个 html demo 文件。

## 示例

假设你的 `fonts` 目录中有一个名为 `myfont.ttf` 的字体文件，运行 pfk 后，你将会得到以下文件：

- output/myfont.woff
- output/myfont.woff2
- output/myfont.css
- output/myfont.html

在 myfont.css 文件中，你会看到如下内容：

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

你可以直接将此 css 文件链接到你的项目中，以使用这个字体。

在 `myfont.html` 文件中，你会看到一个使用了这个字体的示例。如果你在命令行中指定了文字，那么这个示例将会使用你指定的文字。否则，它将会显示默认的示例文字 "Hello, this is a demo! 你好， 这是演示文字"。
