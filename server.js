const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON requests
app.use(express.json());

// Endpoint to save a drawing
app.post('/save-drawing', (req, res) => {
    const { imageData, name } = req.body; // Base64 data + filename
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(`./notes/${name}.png`, base64Data, 'base64', (err) => {
        if (err) return res.status(500).send("Error saving image");
        res.send({ status: "success", message: "Image saved!" });
    });
});

// Optional: endpoint for notes
app.post('/save-note', (req, res) => {
    const { title, content } = req.body;
    fs.writeFile(`./notes/${title}.txt`, content, (err) => {
        if (err) return res.status(500).send("Error saving note");
        res.send({ status: "success", message: "Note saved!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
