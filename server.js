const app = require('./app.js');
const config = require('./app/config');

// start server
const PORT = config.app.port;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
