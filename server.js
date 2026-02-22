const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'), {
    extensions: ['html'],
    index: 'index.html'
}));

// Fallback to index.html for any unmatched routes
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', function () {
    console.log('OAG Kenya Platform running on port ' + PORT);
});
