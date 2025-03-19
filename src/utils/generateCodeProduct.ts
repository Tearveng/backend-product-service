export const generateCodeProduct = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Uppercase letters A-Z
  const length = Math.floor(Math.random() * 2) + 4; // Randomly picks 4 or 5
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    result += letters[randomIndex];
  }

  return result;
};
