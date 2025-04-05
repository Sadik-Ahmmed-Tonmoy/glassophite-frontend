"use client";
import "./StockOutButton.css"; // Import your CSS file here

const StockOutButton = () => {
  return (
    <button className="StockBtn bg-gradient-to-br from-gray-600 via-gray-900 to-gray-600 hover:from-gray-600 hover:via-gray-700 hover:to-gray-600 transition-colors text-white flex justify-center items-center gap-1 py-3 rounded-md" disabled>
      <span className="IconContainer">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          height="1em" 
          viewBox="0 0 512 512" 
          fill="white"
          className="stock-icon"
        >
          <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/>
        </svg>
      </span>
      <p className="text text-white">Stock Out</p>
    </button>
  );
};

export default StockOutButton;
