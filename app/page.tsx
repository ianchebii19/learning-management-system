// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">Edu</span>
          </div>
          <span className="font-bold text-xl">LearnHub</span>
        </div>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight mb-6">
          Master New Skills with Interactive Courses
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          Join thousands of students learning at their own pace with our expert-led courses. 
          Start your learning journey today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/sign-up">
              Get Started for Free
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/browse">
              Browse Courses
            </Link>
          </Button>
        </div>

        {/* Hero Image/Illustration */}
        <div className="mt-16 md:mt-24 w-full max-w-4xl">
          <div className="relative aspect-video bg-blue-100 rounded-3xl overflow-hidden border border-blue-200 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-blue-600 text-5xl mb-4">🎓</div>
                <h3 className="text-xl font-medium text-blue-900">
                  Interactive Learning Platform
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose LearnHub?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📚",
                title: "Expert Courses",
                description: "Learn from industry professionals with real-world experience."
              },
              {
                icon: "⏱️",
                title: "Self-Paced Learning",
                description: "Study on your schedule with lifetime access to materials."
              },
              {
                icon: "📈",
                title: "Track Progress",
                description: "Monitor your learning journey with detailed analytics."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 p-8 rounded-xl text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}