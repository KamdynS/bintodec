import Navbar from '../../components/Navbar';

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Leaderboard</h1>
        <div className="grid gap-2">
          {[
            { name: 'Player 1', score: 100, time: 45 },
            { name: 'Player 2', score: 95, time: 52 },
            { name: 'Player 3', score: 90, time: 58 },
          ].map((player, index) => (
            <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted rounded-lg p-4">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-muted-foreground text-sm">Score: {player.score} | Time: {player.time}s</div>
              </div>
              <div className="font-medium">{index + 1}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
