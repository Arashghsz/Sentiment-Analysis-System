import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaHistory, FaCheck, FaTimes } from 'react-icons/fa';
import { BiAnalyse } from 'react-icons/bi';
import { MdSentimentSatisfied, MdSentimentDissatisfied } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const AppContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #1a365d;
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4299e1;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3182ce;
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.sentiment === 'positive' ? '#c6f6d5' : '#fed7d7'};
  border: 2px solid ${props => props.sentiment === 'positive' ? '#68d391' : '#feb2b2'};
`;

const LoadingSpinner = styled(AiOutlineLoading3Quarters)`
  animation: spin 1s linear infinite;
  font-size: 24px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HistoryContainer = styled.div`
  margin-top: 32px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HistoryTitle = styled.h2`
  color: #1a365d;
  font-size: 1.5rem;
  margin-bottom: 16px;
`;

const HistoryItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${props => props.sentiment === 'positive' ? '#f0fff4' : '#fff5f5'};
  border: 1px solid ${props => props.sentiment === 'positive' ? '#9ae6b4' : '#feb2b2'};
`;

const HistoryText = styled.p`
  margin: 4px 0;
  color: #4a5568;
  font-size: 0.9rem;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  vertical-align: middle;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

function App() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('custom');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Sending request:', { text, model }); // Add logging

      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ text, model }),
      });

      const data = await response.json();
      console.log('Received response:', data); // Add logging

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Analysis failed');
      }

      setResult(data);
      
      // Add to history
      setHistory(prev => [{
        text,
        model,
        result: data,
        timestamp: new Date().toLocaleString()
      }, ...prev].slice(0, 10)); // Keep only last 10 entries
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Card>
        <Title>
          <IconWrapper><BiAnalyse size={32} /></IconWrapper>
          Sentiment Analysis
        </Title>
        <Form onSubmit={handleSubmit}>
          <TextArea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here for analysis..."
            required
          />
          <Select 
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="custom">🤖 Custom Model</option>
            <option value="llama">🦙 Llama 3</option>
          </Select>
          <Button type="submit" disabled={loading || !text.trim()}>
            <ButtonContent>
              {loading ? <LoadingSpinner /> : <FaSearch />}
              {loading ? 'Analyzing...' : 'Analyze Sentiment'}
            </ButtonContent>
          </Button>
        </Form>

        {error && (
          <ResultContainer sentiment="negative">
            <IconWrapper><FaTimes color="#e53e3e" size={20} /></IconWrapper>
            <p style={{ color: '#c53030' }}>{error}</p>
          </ResultContainer>
        )}

        {result && !error && (
          <ResultContainer sentiment={result.sentiment}>
            <h3 style={{ marginBottom: '8px' }}>
              <IconWrapper>
                {result.sentiment === 'positive' 
                  ? <MdSentimentSatisfied size={24} color="#38a169" />
                  : <MdSentimentDissatisfied size={24} color="#e53e3e" />
                }
              </IconWrapper>
              Analysis Result:
            </h3>
            <p><strong>Sentiment:</strong> {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}</p>
            <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          </ResultContainer>
        )}
      </Card>

      {history.length > 0 && (
        <HistoryContainer>
          <HistoryTitle>
            <IconWrapper><FaHistory size={24} /></IconWrapper>
            Analysis History
          </HistoryTitle>
          {history.map((item, index) => (
            <HistoryItem key={index} sentiment={item.result.sentiment}>
              <HistoryText>
                <IconWrapper>
                  {item.result.sentiment === 'positive' 
                    ? <MdSentimentSatisfied size={16} />
                    : <MdSentimentDissatisfied size={16} />
                  }
                </IconWrapper>
                <strong>Text:</strong> {item.text}
              </HistoryText>
              <HistoryText>
                <IconWrapper>{item.model === 'custom' ? '🤖' : '🦙'}</IconWrapper>
                <strong>Model:</strong> {item.model}
              </HistoryText>
              <HistoryText>
                <IconWrapper><FaCheck size={16} /></IconWrapper>
                <strong>Result:</strong> {item.result.sentiment} 
                ({(item.result.confidence * 100).toFixed(2)}%)
              </HistoryText>
              <HistoryText>
                <IconWrapper>🕒</IconWrapper>
                <strong>Time:</strong> {item.timestamp}
              </HistoryText>
            </HistoryItem>
          ))}
        </HistoryContainer>
      )}
    </AppContainer>
  );
}

export default App;
