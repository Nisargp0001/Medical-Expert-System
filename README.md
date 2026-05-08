# Medical Expert System

A Flask-based AI medical diagnosis expert system with both forward-chaining and backward-chaining inference.

This project demonstrates a rule-based expert system built in Python, a clean web frontend using Flask, and a report logging feature for user interaction. It is a strong portfolio project because it combines software development, AI concepts, and web application design.

## Features

- Python Flask web application
- Forward chaining inference from symptoms to disease
- Backward chaining inference to validate a disease using symptoms
- User report logging for each interaction
- Single-page UI with API-based symptom diagnosis

## Technology Stack

- Python 3
- Flask
- HTML/CSS/JavaScript
- Rule-based expert system logic

## Project Structure

- `app.py` — Flask application and expert system inference logic
- `templates/index.html` — Web interface for patient interaction
- `static/style.css` — Frontend styling
- `static/script.js` — Client-side behavior and API calls
- `output/` — Generated user report files

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nisargp0001/Medical-Expert-System.git
   cd Medical-Expert-System
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install Flask
   ```

## Usage

1. Run the Flask application:
   ```bash
   python app.py
   ```

2. Open a browser and visit:
   ```text
   http://localhost:5000
   ```

3. Use the web interface to:
   - Select symptoms for forward chaining diagnosis
   - Enter a disease and symptoms for backward chaining validation

4. Check the `output/` folder for generated interaction reports.

## Why this is good for your profile

- Demonstrates knowledge of Flask and full-stack Python development
- Shows an understanding of AI reasoning techniques with forward and backward chaining
- Includes practical logging/reporting and a reusable web interface
- Provides a polished portfolio-ready project that is easy to explain in interviews

## Notes

- The expert system currently uses a small knowledge base for demonstration purposes.
- The application can be extended with more symptoms, diseases, and advanced inference logic.
