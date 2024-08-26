import Navbar from '../../components/Navbar';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">About Bin to Dec</h1>
        
        <p className="text-lg mb-4">
          Hey there! Welcome to Bin to Dec, my little corner of the internet dedicated to binary and decimal conversions.
        </p>
        
        <p className="text-lg mb-4">
          I started this project for fun because I wanted to learn to recognize binary faster. This is heavily inspired by monkeytype.com. This was a hobby project so have fun, challenge your friends, and go for a high score on the leaderboard.
        </p>
      </main>
    </div>
  );
}
