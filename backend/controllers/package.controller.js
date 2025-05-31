const packageModel = require('../models/package.model');

async function getPackages(req, res) {
  try {
    const packages = await packageModel.getPackages();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve packages', error: err.message });
  }
}

async function getPackageDetails(req, res) {
  try {
    const packageId = parseInt(req.params.MAGOI, 10);
    if (isNaN(packageId)) {
      return res.status(400).json({ message: 'Invalid package ID' });
    }
    const details = await packageModel.getPackageDetails(packageId);
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve package details', error: err.message });
  }
}

module.exports = {
  getPackages,
  getPackageDetails,
}; 