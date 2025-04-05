export default function LoginLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <div className="flex h-screen">
        {/* Left section - Hidden on small screens */}
        <div className="hidden lg:flex items-center justify-center bg-black lg:w-1/2 h-full">
          <div className="max-w-md space-y-6 text-center text-primary-foreground">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Welcome to Ramon Courses
            </h1>
          </div>
        </div>
  
        {/* Right section - Always visible */}
        <div className="flex flex-1 flex-col w-full lg:w-1/2 mx-auto py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    );
  }
  