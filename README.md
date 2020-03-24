<p align="center">
  <a href="https://www.npmjs.com/package/csv-to-mongodb" target="_blank">
    <img alt="CSV to MongoDB" src="https://raw.githubusercontent.com/desertdisk/csv-to-mongodb/master/images/csvtomongodb.png" width="625">
  </a>
</p>

# CSV to MongoDB Importer

A simple command line utility to quickly and easily import CSV files directly into MongoDB.

### Usage

install it with:
``` bash
npm install -g csv-to-mongodb
```

then run it with:
``` bash
csv-to-mongodb
```

you will need the following data:
1. Your MongoDB primary connection string.
2. The path to your CSV file.
3. The name of the collection.
4. A unique identifier if you want to overwrite existing documents.
