const scenes = window.SCENES;

const scene = document.querySelector(".scene");
const sceneImage = document.querySelector("#sceneImage");
const sceneVideo = document.querySelector("#sceneVideo");
const sceneKicker = document.querySelector("#sceneKicker");
const sceneTitle = document.querySelector("#sceneTitle");
const sceneDescription = document.querySelector("#sceneDescription");
const primaryAction = document.querySelector("#primaryAction");
const primaryActionText = document.querySelector("#primaryActionText");

let currentSceneIndex = 0;
let isTransitioning = false;
let videoFailed = false;

function renderScene(index) {
  const current = scenes[index];

  scene.classList.remove("is-playing");
  scene.dataset.scene = current.id;
  videoFailed = false;

  sceneImage.src = current.image;
  sceneImage.alt = current.title;
  sceneVideo.removeAttribute("src");
  sceneVideo.load();

  if (current.video) {
    sceneVideo.src = current.video;
    sceneVideo.preload = "metadata";
  }

  sceneKicker.textContent = current.kicker;
  sceneTitle.textContent = current.title;
  sceneDescription.textContent = current.description;
  primaryActionText.textContent = current.action;
  primaryAction.disabled = false;
}

async function playCurrentScene() {
  if (isTransitioning) return;

  const current = scenes[currentSceneIndex];

  if (videoFailed) {
    goToNextScene();
    return;
  }

  if (!current.video) {
    currentSceneIndex = 0;
    renderScene(currentSceneIndex);
    return;
  }

  isTransitioning = true;
  primaryAction.disabled = true;
  primaryActionText.textContent = "播放中";

  try {
    sceneVideo.currentTime = 0;
    await sceneVideo.play();
    scene.classList.add("is-playing");
  } catch (error) {
    scene.classList.remove("is-playing");
    primaryAction.disabled = false;
    primaryActionText.textContent = "再次尝试";
    isTransitioning = false;
  }
}

function goToNextScene() {
  scene.classList.remove("is-playing");
  sceneVideo.pause();

  currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
  isTransitioning = false;
  renderScene(currentSceneIndex);
}

primaryAction.addEventListener("click", playCurrentScene);
sceneVideo.addEventListener("ended", goToNextScene);

sceneVideo.addEventListener("error", () => {
  scene.classList.remove("is-playing");
  primaryAction.disabled = false;
  primaryActionText.textContent = "跳过继续";
  isTransitioning = false;
  videoFailed = true;
});

renderScene(currentSceneIndex);
