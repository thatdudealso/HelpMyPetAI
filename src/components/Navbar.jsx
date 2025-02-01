import React, { useState } from 'react';
import axios from 'axios';

const CodeInput = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const handleAnalyze = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { code });
      setOutput(res.data.analysis);
    } catch (err) {
      console.error(err);
      setOutput('An error occurred while analyzing the code.');
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center">
          <h2>Code Analyzer</h2>
        </div>
        <div className="card-body">
          <textarea
            className="form-control mb-3"
            rows="8"
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
          <div className="text-center">
            <button onClick={handleAnalyze} className="btn btn-primary btn-lg">
              Analyze Code
            </button>
          </div>
          {output && (
            <div className="mt-4 p-3 bg-light rounded shadow-sm">
              <h4>Analysis Output:</h4>
              <pre className="bg-white p-3 rounded">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeInput;