const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../storage/profile.json');

// 🔹 Save profile data to JSON file
exports.saveProfileData = (req, res) => {
  const newProfile = req.body;

  if (!newProfile.name || !newProfile.experience) {
    return res.status(400).json({ error: 'Incomplete profile data' });
  }

  let profiles = [];

  // Read existing profiles from file if exists
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE);
      profiles = JSON.parse(raw);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read profile data' });
    }
  }

  // Add new profile to the list
  profiles.push(newProfile);

  // Write updated profiles back to file
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(profiles, null, 2));
    res.status(200).json({ message: 'Profile saved successfully', saved: newProfile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write profile data' });
  }
};

// 🔹 Get all saved profiles
exports.getAllProfiles = (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(200).json([]); // No data yet
  }

  try {
    const raw = fs.readFileSync(DATA_FILE);
    const profiles = JSON.parse(raw);
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read profile data' });
  }
};