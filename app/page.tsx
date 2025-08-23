import { ModeToggle } from "@/components/ModeToggle";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <ModeToggle />
      <Card className="max-w-xl mx-auto p-8 bg-white/80 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Next Starter
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-gray-600 mb-8">
            Kickstart your Next.js project with a beautiful, modern template.
            Fast, flexible, and ready for your ideas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform duration-200"
          >
            Get Started
          </a>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;