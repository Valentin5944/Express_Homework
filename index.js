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

app.get('/health', (req, res) => {
    res.json({
        status: "ok"
    });
});

app.get('/stats', (req, res) => {
    res.json({
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}/timestamp`);
    console.log(`Server is running on http://${HOST}:${PORT}/health`);
    console.log(`Server is running on http://${HOST}:${PORT}/stats`);
});
