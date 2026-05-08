from flask import Flask, request, jsonify, render_template
import os
from datetime import datetime

app = Flask(__name__)

# --- Knowledge Base ---
forward_rules = [
    ({"fever", "cough"}, "Flu"),
    ({"fever", "headache"}, "Dengue"),
    ({"stomach_pain", "vomiting"}, "Food Poisoning"),
    ({"cold", "sneezing"}, "Common Cold"),
]

backward_rules = {
    "Flu": {"fever", "cough", "cold"},
    "Dengue": {"fever", "headache"},
    "Food Poisoning": {"stomach_pain", "vomiting"},
    "Common Cold": {"cold", "sneezing"},
}

def log_to_report(user_name, message):
    """Appends a message to the user's report file."""
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    name = user_name.strip() if user_name.strip() else "Guest"
    filepath = os.path.join(output_dir, f"{name}.txt")
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")

# --- Routes ---
@app.route('/')
def home():
    # Serves the HTML file from the templates folder
    return render_template('index.html')

@app.route('/api/forward', methods=['POST'])
def forward_chaining():
    data = request.json
    user_name = data.get('username', 'Guest')
    user_symptoms = set(data.get('symptoms', []))
    
    report_lines = []
    def log(msg):
        report_lines.append(msg)
        log_to_report(user_name, msg)
        
    log(f"--- Forward Chaining ---")
    log(f"User reported symptoms: {', '.join(user_symptoms)}")
    
    diagnosis = "Unknown Disease"
    for conditions, disease in forward_rules:
        if conditions.issubset(user_symptoms):
            diagnosis = disease
            break
            
    log(f"Diagnosis Result: {diagnosis}")
    return jsonify({"diagnosis": diagnosis, "report": report_lines})

@app.route('/api/backward', methods=['POST'])
def backward_chaining():
    data = request.json
    user_name = data.get('username', 'Guest')
    disease_input = data.get('disease', '').strip()
    user_symptoms = set(data.get('symptoms', []))

    report_lines = []
    def log(msg):
        report_lines.append(msg)
        log_to_report(user_name, msg)

    log(f"--- Backward Chaining ---")
    log(f"Testing for disease: {disease_input}")
    
    disease_map = {name.lower(): name for name in backward_rules}
    
    if disease_input.lower() not in disease_map:
        log("Error: Disease not found in KB.")
        return jsonify({"result": "❌ Disease not found in knowledge base.", "report": report_lines})

    disease = disease_map[disease_input.lower()]
    required_symptoms = backward_rules[disease]
    
    if required_symptoms.issubset(user_symptoms):
        msg = f"✔ Confirmed: You match the symptoms for {disease}"
    else:
        msg = f"❌ Symptoms do not match for diagnosis: {disease}"
        
    log(f"Result: {msg}")
    return jsonify({"result": msg, "report": report_lines})

if __name__ == '__main__':
    app.run(debug=True)
