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
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
        }

        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .container::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
        }

        .header h1 {
          font-size: 36px;
          margin-bottom: 12px;
          font-weight: 800;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .header p {
          color: #94a3b8;
          font-size: 16px;
          font-weight: 500;
        }

        .stats {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: 20px;
          padding: 20px;
          color: white;
          margin-bottom: 30px;
          text-align: center;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .stats strong {
          color: #06b6d4;
          font-size: 24px;
        }

        .thread-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .thread-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.3);
        }

        .thread-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .author {
          font-weight: 700;
          color: #06b6d4;
          font-size: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .author::before {
          content: '🐦';
          font-size: 20px;
        }

        .confidence {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 6px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .confidence.medium {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .confidence.low {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .summary {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(6, 182, 212, 0.15);
          padding: 18px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 15px;
          line-height: 1.7;
          color: #e2e8f0;
        }

        .summary strong {
          color: #06b6d4;
          display: block;
          margin-bottom: 8px;
        }

        .tweet {
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.15);
          padding: 16px;
          padding-right: 50px;
          border-radius: 12px;
          margin-bottom: 12px;
          font-size: 14px;
          line-height: 1.7;
          position: relative;
          color: #cbd5e1;
          transition: all 0.2s ease;
        }

        .tweet:hover {
          background: rgba(6, 182, 212, 0.12);
          border-color: rgba(6, 182, 212, 0.25);
        }

        .tweet-number {
          position: absolute;
          top: 12px;
          right: 12px;
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
        }

        .copy-btn {
          background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          margin-top: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
          position: relative;
          overflow: hidden;
        }

        .copy-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .copy-btn:hover::before {
          left: 100%;
        }

        .copy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(6, 182, 212, 0.4);
        }

        .copy-btn:active {
          transform: translateY(0);
        }

        .copied {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4) !important;
        }

        .timestamp {
          color: #64748b;
          font-size: 13px;
          margin-top: 12px;
          font-weight: 500;
        }

        .loading,
        .no-threads {
          text-align: center;
          color: #cbd5e1;
          padding: 60px 40px;
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 20px;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .no-threads h2 {
          color: #06b6d4;
          margin-bottom: 16px;
          font-size: 28px;
        }

        .no-threads p {
          color: #94a3b8;
          font-size: 16px;
          margin-top: 12px;
        }

        @media (max-width: 600px) {
          .container {
            padding: 12px;
          }

          .header h1 {
            font-size: 28px;
          }

          .thread-card {
            padding: 18px;
          }

          .stats {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
