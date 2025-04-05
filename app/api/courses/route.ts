import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request){
 try{
    const { userId } = await auth()
     const { title } = await req.json()

     if (!userId){
        return new NextResponse("Unauthorized" , { status: 401})
     }
     const course = await db.course.create({
        data: {
            title,
            userId,// Using userId as a temporary value
        }
     })
     return NextResponse.json(course, { status: 201 })
     
 } catch (err) {
     console.error(err)
      return new NextResponse("Internal Server Error", { status: 500 })
 }
}
