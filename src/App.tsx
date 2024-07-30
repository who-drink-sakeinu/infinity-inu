import { useEffect, useState } from 'react';
import './App.css'

const backgrounds = Object.values(import.meta.glob('./assets/background/*.png', { eager: true, as: 'url' }))
const clothes = Object.values(import.meta.glob('./assets/clothes/*.png', { eager: true, as: 'url' }))
const dogs = Object.values(import.meta.glob('./assets/dog/*.png', { eager: true, as: 'url' }))
const eyewears = Object.values(import.meta.glob('./assets/eyewear/*.png', { eager: true, as: 'url' }))
const faces = Object.values(import.meta.glob('./assets/face/*.png', { eager: true, as: 'url' }))
const hats = Object.values(import.meta.glob('./assets/hat/*.png', { eager: true, as: 'url' }))
const liquors = Object.values(import.meta.glob('./assets/liquor/*.png', { eager: true, as: 'url' }))

const INTERVAL_MIN_MS = 100;
const DEFAULT_INTERVAL_MS = 500;
const INTERVAL_MAX_MS = 1000;

function App() {
  const [randomAssets, setRandomAssets] = useState<string>();
  const [intervalMs, setIntervalMs] = useState(DEFAULT_INTERVAL_MS);

  const combineImages = (images: string[]) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    // Set the canvas size to match the size of the images
    const imageWidth = Math.max(1500, 1500);
    const imageHeight = Math.max(1500, 1500);
    canvas.width = imageWidth;
    canvas.height = imageHeight;
  
    const loadedImages: Promise<HTMLImageElement>[] = images.map((image) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img);
        };
        img.src = image;
      });
    });
  
    return Promise.all(loadedImages).then((images) => {
      images.forEach((img) => {
        context && context.drawImage(img, 0, 0, img.width, img.height);
      });
  
      // Get the combined image as a data URL
      const combinedImage = canvas.toDataURL();
      return combinedImage;
    });
  };

  const downloadImage = (image: string | undefined) => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'SAKEINU.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const randomImage = () => {
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const randomDog = dogs[Math.floor(Math.random() * dogs.length)];
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const randomClothes = clothes[Math.floor(Math.random() * clothes.length)];
    const randomEyewear = eyewears[Math.floor(Math.random() * eyewears.length)];
    const randomHat = hats[Math.floor(Math.random() * hats.length)];
    const randomLiquor = liquors[Math.floor(Math.random() * liquors.length)];

    
    combineImages([randomBackground, randomDog, randomFace, randomClothes, randomEyewear, randomHat, randomLiquor]).then((combinedAssets) => {
      setRandomAssets(combinedAssets);
    })
  }

  const [intevalValue, setIntervalValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      randomImage();
    }, intervalMs);

    setIntervalValue(interval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [isRunning, setIsRunning] = useState(true);

  const stopAnimation = () => {
    clearInterval(intevalValue)
    setIsRunning(false);
  };

  const resumeAnimation = (delta: number) => {
    setIsRunning(true);
    const interval = setInterval(() => {
      randomImage();
    }, intervalMs + delta);

    setIntervalValue(interval);
  };

  const stopOrResumeAnimation = () => {
    if (isRunning) {
      stopAnimation();
    } else {
      resumeAnimation(0);
    }
  }

  const speedUpAnimation = () => {
    if (intervalMs > INTERVAL_MIN_MS) {
      setIntervalMs(intervalMs - 100);
      
      stopAnimation()
      resumeAnimation(-100)
    }
  }

  const speedDownAnimation = () => {
    if (intervalMs <= INTERVAL_MAX_MS) {
      setIntervalMs(intervalMs + 100);

      stopAnimation()
      resumeAnimation(100)
    }
  }
  
  return (
    <div>
      <div style={{ margin: "10px" }}>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
          onClick={() => speedUpAnimation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="11 4 1 12 11 20"></polygon>
            <polygon points="23 4 13 12 23 20"></polygon>
          </svg>
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
          onClick={() => stopOrResumeAnimation()}
        >
          {isRunning ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
          onClick={() => speedDownAnimation()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 4 11 12 1 20"></polygon>
            <polygon points="13 4 23 12 13 20"></polygon>
          </svg>
        </button>
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#000000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
          onClick={() => downloadImage(randomAssets)}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "5px" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
        </button>
      </div>
      <div onClick={() => stopOrResumeAnimation()}>
        <img
          src={randomAssets}
          alt={`SAKEINU`}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", borderRadius: "5px" }}
        />
      </div>
    </div>
  );
}

export default App;
