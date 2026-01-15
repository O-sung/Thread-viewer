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

      <div className="container">
        <div className="header">
          <h1>🧵 AI-Generated Threads</h1>
          <p>Ready to post to @Temi_Creept</p>
        </div>

        <div className="stats">
          <strong>{threads.length}</strong> threads ready to post
        </div>

        {loading ? (
          <div className="loading">Loading threads...</div>
        ) : threads.length === 0 ? (
          <div className="no-threads">
            <h2>⏳ No threads yet</h2>
            <p>Waiting for Twitter API approval...</p>
          </div>
        ) : (
          threads.map((thread, index) => {
            const generatedThread = JSON.parse(thread.generated_thread || '[]');
            const confidence = thread.confidence_score || 0;
            const confidenceClass = confidence >= 80 ? '' : confidence >= 60 ? 'medium' : 'low';

            return (
              <div key={index} className="thread-card">
                <div className="thread-header">
                  <div className="author">@{thread.author_username}</div>
                  <div className={`confidence ${confidenceClass}`}>
                    {confidence}% confidence
                  </div>
                </div>

                <div className="summary">
                  <strong>📝 Summary:</strong><br />
                  {thread.summary}
                </div>

                {generatedThread.map((tweet, i) => (
                  <div key={i} className="tweet">
                    <div className="tweet-number">{i + 1}</div>
                    {tweet}
                  </div>
                ))}

                <button
                  className={`copy-btn ${copiedIndex === index ? 'copied' : ''}`}
                  onClick={() => copyThread(generatedThread, index)}
                >
                  {copiedIndex === index ? '✅ Copied!' : '📋 Copy Entire Thread'}
                </button>

                <div className="timestamp">
                  Generated: {new Date(thread.created_at).toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </>
      );
}
