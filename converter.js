const mapping = {
  base00: "base",
  base01: "mantle",
  base02: "surface0",
  base03: "surface1",
  base04: "surface2",
  base05: "text",
  base06: "rosewater",
  base07: "lavender",
  base08: "red",
  base09: "peach",
  base0A: "yellow",
  base0B: "green",
  base0C: "teal",
  base0D: "blue",
  base0E: "mauve",
  base0F: "flamingo"
};

let previousInput = "";

function convertColors() {
  const inputData = document.getElementById("input").value.trim();
  let outputData = "";

  // Проверяем, если input пустой
  if (inputData === "") return;

  const lines = inputData.split("\n").filter((line) => line.trim() !== "");

  // Перебор строк
  let isPalette = false;
  lines.forEach((line) => {
    if (line.toLowerCase().startsWith("author")) {
      return;
    }

    if (line.toLowerCase().startsWith("#")) {
      return;
    }

    const schemeMatch = line.match(/^scheme:\s*"(.*?)"/);
    if (schemeMatch) {
      const schemeName = schemeMatch[1];
      outputData += `-- ${schemeName}\n`;
      return;
    }

    const variantMatch = line.match(/^variant:\s*"(.*?)"/);
    if (variantMatch) {
      const schemeName = variantMatch[1];
      outputData += `-- ${schemeName} theme\n`;
      return;
    }
    const nameMatch = line.match(/^name:\s*"(.*?)"/);
    if (nameMatch) {
      const schemeName = nameMatch[1];
      outputData += `-- ${schemeName}\n`;
      return;
    }

    if (line.toLowerCase().startsWith("palette:")) {
      isPalette = true;
      return;
    }

    if (isPalette) {
      const match = line.match(/^\s*(base0[0-9A-F]):\s*"#?(\w{6})"?/i);
      if (match) {
        const [_, baseCode, color] = match;
        const newName = mapping[baseCode];
        if (newName) {
          outputData += `${newName} = "#${color}", -- ${baseCode}\n`;
        }
      }

      if (line.trim() === "") {
        isPalette = false;
      }
    }
    if (line.trim().startsWith("base")) {
      const patterns = [
        /(base0[0-9A-F]):\s*"?([0-9A-Fa-f]{6})"?/,
        /(base0[0-9A-F])\s*=\s*["']#?([0-9A-Fa-f]{6})["'],?/
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const [, baseCode, color] = match;
          const newName = mapping[baseCode];
          if (newName) {
            outputData += `${newName} = "#${color}", -- ${baseCode}\n`;
          }
        }
      }
    }
  });

  document.getElementById("output").value = outputData.trim();

  if (document.getElementById("output").value !== "") {
    copyToClipboard(outputData);
  }
}

/**
 * copy data to clipboard
 * @param {string} data - data to copy
 */
function copyToClipboard(data) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(data)
      .then(() => {
        console.log("copied to clipboard");
      })
      .catch((error) => {
        console.error("error copy", error);
      });
  } else {
    console.error("clipboard api doesnt work in that browser");
  }
}

function checkInputChanges() {
  const inputData = document.getElementById("input").value.trim();

  if (inputData !== previousInput) {
    previousInput = inputData;
    convertColors();
  }
}

setInterval(checkInputChanges, 1000);
