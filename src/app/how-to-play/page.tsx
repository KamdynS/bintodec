import Navbar from '../../components/Navbar';

export default function HowToPlayPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">How to Play</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Game Modes</h2>
          <p className="mb-4">To start playing, select your preferred game mode on the home page:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Choose between Binary to Decimal or Decimal to Binary conversion</li>
            <li>Select the number of bits (4, 8, 16, or 32)</li>
            <li>Choose between Timer Mode or Number Mode</li>
            <li>For Timer Mode, set your preferred time limit</li>
            <li>For Number Mode, select the target number of correct guesses (5, 10, or 20)</li>
          </ul>
          <p>Once you&apos;ve selected your options, click the &quot;Start&quot; button to begin the game!</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Timer Mode</h2>
          <p>In Timer Mode, you&apos;ll have a set amount of time to make as many correct conversions as possible. Your score is the number of correct conversions you&apos;ve made at the end of the time limit.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Number Mode</h2>
          <p>In Number Mode, you&apos;ll have to reach a certain number of correct conversions within the time limit. Your score is the time it takes you to reach the target number of correct conversions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Understanding Binary</h2>
          <p className="mb-4">Binary is a base-2 number system used in computing. It consists of only two digits: 0 and 1. Here&apos;s a quick guide to binary counting:</p>
          <ul className="list-disc list-inside mb-4">
            <li>Each digit in a binary number represents a power of 2</li>
            <li>The rightmost digit represents 2^0 (1), the next 2^1 (2), then 2^2 (4), 2^3 (8), and so on</li>
            <li>To convert binary to decimal, sum the values of each &apos;1&apos; digit</li>
            <li>For example, 1010 in binary is 8 + 0 + 2 + 0 = 10 in decimal</li>
          </ul>
          <p>Practice makes perfect! The more you play, the better you&apos;ll become at quick binary-decimal conversions.</p>
        </section>
      </main>
    </div>
  );
}