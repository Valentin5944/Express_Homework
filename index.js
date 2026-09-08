import express from "express"

const app = express();

const HOST = 'localhost';
const PORT = 3000;


app.get('/timestamp', (req, res) => {
    const currentDate = new Date();

    res.json({
        timestamp: currentDate.toISOString()
    });
});


app.listen(PORT, HOST, () => {
    console.log(`server is running on http://localhost:3000/timestamp`);
});
