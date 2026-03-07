import { useState, useRef, useCallback, useEffect } from 'react';

let pyodideInstance = null;
let loadingPromise = null;

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    // Load Pyodide from CDN — avoids bundling the 10MB WASM into the app
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    document.head.appendChild(script);

    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    });

    const py = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });

    // Install micropip for potential package installs
    await py.loadPackage('micropip');

    pyodideInstance = py;
    return py;
  })();

  return loadingPromise;
}

export function usePyodide() {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [loadError, setLoadError] = useState('');
  const pyRef = useRef(null);

  const initialize = useCallback(async () => {
    if (pyRef.current) return pyRef.current;
    setStatus('loading');
    try {
      const py = await loadPyodide();
      pyRef.current = py;
      setStatus('ready');
      return py;
    } catch (err) {
      setStatus('error');
      setLoadError(err.message);
      throw err;
    }
  }, []);

  const runCode = useCallback(async (code) => {
    const py = pyRef.current || (await initialize());

    const stdout = [];
    const stderr = [];

    // Redirect stdout and stderr
    py.setStdout({ batched: (s) => stdout.push(s) });
    py.setStderr({ batched: (s) => stderr.push(s) });

    try {
      await py.runPythonAsync(code);
      return {
        stdout: stdout.join('\n'),
        stderr: stderr.join('\n'),
        error: null,
      };
    } catch (err) {
      return {
        stdout: stdout.join('\n'),
        stderr: stderr.join('\n'),
        error: err.message,
      };
    } finally {
      // Reset to default
      py.setStdout({ batched: (s) => console.log(s) });
      py.setStderr({ batched: (s) => console.warn(s) });
    }
  }, [initialize]);

  return { status, loadError, initialize, runCode };
}
