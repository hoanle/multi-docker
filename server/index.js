const keys = require('./keys')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient.on('connect', () => {
  pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log(err));
});

console.log(`keys.redisHost ${keys.redisHost}`);

//Redis client set up
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

redisClient.on("error", function(error) {
  console.error(`error1 ${error}`);
});

redisClient.set('visits', 0);

const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
  redisClient.get('visits', (err, visits) => {
        if (err) res.err(err);
        res.send(`Number of visits: ${visits}`);
        redisClient.set('visits', parseInt(visits) + 1);
    })
})

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');
  res.send(values.rows);
})

app.get('/values/current', async (req, res) => {
  console.log(`/values/current`);

  redisClient.hgetall('values', (err, values) => {
    if (err) {
      console.log(`values1 ${err}`);
      res.send(err);
    } else {
      for(let k  in values) {
        console.log(` ${k}:${values[k]}`);
      }
      res.send(values);
    }

  });
})

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(5000, err => {
  console.log('Listening to port 5000');
})
