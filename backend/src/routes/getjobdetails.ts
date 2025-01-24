import express from 'express'
import prisma from '../db'

const router=express.Router()
router.use(express.json())

router.get('/status',async function (req:any,res:any)
{
     console.log('insde the getjobdetails function bro')

      try 
      {
           const {jobid}=req.query

           if (!jobid)
           {
              return res.status(400).json(
                {
                    message:"invalid or missing jobid parameter"
                }
              )
           }

           const job=await prisma.job.findUnique(
            {
                where:
                {
                    id:Number(jobid)
                },
                include:
                {
                    visits:true,
                    imageResults:true
                }
            }
           )

           if (!job)
           {
               return res.status(404).json(
                {
                    message:"job not found"
                }
               )
           }

          

           const failedresult:any=job?.imageResults.filter(function (result)
        {
            return   result.status==='failed'
        })

        const completedresults=job?.imageResults.filter(function(result)
    {
        return result.status==='success'
    })

if (failedresult.length>0)
{
      return res.status(200).json(
        {
            status:"failed",
            job_id:job?.id,
            error:failedresult.map((result:any)=>({
                store_id:result.storeId,
                error:result.error|| "error while processing "
            }))
         

        }
      )
}

if (completedresults?.length===job?.imageResults.length)
{
     return res.status(200).json(
        {
             status:"comppleted",
             job_id:job?.id
        }
     )
}


return res.status(200).json(
    {
        status:"ongoing",
        job_id:job.id
    }
)





      }

      catch(error)
      {
           console.error("Error fetching job info:",error)
           res.status(500).json({error:"Internal server error"})
      }
} )

export default router