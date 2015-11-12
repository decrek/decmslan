- `brew update`
- `brew install mongodb`
- `npm install`
- Set `MONGO_URL` as your MongoDB URL in `/app/core/mongoose.js`
- `mkdir -p db` create db folder
- ```sudo chown -R `id -u` db``` set permissions

- `mongo` to start mongo shell
- `use decmslan` switch to db

- `npm run mongo` to start db
- `npm run develop` with watcher
- `npm run serve` without watcher

- `mongorestore --db decmslan dump/decmslan` to import db
- `mongodump --db decmslan` to export db
- `db.dropDatabase();` delete database
