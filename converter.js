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
  if ((inputData.value = "")) return;

  if (inputData.startsWith("base00:")) {
    const lines = inputData.split("\n").filter((line) => line.trim() !== "");
    outputData = lines
      .map((line) => {
        const match = line.match(/(base0[0-9A-F]):\s*"?(\w{6})"?/i);
        if (match) {
          const [_, baseCode, color] = match;
          const newName = mapping[baseCode];
          if (newName) {
            return `\t${newName} = "#${color}", -- ${baseCode}`;
          }
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");
  } else {
    const lines = inputData.split("\n").filter((line) => line.trim() !== "");
    outputData = lines
      .map((line) => {
        const match = line.match(/(base0[0-9A-F])\s*=\s*"(#\w{6})",?/i);
        if (match) {
          const [_, baseCode, color] = match;
          const newName = mapping[baseCode];
          if (newName) {
            return `\t${newName} = "${color}", -- ${baseCode}`;
          }
        }
        return null;
      })
      .filter(Boolean)
      .join("\n");
  }

  document.getElementById("output").value = outputData;

  copyToClipboard(outputData);
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
