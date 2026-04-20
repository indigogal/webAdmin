import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Bucket, S3Client } from '@aws-sdk/client-s3';
import express from 'express'
import './dynamo'
import { ListBuckets } from './s3';

const app = express()

const REGION = "us-east-1";
const PORT = 5000;

const S3client = new S3Client({ region: REGION })
const DynamoClient = new DynamoDBClient({ region: REGION })

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
})

app.get('/s3/list', async (req, res) => {
  try {
    const buckets = await ListBuckets(S3client)
    res.json({ buckets: buckets })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to list buckets' })
  }
})

app.get('/s3/create', (req, res) => {
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on PORT ${PORT}`);
})

