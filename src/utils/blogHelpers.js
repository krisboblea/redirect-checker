export const WORDS_PER_MINUTE = 200;

export const getWordCountFromContent = (content) => {
  if (!Array.isArray(content)) return 0;

  return content.reduce((count, block) => {
    if (block?._type === "block" && Array.isArray(block.children)) {
      const text = block.children.map((child) => child?.text || "").join(" ");
      const words = text.trim().split(/\s+/).filter(Boolean);
      return count + words.length;
    }
    return count;
  }, 0);
};

export const calculateReadTimeMinutes = (content) => {
  const wordCount = getWordCountFromContent(content);
  if (!wordCount) return 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

export const formatPostDate = (dateString, locale = "en-US", format = "short") => {
  const options = format === "short"
    ? { year: "numeric", month: "short", day: "numeric" }
    : { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(locale, options);
};

export const normalizeTag = (tag) => {
  // For tags with non-ASCII characters (like Chinese), just encode them
  // For English tags, convert to lowercase and replace spaces with dashes
  const trimmed = tag.trim();

  // Check if tag contains non-ASCII characters
  if (/[^\x00-\x7F]/.test(trimmed)) {
    // For non-ASCII (Chinese, Japanese, etc.), just encode it
    return encodeURIComponent(trimmed);
  }

  // For ASCII tags, normalize to lowercase with dashes
  return trimmed.toLowerCase().replace(/\s+/g, "-");
};

export const denormalizeTag = (tagSlug) => {
  // Try to decode URI component first (for Chinese tags)
  try {
    const decoded = decodeURIComponent(tagSlug);
    // If decoded is different from original, it was encoded, return decoded
    if (decoded !== tagSlug) {
      return decoded;
    }
  } catch (e) {
    // If decoding fails, continue with dash replacement
  }

  // For English tags, replace dashes with spaces
  return tagSlug.replace(/-/g, " ");
};
