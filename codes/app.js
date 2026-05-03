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
let renderToken = 0;

const imagePreloadPromises = new Map();

function preloadImage(src) {
  if (!src) {
    return Promise.resolve();
  }

  if (imagePreloadPromises.has(src)) {
    return imagePreloadPromises.get(src);
  }

  const promise = new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = async () => {
      try {
        if (image.decode) {
          await image.decode();
        }
      } catch (error) {
        // The image is already loaded; decode failures should not block the scene.
      }

      resolve();
    };

    image.onerror = reject;
    image.decoding = "async";
    image.src = src;
  });

  const retryablePromise = promise.catch((error) => {
    imagePreloadPromises.delete(src);
    throw error;
  });

  imagePreloadPromises.set(src, retryablePromise);
  return retryablePromise;
}

function preloadSceneImages() {
  scenes.forEach((sceneItem) => {
    preloadImage(sceneItem.image).catch(() => {});
  });
}

function preloadUpcomingSceneImage(index) {
  const nextIndex = (index + 1) % scenes.length;
  preloadImage(scenes[nextIndex].image).catch(() => {});
}

async function renderScene(index) {
  const current = scenes[index];
  const token = ++renderToken;

  scene.dataset.scene = current.id;
  videoFailed = false;
  primaryAction.disabled = true;
  primaryActionText.textContent = "加载中";

  try {
    await preloadImage(current.image);
  } catch (error) {
    // Fall back to the browser's normal image loading path if preload fails.
  }

  if (token !== renderToken) {
    return;
  }

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
  scene.classList.remove("is-playing");
  preloadUpcomingSceneImage(index);
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

async function goToNextScene() {
  sceneVideo.pause();

  currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
  isTransitioning = false;
  await renderScene(currentSceneIndex);
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

preloadSceneImages();
renderScene(currentSceneIndex);
