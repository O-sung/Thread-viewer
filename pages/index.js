import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/threads');
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyThread = (thread, index) => {
    const text = thread.join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <Head>
        <title>Twitter Threads - @Temi_Creept</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-850 to-slate-950 p-5 relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-sky-500/8 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="text-center text-white mb-10 max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent tracking-tight">
            🧵 AI-Generated Threads
          </h1>
          <p className="text-slate-400 text-base font-medium">
            Ready to post to @Temi_Creept
          </p>
        </div>

        {/* Stats */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-5 text-white mb-8 text-center max-w-4xl mx-auto relative z-10 shadow-2xl shadow-black/30">
          <strong className="text-cyan-400 text-2xl">{threads.length}</strong> threads ready to post
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-slate-300 py-16 px-10 bg-slate-850/60 backdrop-blur-xl border border-slate-700/10 rounded-2xl max-w-4xl mx-auto relative z-10">
            Loading threads...
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center text-slate-300 py-16 px-10 bg-slate-850/60 backdrop-blur-xl border border-slate-700/10 rounded-2xl max-w-4xl mx-auto relative z-10">
            <h2 className="text-cyan-400 mb-4 text-3xl font-bold">⏳ No threads yet</h2>
            <p className="text-slate-400 text-base mt-3">Waiting for Twitter API approval...</p>
          </div>
        ) : (
          threads.map((thread, index) => {
            const generatedThread = JSON.parse(thread.generated_thread || '[]');
            const confidence = thread.confidence_score || 0;
            const confidenceClass = confidence >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/30' :
              confidence >= 60 ? 'bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-500/30' :
                'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30';

            return (
              <div key={index} className="bg-slate-850/80 backdrop-blur-xl border border-slate-700/10 rounded-2xl p-6 mb-6 shadow-2xl shadow-black/40 max-w-4xl mx-auto relative z-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/15 hover:border-cyan-500/30">
                {/* Header */}
                <div className="flex justify-between items-center mb-5 pb-5 border-b border-slate-700/10">
                  <div className="font-bold text-cyan-400 text-lg flex items-center gap-2">
                    <span>🐦</span>
                    <span>@{thread.author_username}</span>
                  </div>
                  <div className={`${confidenceClass} text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg`}>
                    {confidence}% confidence
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-950/60 border border-cyan-500/15 p-5 rounded-xl mb-5 text-sm leading-relaxed text-slate-200">
                  <strong className="text-cyan-400 block mb-2">📝 Summary:</strong>
                  {thread.summary}
                </div>

                {/* Tweets */}
                {generatedThread.map((tweet, i) => (
                  <div key={i} className="bg-cyan-500/8 border border-cyan-500/15 p-4 pr-14 rounded-xl mb-3 text-sm leading-relaxed relative text-slate-300 transition-all duration-200 hover:bg-cyan-500/12 hover:border-cyan-500/25">
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-cyan-400 to-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-cyan-500/40">
                      {i + 1}
                    </div>
                    {tweet}
                  </div>
                ))}

                {/* Copy Button */}
                <button
                  className={`${copiedIndex === index
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-emerald-500/40'
                    : 'bg-gradient-to-r from-cyan-400 to-sky-500 shadow-cyan-500/30 hover:-translate-y-0.5 hover:shadow-cyan-500/40'
                    } text-white border-none py-3.5 px-7 rounded-full text-sm font-bold cursor-pointer w-full mt-4 transition-all duration-300 shadow-lg relative overflow-hidden group`}
                  onClick={() => copyThread(generatedThread, index)}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  {copiedIndex === index ? '✅ Copied!' : '📋 Copy Entire Thread'}
                </button>

                {/* Timestamp */}
                <div className="text-slate-500 text-xs mt-3 font-medium">
                  Generated: {new Date(thread.created_at).toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
