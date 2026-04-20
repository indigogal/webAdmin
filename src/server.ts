import express from 'express'
const app = express()

const PORT = 5000;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
  console.log(new Date(Date.now()).toISOString(), "Incoming request from ", req.ip, "for ", req.path)
})


app.listen(PORT, () => {
  console.log(`Running on PORT ${PORT}`);
})

