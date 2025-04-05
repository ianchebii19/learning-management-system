"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
})

export default function  ProfileForm() {

    const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
   
    console.log(values)
    try{
        const response = await axios.post("/api/courses", values)
        router.push(`/teacher/courses/${response.data.id}`) 
        toast("Course title has been created.")

    }catch{
        console.log("something whent wrong")
        toast("something whent wrong.")

    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

        <h1 className="text-2xl font-medium text-gray-500 m-4">
            Name of the Course
        </h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Web Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <Button type="submit" className="bg-blue-400 hover:bg-blue-300">Submit</Button>
      </form>
    </Form>
    </div>
  )
}
