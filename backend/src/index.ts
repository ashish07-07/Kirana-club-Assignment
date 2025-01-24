import express from 'express'
import createjob from './routes/createjob'
import getjobstatus from './routes/getjobdetails'
import { Queue } from 'bullmq'
const app=express()
app.use(express.json())
const PORT=3000
let connection=45;
export const jobqueue= new Queue("jobQueue");

app.use('/api',createjob)

app.use('/jobapi',getjobstatus)

app.listen(PORT, function ()
{
      console.log(` server listening on port ${PORT}`)
})