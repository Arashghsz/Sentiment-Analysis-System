# Sentiment Analysis System

## Technical Assignment: Sentiment Analysis System with Custom Fine-Tuned Model and Llama 3 Models

### Objective
This project involves fine-tuning a sentiment analysis model on the IMDB dataset, saving and uploading the model to Hugging Face, and testing it alongside the pre-trained Llama 3 model via the Groq Cloud API. The project also includes designing systems, testing models, and submitting a GitHub repository and a YouTube video link.

### Steps and Tasks

#### Part 1: Dataset Preparation and Fine-Tuning
1. **Download the IMDB Dataset**
   - Use the IMDB dataset from Kaggle: `/kaggle/input/imdb-dataset/IMDB Dataset.csv`.
   - Load the dataset using Pandas and verify it in your notebook.

2. **Data Preprocessing**
   - Clean and preprocess the dataset:
     - Encode the sentiment column (positive -> 1, negative -> 0).
     - Retain only the review and label columns.
   - Split the data into training, validation, and testing sets.

3. **Model Selection and Tokenization**
   - Select a pre-trained Hugging Face transformer model for fine-tuning (e.g., `distilbert-base-uncased`).
   - Tokenize the dataset with:
     - Truncation.
     - Padding.
     - Maximum sequence length of 256.

4. **Fine-Tune the Model**
   - Fine-tune the model on the IMDB dataset for 2 epochs using the Hugging Face Trainer.
   - Set training parameters:
     - Learning rate: 5e-5 or your own.
     - Batch size: 16 or 32.
     - Evaluation at the end of each epoch.
   - Ensure that metrics like accuracy, precision, recall, and F1-score are logged during training.

5. **Save and Upload the Model to Hugging Face**
   - Save the fine-tuned model and tokenizer locally using `save_pretrained()`.
   - Log in to Hugging Face using `notebook_login`.
   - Upload the model to Hugging Face using `push_to_hub`.
   - Verify the model on Hugging Face Hub and include the link in your notebook.

#### Part 2: API Development and Testing
6. **Set Up the Backend API**
   - Use FastAPI or Flask to create an API.
   - Define a POST endpoint (`/analyze/`) that:
     - Accepts:
       - `text`: The input text for sentiment analysis.
       - `model`: A parameter specifying the model to use (custom or llama).
     - Returns:
       - Sentiment (positive or negative).
       - Confidence score.

7. **Load Models**
   - Load the fine-tuned model from Hugging Face.
   - Access the Llama 3 model using the Groq Cloud API.

8. **Test the API Locally**
   - Test the `/analyze/` endpoint with both models (custom and llama) using:
     - Postman.
     - curl.
     - Python requests.

9. **Define the Llama 3 Prompt**
   - Write a clear and reusable prompt for the Llama 3 model in Groq Cloud.
   - Example: "Classify the sentiment of this text as positive or negative: 'This movie was fantastic'".

10. **Test with Both Models**
    - Verify that the API works for both the fine-tuned model and the Llama 3 model.
    - Ensure the results return the sentiment score too.

#### Part 3: UI Design and Explanation
11. **React UI Design**
    - A text input field for user input.
    - A dropdown menu for model selection:
      - Custom Model.
      - Llama 3.
    - A button labeled "Analyze Sentiment" to send input and selected model to the backend API.
    - A result display section showing:
      - Sentiment (positive or negative).
      - Confidence score (optional).

12. **Submit GitHub Repository**
    - Upload all code (notebook, backend, and UI explanation) to a public GitHub repository.
    - Include a README.md file that explains how to:
      - Install dependencies.
      - Run the notebook and API locally.
      - Use the endpoints.

13. **Record a YouTube Demo Video**
    - Record a demo video (2-3 minutes) showing:
      - Testing the system with both models (custom and llama).
      - One question with custom fine-tuned model and one with Llama 3.
    - Upload the video to YouTube and include the link in your notebook.
