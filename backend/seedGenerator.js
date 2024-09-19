// Function to generate consistent seed based on user input and page number
const generateSeed = (seed, page) => {
    return seed + page;
  };
  
  module.exports = { generateSeed };
  