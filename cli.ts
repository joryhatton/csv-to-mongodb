const readline = require('readline-sync');
const mongoose = require('mongoose');
const ProgressBar = require('progress');
const fs = require('fs');
const path = require('path');
const parseCsv = require('csv-parse/lib/sync');

const CONNECT_URL = readline.question('Connection URL:  ').trim();
const CSV_PATH = readline.question('Path to CSV:  ').trim();
const collectionName = readline.question('Collection Name:  ').trim();
const overwrite = readline.question('Overwrite Existing? (Y/n):  ');
let identifier: string;

if (overwrite == 'Y') {
  identifier = readline.question('Unique Column Name:  ').trim();
}

mongoose.connect(CONNECT_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const DB = mongoose.connection;
DB.on('error', console.error.bind(console, '*** ERROR *** \n'));
DB.once('open', ()=>{

  console.log('*** CONNECTED *** \n');
  const schema = new mongoose.Schema({ any: {} }, { strict: false });
  const Model = mongoose.model(collectionName, schema);

  const parseFile = (fileName: string): Array<any> =>{
    let filePath: string = path.join(__dirname, fileName);
    let data = fs.readFileSync(filePath, 'utf8');
    return parseCsv(data.trim(), { columns: true });
  }

  const rows = parseFile(CSV_PATH);
  let count: number = 0;
  let bar = new ProgressBar('[:bar] :percent :etas', {
    total: rows.length,
    renderThrottle: 100,
    complete: '\u001b[42m \u001b[0m'
  });

  (async function() {
    for (let row of rows) {
      count = count + 1;

      if (overwrite == 'Y') {
        let dataToFind = {};
        dataToFind[identifier] = row[identifier];
        await Model.findOneAndUpdate(dataToFind, row, { upsert: true }).exec()
      } else {
        await Model.create(row);
      }

      bar.tick();

      if (count == rows.length) {
        console.log('\n *** COMPLETE ***');
        process.exit(1);
      }
    };
  }());

});
