import { useEffect, useState } from "react";

function AsciiAnimation() {
  const [asciiIndex, setAsciiIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAsciiIndex((prevIndex) => prevIndex + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const ascii1 = `
z     |\\      ____,,,___\n
 zz   /,\`.-'\`'    -.  ;-;;,_\n
    |,4-  ) )-,_..;\\ (  \`'-'\n
    '---''(_/--'  \`-'\\_)  
  `;

  const ascii2 = `
Zz    |\\      _,,,---,,_\n
 z    /,\`.-'\`'    -.  ;-;;,_\n
    |,4-  ) )-,_..;\\ (  \`'-'\n
    '---''(_/--'  \`-'\\_)  
  `;

  return (
    <div>
      <p className="whitespace-pre-wrap leading-[0.5]">{asciiIndex % 2 === 0 ? ascii1 : ascii2}</p>
    </div>
  )
}

export default AsciiAnimation;