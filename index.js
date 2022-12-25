require("dotenv").config();
const { upload, fileCache } = require('./upload');

(async () => {
    try {
        const app = require('express')();
        const { Noco } = require("nocodb");
        const httpServer = app.listen(process.env.PORT || 8080);

        app.get("/download/noco/*", (req, res, next) => {
            if (fileCache.has(req.params[0])) res.redirect(`https://res.cloudinary.com/blitz-esports/database-assets/${req.params[0]}`)
            else next();
        });

        app.use(await Noco.init({}, httpServer, app));
        console.log(`Visit : localhost:${process.env.PORT}/dashboard`);
    } catch (e) {
        console.log(e)
    }

    upload();
    setInterval(() => {
        upload();
    }, 1000 * 60 * 5);

})()