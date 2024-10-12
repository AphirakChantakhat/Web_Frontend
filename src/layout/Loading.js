import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';

const MostBeautifulMinimalLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 7;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="icon-container">
        <Settings className="icon" size={40} />
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-text">Loading...</p>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

        :root {
          --primaryColor: #00ab58;
          --hoverColor: #6cdaa5;
          --paleGreen: #009048;
          --bgColor: #f0f4f8;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-color: var(--bgColor);
          font-family: 'Poppins', sans-serif;
        }

        .icon-container {
          background: linear-gradient(135deg, var(--primaryColor), var(--hoverColor));
          border-radius: 50%;
          padding: 20px;
          box-shadow: 0 10px 20px rgba(0, 171, 88, 0.2);
          margin-bottom: 30px;
        }

        .icon {
          color: white;
          animation: spin 4s linear infinite;
        }

        .progress-bar {
          width: 200px;
          height: 4px;
          background-color: rgba(0, 171, 88, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress {
          height: 100%;
          background: linear-gradient(90deg, var(--primaryColor), var(--hoverColor));
          transition: width 0.2s ease-out;
        }

        .loading-text {
          color: var(--primaryColor);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
          margin: 0;
          opacity: 0.8;
          animation: fadeInOut 1.5s infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MostBeautifulMinimalLoading;