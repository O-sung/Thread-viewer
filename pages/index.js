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

        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .header p {
          opacity: 0.9;
          font-size: 14px;
        }

        .stats {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 15px;
          color: white;
          margin-bottom: 20px;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .thread-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .thread-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .author {
          font-weight: bold;
          color: #667eea;
          font-size: 16px;
        }

        .confidence {
          background: #4caf50;
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .confidence.medium {
          background: #ff9800;
        }

        .confidence.low {
          background: #f44336;
        }

        .summary {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          font-size: 15px;
          line-height: 1.5;
        }

        .tweet {
          background: #e3f2fd;
          padding: 12px;
          padding-right: 40px;
          border-radius: 8px;
          margin-bottom: 10px;
          font-size: 14px;
          line-height: 1.6;
          position: relative;
        }

        .tweet-number {
          position: absolute;
          top: 8px;
          right: 12px;
          background: #667eea;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }

        .copy-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          margin-top: 10px;
          transition: all 0.3s;
        }

        .copy-btn:hover {
          background: #5568d3;
        }

        .copy-btn:active {
          transform: scale(0.95);
        }

        .copied {
          background: #4caf50 !important;
        }

        .timestamp {
          color: #999;
          font-size: 12px;
          margin-top: 10px;
        }

        .loading,
        .no-threads {
          text-align: center;
          color: white;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 600px) {
          .container {
            padding: 10px;
          }

          .header h1 {
            font-size: 24px;
          }

          .thread-card {
            padding: 15px;
          }
        }
      `}</style>
        </>
    );
}
