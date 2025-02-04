# API Testing Guide

This guide provides examples of how to test the sentiment analysis API using different methods.

## API Endpoint

- URL: `http://localhost:3000/analyze`
- Method: POST
- Content-Type: application/json

## Using curl

### Windows Command Prompt
```bash
curl -X POST http://localhost:3000/analyze -H "Content-Type: application/json" -d "{\"text\":\"This movie was fantastic!\",\"model\":\"custom\"}"
```

### Windows PowerShell
```powershell
curl -X POST http://localhost:3000/analyze -H "Content-Type: application/json" -d '{\"text\":\"This movie was fantastic!\",\"model\":\"custom\"}'
```

### Linux/Mac Terminal
```bash
curl -X POST http://localhost:3000/analyze \
-H "Content-Type: application/json" \
-d '{"text":"This movie was fantastic!","model":"custom"}'
```

Expected Response:
```json
{
    "sentiment": "positive",
    "confidence": 0.95
}
```

### Test Llama Model
```bash
curl -X POST http://localhost:3000/analyze \
-H "Content-Type: application/json" \
-d '{"text": "I really hated this movie.", "model": "llama"}'
```

Expected Response:
```json
{
    "sentiment": "negative",
    "confidence": 0.89
}
```

## Using Python requests

```python
import requests

API_URL = "http://localhost:3000/analyze"

def test_sentiment(text, model):
    response = requests.post(API_URL, json={
        "text": text,
        "model": model
    })
    return response.json()

# Test custom model
positive_text = "This movie was fantastic!"
result = test_sentiment(positive_text, "custom")
print("Custom model result:", result)

# Test llama model
negative_text = "I really hated this movie."
result = test_sentiment(negative_text, "llama")
print("Llama model result:", result)
```

## Using Postman

1. Create a new POST request
   - URL: `http://localhost:3000/analyze`

2. Set Headers:
   - Key: `Content-Type`
   - Value: `application/json`

3. Set Body (raw JSON):
```json
{
    "text": "This movie was fantastic!",
    "model": "custom"
}
```

### Example Test Cases

Test both models with these example texts:

Positive Examples:
- "This movie was absolutely fantastic!"
- "I love how the characters developed throughout the story."
- "The performance was outstanding and memorable."

Negative Examples:
- "This was the worst movie I've ever seen."
- "I couldn't even finish watching it, terrible plot."
- "The acting was incredibly poor and unconvincing."

## Error Handling

The API returns appropriate error messages for:
- Empty text
- Invalid model selection
- Server errors

Example error response:
```json
{
    "error": "Internal server error",
    "message": "Failed to get response from model"
}
```
