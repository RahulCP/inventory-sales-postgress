const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const express = require('express');

const server = jsonServer.create();


const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Serve static files from the 'src/images' directory
server.use('/images', express.static(path.join(__dirname, 'src/images')));
server.use('/appimages', express.static(path.join(__dirname, 'src/images')));

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp','HEIC'];

// Endpoint to list all directories and image files in the 'src/images' folder
server.get('/api/images', (req, res) => {
    const imagesDir = path.join(__dirname, 'src/images');

    function getFilesAndDirectories(dir, relativePath = '') {
        const filesAndDirs = fs.readdirSync(dir);
        return filesAndDirs.map(name => {
            const fullPath = path.join(dir, name);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                return {
                    name,
                    path: path.join(relativePath, name),
                    isDirectory: true,
                    children: getFilesAndDirectories(fullPath, path.join(relativePath, name)) // Recurse into directories
                };
            } else if (imageExtensions.includes(path.extname(name).toLowerCase())) {
                return {
                    name,
                    path: path.join('/images', relativePath, name),
                    isDirectory: false
                };
            }
            return null;
        }).filter(item => item !== null); // Filter out non-image files and null entries
    }

    try {
        const filesAndDirs = getFilesAndDirectories(imagesDir);
        res.json(filesAndDirs);
    } catch (error) {
        res.status(500).send('Unable to scan directory: ' + error);
    }
});


const port = 5001;
server.listen(port, () => {
    console.log(`JSON Server is running on http://localhost:${port}`);
});
