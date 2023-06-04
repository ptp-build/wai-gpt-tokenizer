const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, "../dist/index.js");

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // Split the file content into lines
    const lines = data.split('\n');
    let t = "";
    // Loop through the lines and replace the matching line
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('var encoder =')) {
            lines[i] = 'var encoder = [];';
        }
        if (lines[i].startsWith('var api = GptEncoding.getEncodingApi("cl100k_base"')) {
            t = lines[i];
            lines[i] = '//' +lines[i];
            lines[i+1] = '//' + lines[i+1];
        }

        if (lines[i].indexOf('let encode_txt;') > -1) {
            lines[i] = `      let encode_txt;var {encode} = GptEncoding.getEncodingApi("cl100k_base", () => convertTokenBytePairEncodingFromTuples(encode_data));`
        }


    }
    // Join the modified lines back into a single string
    const updatedContent = lines.join('\n');

    // Write the updated content back to the file
    fs.writeFile(filePath, updatedContent, 'utf8', err => {
        if (err) {
            console.error(err);
            return;
        }

        console.log('File updated successfully.');
    });
});
