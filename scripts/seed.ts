import { PrismaClient } from "@prisma/client";



const database = new PrismaClient()

async function main(){
    try{

        // Seed the database with sample data
        await database.category.createMany({
       
            data: [
                {name: "Technology"},
                {name: "Music"},
                {name: "Fitness"},
                {name: "Photography"},
                {name: "Accounting"},
                {name: "Engineering"},
                {name: "Filming"},
                


            ]
       
        })
          
        console.log("Categories seeded successfully")
    }catch (err){
        console.log ("Seeding error: ", err)
    } finally{
        await database.$disconnect()
    }

}

main()