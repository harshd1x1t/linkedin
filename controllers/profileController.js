const fs = require('fs');
const path = require('path');

// Directory where profiles will be saved
const PROFILE_DIR = path.join(__dirname, '../storage');

// Make sure the directory exists
if (!fs.existsSync(PROFILE_DIR)) {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
}

// Store profiles in memory
const profiles = new Map();

// 🔹 Save a profile
exports.saveProfileData = (req, res) => {
  const profile = req.body;

  if (!profile.name || !profile.experience) {
    return res.status(400).json({ error: 'Incomplete profile data' });
  }

  const key = profile.name.toLowerCase().replace(/\s+/g, '_');
  profiles.set(key, profile);

  res.status(200).json({
    message: 'Profile saved in memory',
    id: key,
    saved: profile
  });
};

// Get all saved profiles
exports.getAllProfiles = (req, res) => {
  
  const allProfiles = Array.from(profiles.values());
  res.status(200).json(allProfiles);
};

// Get a specific profile by name
exports.getProfileByName = (req, res) => {
  const nameParam = req.params.name.toLowerCase().replace(/\s+/g, '_');
  

  if (!profiles.has(nameParam)) {
    console.log(`❌ Profile '${nameParam}' not found`);
    return res.status(404).json({ error: `Profile '${nameParam}' not found` });
  }

  const profile = profiles.get(nameParam);
  res.status(200).json(profile);
};


