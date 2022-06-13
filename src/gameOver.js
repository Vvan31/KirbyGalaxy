
const score = 0;
const no_high_scores = 5;
const HIGH_SCORES = 'highScores';
// Translate to string JSON
const highScoreString = localStorage.getItem(HIGH_SCORES);
const highScores = JSON.parse(highScoreString) ?? [];

const lowestScore = 0;

// Add data
localStorage.setItem('myCar', 'Tesla');

// Read data
const car = localStorage.getItem('myCar');

// Remove specific data
localStorage.removeItem('myCar');

// Remove all data
localStorage.clear();