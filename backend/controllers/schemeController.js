exports.getSchemes = (req, res) => {
    // Return sample schemes
    const schemes = [
        {
            id: 1,
            title: "PM-KISAN",
            description: "Pradhan Mantri Kisan Samman Nidhi provides an income support of ₹6,000 per year in three equal installments to all land holding farmer families.",
            benefits: ["₹6000 per year directly to bank account", "Support for agricultural expenses"],
            link: "https://pmkisan.gov.in/"
        },
        {
            id: 2,
            title: "Kisan Credit Card (KCC)",
            description: "To provide adequate and timely credit support from the banking system to the farmers for their cultivation and other needs.",
            benefits: ["Low interest rate loans", "Insurance coverage for KCC holders", "Flexible repayment"],
            link: "https://myscheme.gov.in/schemes/kcc"
        },
        {
            id: 3,
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description: "Crop insurance scheme to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crop as a result of natural calamities.",
            benefits: ["Comprehensive risk coverage", "Low premium (1.5% - 2%)"],
            link: "https://pmfby.gov.in/"
        },
        {
            id: 4,
            title: "Paramparagat Krishi Vikas Yojana (PKVY)",
            description: "An extended component of Soil Health Management (SHM) under the Centrally Sponsored Scheme (CSS), National Mission on Sustainable Agriculture (NMSA).",
            benefits: ["Promotes organic farming", "Financial assistance of ₹50,000/ha for 3 years"],
            link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx"
        }
    ];

    res.json(schemes);
};
