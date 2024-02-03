const app = require('./app.js');
const config = require('./app/config');
const MongoDB = require('./app/utils/mongodb.util.js');

const startServer = async () => {
    try {
        // connect to database
        await MongoDB.connect(config.db.uri);
        console.log('Connected to the database');

        // start server
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    }
    catch(error) {
        console.log('Cannot connect to the database!', error);
        process.exit();
    }
}

startServer();
