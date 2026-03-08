exports.getRecommendations = (req, res) => {
    const { location, soilType, weather, season } = req.body;

    // A mock recommendation engine
    const allCrops = [
        { name: "Wheat", soil: "Loamy", season: "Winter", hybrid: "HD 2967", timeToHarvest: "120 days" },
        { name: "Rice", soil: "Clay", season: "Monsoon", hybrid: "IR64", timeToHarvest: "130 days" },
        { name: "Maize", soil: "Sandy", season: "Summer", hybrid: "Pioneer 30V92", timeToHarvest: "90 days" },
        { name: "Cotton", soil: "Black", season: "Summer", hybrid: "Bt Cotton", timeToHarvest: "150 days" },
        { name: "Sugarcane", soil: "Alluvial", season: "All", hybrid: "Co 0238", timeToHarvest: "300 days" },
        { name: "Tomato", soil: "Red", season: "Winter", hybrid: "Arka Rakshak", timeToHarvest: "70 days" }
    ];

    let recommended = allCrops.filter(c => 
        (c.soil === soilType || !soilType) && 
        (c.season === season || c.season === 'All' || !season)
    );

    if (recommended.length === 0) {
        // Fallback
        recommended = [allCrops[0], allCrops[2]];
    }

    res.json({
        recommendedCrops: recommended,
        tips: `For ${soilType} soil in ${season}, ensure appropriate fertilizers are used. Weather is currently ${weather}, so adjust watering accordingly.`
    });
};
