const numArcs = 8;
const maxSoundIndex = 8;

const notes = [...Array(numArcs).keys()].map((i) => {
  const soundIndex = (i % maxSoundIndex) + 1;
  return new Audio(`sounds/0${soundIndex}-Sound 0${soundIndex}.mp3`);
});

const baseDuration = 2;
window.addEventListener("load", () => {
  const parentDiv = document.querySelector("#parentDiv");
  for (let index = 0; index < numArcs; ++index) {
    const color = `hsl(${(index * 270) / (numArcs - 1)}, 100%, 50%)`;
    const radius = 100 + 15 * index;
    const duration = baseDuration * (0.5 * index + 1);
    const div = document.createElement("div");
    div.className = "curve";
    div.style = `--color: ${color}; --radius: ${radius}px`;
    parentDiv.appendChild(div);

    const dotContainer = document.createElement("div");
    dotContainer.className = "dot-container";
    dotContainer.style = `--radius: ${radius}px; --duration: ${duration}s`;
    dotContainer.addEventListener("animationiteration", async () => {
      await notes[index].play();
    });

    const dotContent = document.createElement("div");
    dotContent.className = "dot-content";
    dotContent.style = `--color: ${color}; --duration: ${duration}s`;

    dotContainer.appendChild(dotContent);
    parentDiv.appendChild(dotContainer);
  }
});
