import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <Card className="mx-auto max-w-xl bg-white/80 p-8 backdrop-blur-md dark:bg-gray-900/90">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-foreground mb-4 text-4xl font-extrabold md:text-5xl">
            Welcome to Next Starter
          </CardTitle>
          <CardDescription className="text-muted-foreground mb-8 text-lg md:text-xl">
            Kickstart your Next.js project with a beautiful, modern template. Fast, flexible, and
            ready for your ideas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <a
            href="/login"
            className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          >
            Get Started
          </a>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;