const express = require('express');
const common = require('./common.js');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//// routes
app.get('/',
    async (req, resp) => resp.render('index', {imgUrl: await common.getImage()})
);

app.get('/search',
    async (req, resp) => resp.render('results', {
        imgUrls: await common.getImages(9, req.query.keyword),
        keyword: req.query.keyword
    })
);

app.get('/favorites',
    async (req, resp) => resp.render('favorites', {
        imgUrl: await common.getImage(),
        rows: await dbGetKeywords()
    })
);

app.get('/api/update-favorites',
    (req, resp) => resp.send(dbModifyFavorites(
        req.query.img_url,
        req.query.keyword,
        req.query.action)
    )
);

app.get('/api/keyword-favorites',
    async (req, resp) => resp.send(await dbGetKeywordFavorites(req.query.keyword))
);

//// server listener
app.listen('8081', 'localhost',
    () => console.log('server is running...')
);

//// functions

/**
 * represents acceptable dbModify actions
 * @type {{DELETE: string, INSERT: string}}
 */
const actions = {
    INSERT: 'insert',
    DELETE: 'delete'
};

/**
 * Inserts or Deletes a favorite depending on the given action
 * @param imgUrl the URL of the favorited image
 * @param keyword the keyword for the image
 * @param action the action (from actions)
 * @returns {string} a result string (to send to the client)
 */
function dbModifyFavorites(imgUrl, keyword, action) {

    let sql;
    let params;

    if (action === actions.INSERT) {
        sql = `INSERT INTO favorites (image_url, keyword) VALUES (?, ?)`;
        params = [imgUrl, keyword]
    } else {
        sql = `DELETE FROM favorites WHERE image_url = ?`;
        params = [imgUrl]
    }
    console.log(`sql: ${sql}, url: ${imgUrl}`);

    db.query(sql,
        params,
        (err, result) => {
            if (err) throw err;

            console.log(`${err}, ${result}`);
        });

    return `{func: dbModifyFavorites, action: ${action}, keyword: ${keyword}, img_url: ${imgUrl}`;
}

/**
 * Queries the database for a list of keywords
 * @returns {Promise<any>} returns a promised list of keywords
 */
function dbGetKeywords() {
    let sql = `SELECT DISTINCT keyword FROM favorites ORDER BY keyword`;
    return dbPromise(sql);
}

/**
 * Queries the database for favorites under a given keyword
 * @param keyword the keyword to query
 * @returns {Promise<any>} returns a promised list of favorites
 */
function dbGetKeywordFavorites(keyword) {
    let sql = `SELECT image_url FROM favorites WHERE keyword = ?`;
    return dbPromise(sql, [keyword]);
}

/**
 * Queries the database as a promise
 * @param sql the sql statement to execute
 * @param params the parameters to use in the query (optional)
 * @returns {Promise<any>} returns a promise for use in async/await
 */
function dbPromise(sql, params = []) {

    // console.log(`sql: ${sql}, params: ${params}`);
    return new Promise((resolve, reject) => {
        db.query(sql,
            params,
            (err, result) => {
                if (err) {
                    /* do nothing */
                }
                // console.log(result);
                return resolve(result);
            })
    })
}