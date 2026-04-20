import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Bucket, S3Client } from '@aws-sdk/client-s3';
import express from 'express'
import { CreateBucket, ListBuckets } from './s3';
import { ListTables, CreateTable } from './dynamo'

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
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
  try {
    const buckets = await ListBuckets(S3client)
    res.status(200).json({ buckets: buckets })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to list buckets' })
  }
})

app.get('/s3/create', async (req, res) => {
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
  try {
    const output = await CreateBucket(S3client)
    console.dir(output)
    res.status(200).json(output)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error While creating bucket" })
  }
})

app.get('/dynamo/create', async (req, res) => {
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
  try {
    const output = await CreateTable(DynamoClient)
    console.dir(output)
    res.status(200).json({ creationOutput: output })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error while creating table" })
  }
})

app.get('/dynamo/list', async (req, res) => {
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
  try {
    const tableArray = await ListTables(DynamoClient)
    console.dir("Tables: ", tableArray)
    res.status(200).json({ tables: tableArray })
  } catch (error) {
    res.status(500).json({ error: "Error while fetching tables" })
  }
})

app.get('/ec2/create', async (req, res) => {
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
})


app.get('/ec2/list', async (req, res) => {
  //TODO: 
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on PORT ${PORT}`);
})

