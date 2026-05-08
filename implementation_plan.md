# Implementation Plan

## Goal
Create a highly professional, single-page web application frontend for the existing Python (Flask) AI Medical Diagnosis Expert System. The frontend will feature a clinical light mode design with a glassmorphism UI, a custom HTML5 Canvas interactive gravity background, and seamless API integration for both Forward and Backward chaining.

## User Review Required
- The design will be primarily driven by HTML, CSS, and Vanilla JS as requested. 
- I will hardcode the symptoms based on the knowledge base defined in [app.py](file:///d:/Medical_expert_project/app.py) (Fever, Cough, Headache, Vomiting, Stomach Paining, Cold, Sneezing). 
- I will create a minimalist SVG logo directly in the HTML.

## Proposed Changes

### Frontend UI and Logic
#### [MODIFY] [index.html](file:///d:/Medical_expert_project/templates/index.html)
- Overwrite the current default template with the new single-page application structure.
- Add Patient Registration input.
- Add elegant toggle buttons for "Forward Chaining" and "Backward Chaining".
- Add a clean grid of stylized checkboxes for symptoms.
- Add a visually distinct "Results" box containing the success message.
- Add `<canvas id="bg-canvas">` for the interactive background.
- Link to new `style.css` and `script.js`.

#### [NEW] [style.css](file:///d:/Medical_expert_project/static/style.css)
- Implement clinical light mode theme (whites, soft blues, muted greys).
- Create glassmorphism styles for main UI cards (`backdrop-filter: blur(10px)`, semi-transparent white backgrounds).
- Style the symptom grid, toggles, form inputs, and buttons to be modern and premium.
- Add CSS animations for the loading spinner.

#### [NEW] [script.js](file:///d:/Medical_expert_project/static/script.js)
- **Canvas Gravity Background**: Implement a physics simulation for medical icons (cross, DNA, stethoscope) that float, fall gently, and react to mouse movement with low opacity (10-15%).
- **UI Flow**: Manage state transitions (e.g., hiding backward chaining inputs when forward chaining is selected). Ensure "Patient Name" is captured first.
- **API Fetch**: Implement `fetch()` calls to `/api/forward` and `/api/backward`. Send the required payload `{"username": "value", "symptoms": ["list"], "disease": "value"}`. Manage loading spinners and display results.

## Verification Plan

### Manual Verification
1. Start the Flask server by running `python app.py`.
2. Open the browser to `http://localhost:5000`.
3. Verify the canvas background icons are floating and react to mouse movements.
4. Test Patient Registration by entering a name.
5. Test **Forward Chaining**: Select symptoms (e.g., Fever, Cough) and submit. Verify a loading spinner appears, followed by the "Flu" diagnosis and the required success message about the report being saved.
6. Test **Backward Chaining**: Switch mode, enter a disease (e.g., Dengue), select matching symptoms, and submit. Verify the validation message.
7. Verify visually that the UI is clinical, modern, uses glassmorphism, and matches the requested aesthetic.
