const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../storage/profile.json');

// Save profile data to JSON file
exports.saveProfileData = (req, res) => {
  const newProfile = req.body;

  if (!newProfile.name || !newProfile.experience) {
    return res.status(400).send('Incomplete profile data');
  }

  let profiles = [];

  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE);
    profiles = JSON.parse(raw);
  }

  profiles.push(newProfile);

  fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2));
  res.status(200).send('Profile saved successfully');
};

// Get all saved profiles
exports.getAllProfiles = (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(200).json([]);
  }

  const raw = fs.readFileSync(DATA_FILE);
  const profiles = JSON.parse(raw);
  res.status(200).json(profiles);
};
