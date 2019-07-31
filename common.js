const request = require('request');

const UNSPLASH_API_URI = `https://api.unsplash.com/photos/random`;
const CLIENT_ID = '7259d44f8f693885dcc85769bde3d920ca03557c8e8a1ceda3ab12d55648c3ee';

/**
 * calls the Unsplash API to search for images
 * @param count the count of images (optional)
 * @param keyword the keyword to search for (optional)
 * @returns {Promise<any>} the promised list of images
 */
function getImages(count = 1, keyword = '') {
    let keywordp = keyword !== '' ? `&query=${keyword}` : '';
    let qsp = `client_id=${CLIENT_ID}&orientation=landscape&count=${count}${keywordp}`;

    return new Promise((resolve, reject) => request(
        `${UNSPLASH_API_URI}?${qsp}`,
        (err, resp, body) => {
            if (err) {
                console.log(err);
                reject()
            } else {
                try {
                    let parsed = JSON.parse(body);
                    // console.log(parsed);
                    resolve(parsed.map(it => it.urls.regular))
                } catch (e) {
                    console.log(e);
                    reject()
                }
            }
        }
    ))
}

module.exports = {
    getImages: getImages,
    getImage: getImages //alias getImages for logical consistency
};