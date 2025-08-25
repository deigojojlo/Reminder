const { exec } = require('node:child_process');
const fs = require('node:fs');

async function fetch(link, outputFilename, dest) {
    exec(`go run fetch.go ${link} ${outputFilename}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    Object.assign(dest, read(outputFilename));
    });

}

function read(filename) {
    var jsonData
    try {
        const data = fs.readFileSync(filename, 'utf8');
        jsonData = JSON.parse(data);
    } catch (err) {
        console.error('Erreur:', err);
    }
    return jsonData
}

module.exports = { fetch }

// console.log(fetch("https://edt.math.univ-paris-diderot.fr/data/fusionL3MI.ics","1402264546717991023fusionL3MI.ics.json"))