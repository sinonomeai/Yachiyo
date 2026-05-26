/**
 * 将 Markdown 文档切分成适合向量化的文本块
 *
 * 切片策略：
 * 1. 优先按标题（# ## ###）切分，保持语义完整
 * 2. 长段落进一步按句子切分
 * 3. 相邻块之间保留重叠内容，避免语义断层
 *
 * @param content - Markdown 原始文本
 * @param maxChunkSize - 单个切片最大字符数，默认 800
 * @param overlap - 切片间重叠字符数，默认 100
 * @returns 切片后的文本数组
 */
export function chunkMarkdown(content: string, maxChunkSize = 800, overlap = 100): string[] {
  if (!content.trim()) return [];

  // 第一步：按 Markdown 标题切分，保留文档结构
  const sections = splitByHeadings(content);

  // 第二步：对过长的部分进一步切分
  const chunks: string[] = [];
  for (const section of sections) {
    if (section.length <= maxChunkSize) {
      if (section.trim()) chunks.push(section.trim());
    } else {
      chunks.push(...splitLongSection(section, maxChunkSize, overlap));
    }
  }

  return chunks;
}

/**
 * 按 Markdown 标题（#、##、### 等）切分文档
 *
 * @param text - 原始文本
 * @returns 按标题分割后的段落数组
 */
function splitByHeadings(text: string): string[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const sections: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index).trim();
      if (before) sections.push(before);
    }
    lastIndex = match.index;
  }

  // 处理最后一个标题之后的内容
  const remainder = text.slice(lastIndex).trim();
  if (remainder) sections.push(remainder);

  return sections.length > 0 ? sections : [text];
}

/**
 * 将过长的段落按自然段进一步切分
 *
 * @param text - 过长的文本
 * @param maxSize - 单块最大字符数
 * @param overlap - 重叠字符数
 * @returns 切分后的文本数组
 */
function splitLongSection(text: string, maxSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  const paragraphs = text.split(/\n{2,}/);
  let current = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // 单个段落过长，按句子切分
    if (trimmed.length > maxSize) {
      if (current) {
        chunks.push(current.trim());
        current = "";
      }
      chunks.push(...splitLongParagraph(trimmed, maxSize, overlap));
      continue;
    }

    if (current && current.length + trimmed.length + 2 > maxSize) {
      chunks.push(current.trim());
      // 保留上一个块末尾的内容作为重叠，保证语义连续
      const overlapText = current.slice(-overlap);
      current = overlapText + "\n\n" + trimmed;
    } else {
      current = current ? current + "\n\n" + trimmed : trimmed;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * 将过长的段落按句子切分（句号、感叹号、问号等）
 *
 * @param text - 过长的段落
 * @param maxSize - 单块最大字符数
 * @param overlap - 重叠字符数
 * @returns 切分后的文本数组
 */
function splitLongParagraph(text: string, maxSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  // 按中英文句号、感叹号、问号、分号切分
  const sentences = text.split(/(?<=[。！？.!?;；])\s*/);
  let current = "";

  for (const sentence of sentences) {
    if (!sentence.trim()) continue;

    if (current && current.length + sentence.length > maxSize) {
      chunks.push(current.trim());
      // 保留上一个句子末尾作为重叠
      const overlapText = current.slice(-overlap);
      current = overlapText + sentence;
    } else {
      current = current ? current + sentence : sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
