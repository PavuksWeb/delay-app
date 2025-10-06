import { useState } from 'react';
import type { Result } from './types/result';
import { fetchData } from './utils/fetchData';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [concurrency, setConcurrency] = useState<number>(0);

  const TOTAL = 1000;
  const MAX_LOG = 10;

  async function runWithConcurrency() {
    if (concurrency < 1 || concurrency > 100) {
      alert('Please, type from 1 to 100');
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setSuccessCount(0);
    setErrorCount(0);
    setResults([]);

    let index = 0;

    async function worker() {
      while (index < TOTAL) {
        const current = index++;
        try {
          const data = await fetchData(current);
          setSuccessCount((prev) => prev + 1);
          setResults((prev) => [...prev.slice(-MAX_LOG + 1), data]);
        } catch (err) {
          setErrorCount((prev) => prev + 1);
          setResults((prev) => [
            ...prev.slice(-MAX_LOG + 1),
            { index: current, delay: 0, error: err.message },
          ]);
        } finally {
          setProgress((prev) => prev + 1);
        }
      }
    }

    const workers = Array.from({ length: concurrency }, worker);
    await Promise.all(workers);
    setIsRunning(false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900">
      <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md">
        <input
          className="w-full py-2 px-4 rounded-lg border-1 border-gray-300 mb-4"
          placeholder="from 1 to 50"
          onChange={(e) => setConcurrency(Number(e.target.value))}
        />
        <button
          onClick={runWithConcurrency}
          disabled={isRunning}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium transition
            ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isRunning ? 'Running...' : 'Start'}
        </button>

        <div className="mt-4">
          <p>✅ Success: {successCount}</p>
          <p>❌ Errors: {errorCount}</p>
          <p>
            📦 Total: {progress}/{TOTAL}
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${(progress / TOTAL) * 100}%` }}
          ></div>
        </div>

        {results.length > 0 ? (
          <div className="mt-4 max-h-64 overflow-y-auto bg-gray-50 p-2 rounded">
            {results.map((r, idx) => (
              <div key={idx} className="text-sm">
                {r.error
                  ? `❌ Index: ${r.index}, ${r.error}`
                  : `✅ Index: ${r.index}, delay: ${r.delay}ms`}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
