const express = require('express'),
  app = express(),
  fs = require('fs'),
  shell = require('shelljs'),

   // Modify the folder path in which responses need to be stored
  folderPath = './Responses/',
  defaultFileExtension = 'json', // Change the default file extension
  bodyParser = require('body-parser'),
  DEFAULT_MODE = 'writeFile',
  path = require('path');

// Create the folder path in case it doesn't exist
shell.mkdir('-p', folderPath);

 // Change the limits according to your response size
app.use(bodyParser.json({limit: '500mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.post('/write', (req, res) => {
  let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || DEFAULT_MODE,
    uniqueIdentifier = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filename = `${req.body.requestName}${uniqueIdentifier || ''}`,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    options = req.body.options || undefined;

  var isFirstTime = req.body.isFirstTime;
  var flag = fsMode === 'writeFile' || isFirstTime ? 'w' : 'a';
  var stream = fs.createWriteStream(filePath, {flags: flag});
  stream.on('error', function(err) {
    console.error(`Error writing the file ${filePath}: ${err}`);
  });
  stream.write(req.body.responseData);
  stream.end();
});

app.listen(3000, () => {
  console.log('ResponsesToFile App is listening now! Send them requests my way!');
  console.log(`Data is being stored at location: ${path.join(process.cwd(), folderPath)}`);
});