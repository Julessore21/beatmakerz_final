/** Pochette de remplacement d'une prod sans image : deux teintes tirées de son identifiant, toujours les mêmes. */
export function coverGradient(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = 230 + (h % 70); // du bleu nuit au violet, la famille du logo
  const hue2 = (hue + 25 + ((h >> 8) % 30)) % 360;
  return `radial-gradient(120% 90% at 20% 15%, hsl(${hue} 70% 42%) 0%, transparent 60%), radial-gradient(90% 80% at 85% 90%, hsl(${hue2} 65% 30%) 0%, transparent 65%), #111116`;
}
