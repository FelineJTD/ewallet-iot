function AsciiArt() {
  const ascii = `
_._     _,-'""\`-._\n
(,-.\`._,'(       |\\\`-/|\n
    \`-.-' \\ )-\`( , o o)\n
          \`-    \\\`_\`"'-
  `;

  return (
    <div>
      <p className="whitespace-pre-wrap leading-[0.5]">{ascii}</p>
    </div>
  )
}

export default AsciiArt;