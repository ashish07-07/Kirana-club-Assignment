import axios from 'axios'
import sharp from 'sharp'
const connection = {
    host: "127.0.0.1",
    port: 6379,        
  };

  async function fetchImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log("inside the fetch function")
    return Buffer.from(response.data);
  }

  

async function getImageDimensions(buffer: Buffer): Promise<{ height: number; width: number }> {
    console.log("inside the dimensionfunction")
    const { height, width } = await sharp(buffer).metadata();

    if (!height || !width) throw new Error("Could not determine image dimensions.");
    return { height, width };
  }

  async function sleepRandom(min: number, max: number) {
    console.log("inside the sleeprandom function")
    const delay = Math.random() * (max - min) + min;
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
  }
  
  
import {Worker} from "bullmq"
import prisma from "./db";
import { error } from 'console';
const worker= new Worker("jobQueue", async function (job)
{
   console.log(`the job id which we created are ${job.data.jobid}`)
   console.log(`the url is ${job.data.url}`)

   const visits=await prisma.visit.findMany(
    {
        where:
        {
             jobId:job.data.jobid
        }
    }
   )

   console.log(visits)

   for (const visit of visits)
   {
        
        for (const  url of visit.image_url)
        {
            try{
                   console.log(`now we are downlaoding the iamge baba`)

                   const iamgebuffer= await fetchImage(url);

                   const {height,width}=await getImageDimensions(iamgebuffer)

                   const perimeter= 2*(height*width)

                   console.log(`the image dimensions :height=${height}, width=${width}`)

                   console.log(`the calculated perimeter is  ${perimeter}`);

                   await sleepRandom(0.1,0.4)

                   await prisma.imageResult.create(
                    {
                        data:
                        {
                              jobId:job.data.jobid,
                              storeId:visit.store_id,
                              imageUrl:url,
                              perimeter,
                              status:"success"
                        }
                    }
                   )

                   console.log(`image processed and result stored successfully`)
                   

               }

               catch (error)
               {
                    console.log(`Failed to process iamge at ${url} `)

                    await prisma.imageResult.create(
                        {
                            data:
                            {
                                  jobId:job.data.jobid,
                                  storeId:visit.store_id,
                                  imageUrl:url,
                                  status:'failed',
                                  error:"error processsing the image"
                                  
                                  
                            }
                        }
                    )

               }



        }
   }


  

  


},{connection})
