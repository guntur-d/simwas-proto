const express = require("express")
const cors = require("cors")
const path = require('path')
var mongoose = require('mongoose');



const app = express();


// const mongodbURI = 'mongodb://127.0.0.1/simwasda';
 


// mongoose.connect(mongodbURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");

//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });

app.use(cors());


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(__dirname + '/dist'));


app.use('/', express.static(path.join(__dirname, './')))



app.get("/", (req, res) => {

  res.sendFile(path.join(__dirname + '/dist/index.html'));

});


app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});



// app.post(
//   "/api/log/admin/anyDel",

//   controller.anyDel
// )

// app.get(
//   "/api/log/admin/anyGet",

//   controller.anyGet
// )

// app.post(
//   "/api/log/admin/anyPost",

//   controller.anyPost
// )


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});