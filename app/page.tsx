import { ModeToggle } from "@/components/ModeToggle";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <ModeToggle />
      <Card className="mx-auto max-w-xl bg-white/80 p-8 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Welcome to Next Starter
          </CardTitle>
          <CardDescription className="mb-8 text-lg text-gray-600 md:text-xl">
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
