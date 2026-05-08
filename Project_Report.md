# MediAI Expert
**AI-Powered Medical Diagnosis Expert System**

## 1. Project Overview
**MediAI Expert** is a web-based artificial intelligence application designed to simulate the decision-making ability of a human medical expert. The system utilizes foundational symbolic AI concepts—specifically **Forward Chaining** and **Backward Chaining**—to diagnose common ailments based on patient symptoms. 

It features a modern, interactive, and clinical user interface, ensuring a seamless experience for users while maintaining robust backend logic for rule-based inference.

## 2. System Architecture
The application follows a classic Client-Server architecture:
- **Frontend (Client-Side)**: Built with HTML5, CSS3, and Vanilla JavaScript. It provides a Single Page Application (SPA) experience using asynchronous `fetch()` API calls to prevent page reloads during the diagnostic process. The UI leverages a "glassmorphism" aesthetic with an interactive canvas background to create a premium, modern feel.
- **Backend (Server-Side)**: Developed using Python and the Flask framework. The backend maintains the Expert System's Knowledge Base, exposes RESTful API endpoints (`/api/forward` and `/api/backward`), and handles the inference engine logic.
- **Persistence Layer**: Diagnostic sessions are logged locally into text files within an `output/` directory, uniquely named after the registered patient, establishing an audit trail of the diagnostic reasoning.

## 3. Core AI Concepts Implemented
The project acts as an educational and practical implementation of an Expert System, leveraging two primary inference mechanisms:

### 3.1 Knowledge Base (KB)
The system's Knowledge Base consists of a predefined set of rules mapping symptoms to specific diseases:
- **Flu**: Fever, Cough
- **Dengue**: Fever, Headache
- **Food Poisoning**: Stomach Pain, Vomiting
- **Common Cold**: Cold, Sneezing

### 3.2 Forward Chaining (Data-Driven Inference)
In this mode, the system starts with the available data (symptoms) and applies inference rules to extract more data until a goal (diagnosis) is reached.
- **Workflow**: The user selects all symptoms they are currently experiencing. The backend evaluates these symptoms against the conditions of all known rules.
- **Logic**: If the selected symptoms form a superset or exact match of a rule's conditions (e.g., `{"fever", "cough"}.issubset(user_symptoms)`), the system confidently concludes the patient has the corresponding disease.

### 3.3 Backward Chaining (Goal-Driven Inference)
In this mode, the system starts with a hypothesis (a suspected disease) and works backward to see if the available evidence (symptoms) supports that hypothesis.
- **Workflow**: The clinical user inputs a suspected disease and verifies the presence of specific symptoms. 
- **Logic**: The backend retrieves the required symptoms for the hypothesized disease from the Knowledge Base and checks if the user's provided symptoms satisfy those requirements.

## 4. Key Features & User Flow
1. **Patient Registration**: Every session begins with the user entering the patient's name. This personalizes the interaction and links the diagnostic session log to a specific individual.
2. **Mode Selection**: Users are prompted to select their preferred diagnostic methodology (Forward or Backward chaining) based on the context of the consultation.
3. **Interactive Symptom Grid**: A clean, accessible grid allows users to toggle symptoms on and off.
4. **Real-time Processing Overlay**: A subtle loading state appears during API calls to provide immediate user feedback while the inference engine processes the rules.
5. **Comprehensive Diagnostic Report**: The final result view displays not just the final diagnosis, but a fully generated logical step-by-step report of the inference process.
6. **Session Logging**: A timestamped log of the entire diagnostic process (including the chosen mode, symptoms, hypotheses, and conclusions) is written to `output/[Patient Name].txt` for record-keeping.

## 5. UI/UX Design Aesthetics
The frontend was designed with a focus on modern web standards and high-end aesthetics:
- **Glassmorphism**: The main application view operates within a frosted "glass card" that floats over the background.
- **Dynamic Background**: An HTML5 `<canvas>` provides a subtle, interactive background animation, lending a high-tech "AI" feel to the application.
- **Typography & Color Scheme**: Clean sans-serif fonts (Inter) paired with a clinical color palette consisting of varied blues and pure whites to establish trust and professionality.

## 6. Conclusion
The **MediAI Expert** effectively models a simple but structurally sound AI Expert System. It successfully abstracts complex logical routing behind a highly polished, user-friendly interface, making it an excellent demonstration of applied logical inference and full-stack web development.
