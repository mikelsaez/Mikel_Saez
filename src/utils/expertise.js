export function splitProjectLabel(label) {
  const [name, ...contextParts] = label.split(/\s+[–—]\s+/)

  return {
    name: name.trim(),
    context: contextParts.join(' ').trim(),
  }
}
