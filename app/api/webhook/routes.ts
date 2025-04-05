import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export  async function POST(req: Request){
    const body = await req.text()
    const signature = (await headers()).get('Stripe-Signature') as string

    let event: Stripe.Event 


    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    }catch(e: any){
        return new NextResponse(`Error:   ${e.message}`, {status : 400, })
    }

    const session = event.data.object as Stripe.Checkout.Session
    const userId = session?.metadata?.userId
    const courseId = session?.metadata?.courseId


    if (event.type ==="checkout.session.completed"){
        if(!userId ||!courseId){
            return new NextResponse("Invalid session data", {status: 400})
        }

        await db.purchase.create({
            data: {
                userId: userId,
                courseId: courseId
            }
        })
    }else{
        return new NextResponse("Invalid event type", {status: 200})
    }

    return new NextResponse("Payment processed successfully", {status: 200})
}