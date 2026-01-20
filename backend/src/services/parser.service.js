import mammoth from "mammoth";

export async function parseFile(file) {
  let text = "";

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    text = result.value;
  } else {
    text = file.buffer.toString("utf-8");
  }

  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) throw new Error("Empty file");

  let imageUrl = null;
  let index = 0;

  if (lines[0].startsWith("![") || lines[0].startsWith("http")) {
    imageUrl = lines[0];
    index = 1;
  }

  if (!lines[index]) throw new Error("Missing title");

  return {
    title: lines[index],
    content: lines.slice(index + 1).join(" "),
    imageUrl
  };
}
