import { useEffect, useState } from 'react';
import './App.css'

const backgrounds = Object.values(import.meta.glob('./assets/background/*.png', { eager: true, as: 'url' }))
const clothes = Object.values(import.meta.glob('./assets/clothes/*.png', { eager: true, as: 'url' }))
const dogs = Object.values(import.meta.glob('./assets/dog/*.png', { eager: true, as: 'url' }))
const eyewears = Object.values(import.meta.glob('./assets/eyewear/*.png', { eager: true, as: 'url' }))
const faces = Object.values(import.meta.glob('./assets/face/*.png', { eager: true, as: 'url' }))
const hats = Object.values(import.meta.glob('./assets/hat/*.png', { eager: true, as: 'url' }))
const liquors = Object.values(import.meta.glob('./assets/liquor/*.png', { eager: true, as: 'url' }))

const REPATE_MS = 150

function App() {
  const [randomAssets, setRandomAssets] = useState<string>();

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
    }, REPATE_MS);

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

  const resumeAnimation = () => {
    setIsRunning(true);
    const interval = setInterval(() => {
      randomImage();
    }, REPATE_MS);

    setIntervalValue(interval);
  };

  const stopOrResumeAnimation = () => {
    if (isRunning) {
      stopAnimation();
    } else {
      resumeAnimation();
    }
  }
  
  return (
    <div>
      <div style={{ margin: "10px", display: "flex", justifyContent: "flex-end" }}>
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
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

export default App;