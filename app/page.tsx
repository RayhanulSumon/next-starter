import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="relative box-border flex h-[100dvh] w-full max-w-full flex-col items-center justify-center overflow-hidden overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      <Card className="mx-auto max-h-[calc(100dvh-5rem)] max-w-xl overflow-auto bg-white/80 p-8 backdrop-blur-md dark:bg-gray-900/90">
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
    </div>
  );
};

export default Page;