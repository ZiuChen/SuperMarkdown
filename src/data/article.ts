const t = new Date().getTime()

export const article = {
  code: `---
theme: juejin
highlight: atom-one-dark
---

<p align="center">
  <img src="./logo.png" width="150px" />
</p>

> 强大的Markdown编辑器

- 由ByteMD强力驱动，功能丰富、性能强劲
- 支持GFM扩展语法、脚注、Gemoji、KaTeX数学公式、Mermaid图表
- 支持通过Frontmatter设置多种主题、代码高亮样式
- 支持多级目录，目录支持无限嵌套
- 支持通过粘贴/拖拽的方式批量上传图片、支持截取屏幕截图
- 支持Markdown文件的批量导入、批量导出
- 支持实时同步预览、自动保存

[插件主页](https://ziuchen.gitee.io/project/Markdown/)

## Markdown基础语法

I just love **bold text**. Italicized text is the _cat's meow_. At the command prompt, type \`nano\`.

1. First item
2. Second item
3. Third item

> Dorothy followed her through many of the beautiful rooms in her castle.

\`\`\`ts
const message = 'Hello, SuperMarkdown!'
console.log(message)
\`\`\`

## GFM 扩展语法

Automatic URL Linking: https://github.com/ZiuChen

~~The world is flat.~~ We now know that the world is round.

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

| Syntax    | Description |
| --------- | ----------- |
| Header    | Title       |
| Paragraph | Text        |

## 脚注

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.
[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    \`{ my code }\`

    Add as many paragraphs as you like.

## Gemoji

Thumbs up: :+1:, thumbs down: :-1:.

Families: :family_man_man_boy_boy:

Long flags: :wales:, :scotland:, :england:.

## Math Equation

Inline math equation: $a+b$

$$
\\displaystyle \\left( \\sum_{k=1}^n a_k b_k \\right)^2 \\leq \\left( \\sum_{k=1}^n a_k^2 \\right) \\left( \\sum_{k=1}^n b_k^2 \\right)
$$

## Mermaid Diagrams

\`\`\`mermaid
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
\`\`\`

## 相关链接

[插件主页](https://ziuchen.gitee.io/project/Markdown/)

[Github](https://github.com/ZiuChen)`,
  createAt: t,
  id: String(t),
  lastSavedAt: t,
  title: '你好，超级Markdown！'
}
