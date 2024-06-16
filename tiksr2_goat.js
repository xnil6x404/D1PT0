const axios = require("axios");

module.exports.config = {
    name: "tiksr2",
    version: "1.0",
    author: "Mesbah Bb'e",
    countDown: 5,
    role: 0,
    description: {
        en: "Search for TikTok videos"
    },
    category: "MEDIA",
    guide: {
        en: "{pn} <search> - <optional: number of results | blank>"
          + "\nExample:"
          + "\n{pn} caredit - 50"
    },
};

module.exports.onStart = async function ({ api, args, event }) {
    let search = args.join(" ");
    let searchLimit = 10;

    const match = search.match(/^(.+)\s*-\s*(\d+)$/);
    if (match) {
        search = match[1].trim();
        searchLimit = parseInt(match[2], 10);
    }

    const apiUrl = `https://nobs-api.onrender.com/dipto/tiktoksearch?search=${encodeURIComponent(search)}&limit=${searchLimit}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.data;
        const videoData = data[Math.floor(Math.random() * data.length)];
        
        const stream = await axios({
            method: 'get',
            url: videoData.video,
            responseType: 'stream'
        });
        
        let infoMessage = `🎥 Video Title: ${videoData.title}\n`;
        infoMessage += `🔗 Video URL: ${videoData.video}\n`;

        api.sendMessage({ body: infoMessage, attachment: stream.data }, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while downloading the TikTok video.", event.threadID);
    }
};