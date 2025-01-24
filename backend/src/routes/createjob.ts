import express from 'express'

import prisma from '../db'
import { Job } from '@prisma/client'
import { jobqueue } from '..'
const router=express.Router()

router.use(express.json())


interface Visit{

    store_id:string,
    image_url:string[],
    visit_time:string
}

interface Storevisitpayload
{
      count:number,
      visits:Visit[]
}


router.post('/submit', async function (req:any,res:any)
{  

    try 
    {
        const body:Storevisitpayload=req.body;
        console.log(body)
    
       if (body.count!=body.visits.length)
       {
          return res.status(400).json(
            {
                error:"Please give the visits matching with count "
            }
          )
       }
    
       const job= await prisma.job.create(
        {
            data:
            {
                  count:body.count,
                  status:'ongoing',
                  
    
    
            }
        }
       )

       console.log(`created job with id ${job.id}`)
    
       const visitPromises = body.visits.map((visit) =>
        prisma.visit.create({
          data: {
            store_id: visit.store_id,
            image_url: visit.image_url,
            visit_time: visit.visit_time,
            jobId: job.id, 
          },
        })
      );
    
      await Promise.all(visitPromises);

      await jobqueue.add("imagejob",{jobid:job.id,url:"httplocalhost/3000"})

      return res.status(201).json(
        {
            job_id:job.id  
        }
      )
    }

    catch (e)
    {
          console.log(e)
          console.log(`error creating a jon and the error is ${e}`)

          return res.status(400).json(
            {
                error:e
            }
          )
    }
    
    
})


export default router