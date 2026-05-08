from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.post('/chat')
def chat():
    msg = (request.json or {}).get('message','').lower()
    if 'chest' in msg:
        answer = 'Chest pain with breathing difficulty, sweating or radiating pain requires urgent medical evaluation. This is orientation only.'
    elif 'fever' in msg or 'cough' in msg:
        answer = 'Record temperature, SpO2, duration, risk factors and book medical review if persistent or severe.'
    else:
        answer = 'I can help with clinic workflow, symptom orientation, prescriptions, lab, pharmacy and billing. A doctor validates all clinical decisions.'
    return jsonify({'answer': answer, 'warning': 'AI assistance only, not a final diagnosis.'})

@app.post('/symptoms')
def symptoms():
    symptoms = ' '.join((request.json or {}).get('symptoms', []))
    return jsonify({'orientation':['General medical consultation','Check vitals','Doctor validation required'], 'confidence':0.72, 'input':symptoms})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001)
