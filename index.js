const express = require('express');

const app=express();
const port = 3000;

const cors = require('cors')
app.use(cors())
app.use(express.json());

const rootRouter = require('./routes/index')
app.use('/api/v1',rootRouter);


app.listen(port,()=>{
    console.log(`Server is up and Running on port ${port} `);
})