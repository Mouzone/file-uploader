module.exports.getExpirationDate = (duration, units) => {
    const currentDate = new Date();
    const durationInMS = {
        "hours": duration * 60 * 60 * 1000,
        "days": duration * 24 * 60 * 60 * 1000,
        "weeks": duration * 7 * 24 * 60 * 60 * 1000,
        "months": duration * 30 * 24 * 60 * 60 * 1000,
    }

    const expirationMs = currentDate.getTime() + durationInMS[units];
    return new Date(expirationMs).toISOString();  // Returns the expiration date in UTC
};
