/**
 * Generates a random hex color code with controlled brightness.
 * Automatically ensures the color is neither too dark nor too light.
 * @returns {string} A hex color string.
 */
export function generateRandomColor(): string {
  // Default range: 50-200 (out of 255) for moderate brightness
  const minBrightness = 50; // Avoids very dark colors
  const maxBrightness = 200; // Avoids very light colors

  const getRandomValue = () =>
    Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) +
    minBrightness;

  const r = getRandomValue().toString(16).padStart(2, "0");
  const g = getRandomValue().toString(16).padStart(2, "0");
  const b = getRandomValue().toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}


export function generateColorFromName(name?: string): string {
  if (!name) return "hsl(0, 0%, 80%)"; // Default gray color

  let hash = 0;

  // Stronger hashing with prime numbers
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 37 + name.charCodeAt(i)) % 1000000;
  }

  // Distribute hue more randomly
  const hue = (hash % 360 + (hash * 17) % 180) % 360; // Ensures wider spread
  const saturation = 60 + ((hash >> 3) % 30); // 60-90% for vibrancy
  const lightness = 40 + ((hash >> 5) % 20); // 40-60% for balance

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

