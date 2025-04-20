// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());

// Game simulation data
let gamesData = [{
  homeTeam: {
    city: "Los Angeles",
    name: "Lakers",
    abbreviation: "LAL",
    wins: 51,
    losses: 31,
    score: 52,
    stats: {
      fgPercentage: "36.2%",
      threePointMade: 4,
      threePointAttempts: 28,
      rebounds: 35
    }
  },
  awayTeam: {
    city: "Boston",
    name: "Celtics",
    abbreviation: "BOS",
    wins: 56,
    losses: 26,
    score: 69,
    stats: {
      fgPercentage: "44.8%",
      threePointMade: 14,
      threePointAttempts: 34,
      rebounds: 32
    }
  },
  period: 3,
  timeRemaining: "6:42",
  gameStatus: "live" // can be 'scheduled', 'live', 'halftime', 'final'
}];

gamesData.push(
  {
    homeTeam: {
      city: "Atlanta",
      name: "Atlanta Hawks",
      abbreviation: "ATL",
      wins: 40,
      losses: 42,
      score: 114,
      stats: {
        fgPercentage: "43.1%",
        threePointMade: 16,
        threePointAttempts: 47,
        rebounds: 44
      }
    },
    awayTeam: {
      city: "Miami",
      name: "Miami Heat",
      abbreviation: "MIA",
      wins: 37,
      losses: 45,
      score: 123,
      stats: {
        fgPercentage: "50.0%",
        threePointMade: 16,
        threePointAttempts: 42,
        rebounds: 54
      }
    },
    period: 2,
    timeRemaining: "4:05",
    gameStatus: "live" 
  }
)

gamesData.push(
  {
    homeTeam: {
      city: "Indiana",
      name: "Pacers",
      abbreviation: "IND",
      wins: 50,
      losses: 32,
      score: 117,
      stats: {
        fgPercentage: "51.9%",
        threePointMade: 13,
        threePointAttempts: 34,
        rebounds: 43
      }
    },
    awayTeam: {
      city: "Milwaukee",
      name: "Bucks",
      abbreviation: "MIL",
      wins: 48,
      losses: 34,
      score: 98,
      stats: {
        fgPercentage: "41.7%",
        threePointMade: 9,
        threePointAttempts: 37,
        rebounds: 41
      }
    },
    period: 1,
    timeRemaining: "9:02",
    gameStatus: "live" 
  }
)

gamesData.push(
  {
    homeTeam: {
      city: "Denver",
      name: "Nuggets",
      abbreviation: "DEN",
      wins: 50,
      losses: 32,
      score: 112,
      stats: {
        fgPercentage: "43.6%",
        threePointMade: 9,
        threePointAttempts: 27,
        rebounds: 45
      }
    },
    awayTeam: {
      city: "Los Angelos",
      name: "Clippers",
      abbreviation: "LAC",
      wins: 50,
      losses: 32,
      score: 110,
      stats: {
        fgPercentage: "50.0%",
        threePointMade: 12,
        threePointAttempts: 33,
        rebounds: 44
      }
    },
    period: 4,
    timeRemaining: "6:02",
    gameStatus: "live" 
  }
)

// Function to randomly update the score
function simulateGameProgress() {
  gamesData.forEach((gameData) => {
    if (gameData.gameStatus !== 'live') return;

    // Random point scored (0, 1, 2 or 3 points)
    const scoringTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    const pointsScored = Math.floor(Math.random() * 4);

    if (pointsScored > 0) {
      gameData[scoringTeam].score += pointsScored;

      // Update stats based on points scored
      if (pointsScored === 3) {
        gameData[scoringTeam].stats.threePointMade += 1;
        gameData[scoringTeam].stats.threePointAttempts += 1;
      } else if (pointsScored === 2 || pointsScored === 1) {
        // Update field goal percentage
        const newPercentage = Math.min(Math.max(
          parseFloat(gameData[scoringTeam].stats.fgPercentage) + (Math.random() * 0.5 - 0.25),
          35.0), 65.0).toFixed(1);
        gameData[scoringTeam].stats.fgPercentage = newPercentage + "%";
      }
    } else {
      // Missed shot
      if (Math.random() > 0.7) {
        gameData[scoringTeam].stats.threePointAttempts += 1;
      }
    }

    // Random rebound
    const reboundTeam = Math.random() > 0.5 ? 'homeTeam' : 'awayTeam';
    if (Math.random() > 0.7) {
      gameData[reboundTeam].stats.rebounds += 1;
    }

    // Update time
    const currentMinutes = parseInt(gameData.timeRemaining.split(':')[0]);
    const currentSeconds = parseInt(gameData.timeRemaining.split(':')[1]);
    let newSeconds = currentSeconds - Math.floor(Math.random() * 24);
    let newMinutes = currentMinutes;

    if (newSeconds < 0) {
      newMinutes -= 1;
      newSeconds += 60;
    }

    if (newMinutes < 0) {
      // End of quarter
      gameData.period += 1;
      if (gameData.period > 4) {
        // Game ended
        if (gameData.homeTeam.score === gameData.awayTeam.score) {
          // Overtime
          gameData.timeRemaining = "5:00";
        } else {
          gameData.gameStatus = "final";
          gameData.timeRemaining = "0:00";
        }
      } else {
        // New quarter
        gameData.timeRemaining = "12:00";
      }
    } else {
      gameData.timeRemaining = `${newMinutes}:${newSeconds.toString().padStart(2, '0')}`;
    }
  })
}

// Simulate game progress every 3 seconds
setInterval(simulateGameProgress, 3000);

// API endpoint to get current game data

app.get('/api/game', (req, res) => {
  res.json(gamesData);
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
