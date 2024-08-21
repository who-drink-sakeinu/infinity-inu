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
    <div
  style={{
    backgroundColor: "#0d0d0d",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 0 25px rgba(0, 255, 255, 0.3)",
    display: "flow",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    color: "#00ffcc",
    fontFamily: "'Press Start 2P', cursive", 
    textTransform: "uppercase",
    position:    "relative",
    overflow: "hidden",
  }}
>
  <div
    style={{
      marginBottom: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      gap: "20px",
    }}
  >
    <button
      style={{
        padding: "15px",
        backgroundColor: "#222",
        color: "#00ffcc",
        border: "2px solid #00ffcc",
        borderRadius: "50%",
        cursor: "pointer",
        margin: "0",
        transition: "transform 0.3s, box-shadow 0.3s",
        width: "calc(20% - 20px)",
        maxWidth: "80px",
        minWidth: "50px",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
        animation: "glow 1s infinite alternate",
      }}
      onClick={() => speedDownAnimation()}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 255, 0.6)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.3)";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "#00ffcc" }}
      >
        <polygon points="11 4 1 12 11 20"></polygon>
        <polygon points="23 4 13 12 23 20"></polygon>
      </svg>
    </button>
    <button
      style={{
        padding: "15px",
        backgroundColor: "#222",
        color: isRunning ? "#ff0066" : "#00ffcc",
        border: `2px solid ${isRunning ? "#ff0066" : "#00ffcc"}`,
        borderRadius: "50%",
        cursor: "pointer",
        margin: "0",
        transition: "transform 0.3s, box-shadow 0.3s",
        width: "calc(20% - 20px)",
        maxWidth: "80px",
        minWidth: "50px",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
        animation: "glow 1s infinite alternate",
      }}
      onClick={() => stopOrResumeAnimation()}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 255, 0.6)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.3)";
      }}
    >
      {isRunning ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: "#ff0066" }}
        >
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ stroke: "#00ffcc" }}
        >
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      )}
    </button>
    <button
      style={{
        padding: "15px",
        backgroundColor: "#222",
        color: "#00ffcc",
        border: "2px solid #00ffcc",
        borderRadius: "50%",
        cursor: "pointer",
        margin: "0",
        transition: "transform 0.3s, box-shadow 0.3s",
        width: "calc(20% - 20px)",
        maxWidth: "80px",
        minWidth: "50px",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
        animation: "glow 1s infinite alternate",
      }}
      onClick={() => speedUpAnimation()}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 255, 0.6)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.3)";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "#00ffcc" }}
      >
        <polygon points="1 4 11 12 1 20"></polygon>
        <polygon points="13 4 23 12 13 20"></polygon>
      </svg>
    </button>
    <button
      style={{
        padding: "15px",
        backgroundColor: "#222",
        color: "#00ffcc",
        border: "2px solid #00ffcc",
        borderRadius: "50%",
        cursor: "pointer",
        margin: "0",
        transition: "transform 0.3s, box-shadow 0.3s",
        width: "calc(20% - 20px)",
        maxWidth: "80px",
        minWidth: "50px",
        boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
        animation: "glow 1s infinite alternate",
      }}
      onClick={() => downloadImage(randomAssets)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.2)";
        e.currentTarget.style.boxShadow = "0 0 25px rgba(0, 255, 255, 0.6)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 255, 255, 0.3)";
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: "#00ffcc" }}
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg></button></div>
      <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      marginTop: "20px",
    }}
  >
    <img
      src={randomAssets}
      alt={`SAKEINU`}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "calc(100vh - 200px)",
        objectFit: "contain",
        boxShadow: "0px 0px 25px rgba(255, 255, 0, 0.7)",
        borderRadius: "15px",
        animation: "energy 1s infinite alternate",
      }}
    />
{/* energy animation */}
<div
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    borderRadius: "50%",
    animation: "energyWave 1.5s infinite ease-in-out",
    zIndex: "1",
  }}
/></div>
<style>
    {`
      @keyframes glow {
        0% { box-shadow: 0 0 15px rgba(0, 255, 255, 0.3); }
        100% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.7); }
      }

      @keyframes energy {
        0% { box-shadow: 0 0 15px rgba(255, 255, 0, 0.7); }
        100% { box-shadow: 0 0 25px rgba(255, 255, 0, 1); }
      }

      @keyframes energyWave {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0;
        }
      }
    `}
  </style>
</div>
  );
}

export default App;
