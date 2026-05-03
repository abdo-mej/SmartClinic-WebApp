from http.server import BaseHTTPRequestHandler, HTTPServer
import json, re

def answer(q):
    s=q.lower()
    if any(x in s for x in ["fever","cough","flu","cold"]):
        return "Fever/cough orientation: check duration, temperature, SpO2, breathing difficulty and risk factors. Recommend medical consultation if symptoms persist or worsen. This is not a final diagnosis."
    if "chest" in s or "heart" in s:
        return "Chest pain can be urgent. Red flags include shortness of breath, sweating, fainting, radiating pain. Seek urgent medical care."
    if "appointment" in s or "rdv" in s:
        return "Appointments should be created by selecting patient and doctor by name. The system must prevent double booking."
    if "nurse" in s:
        return "Nurses can record vitals, nursing care and notes. They should not prescribe medication or validate final diagnosis."
    if "prescription" in s or "medicine" in s:
        return "Prescriptions must be created by doctors and checked for allergies, dosage and duration before dispensing."
    return "I can answer clinic-management and general medical-orientation questions. A qualified healthcare professional must validate clinical decisions."

class H(BaseHTTPRequestHandler):
    def _send(self,obj,code=200):
        self.send_response(code); self.send_header("Content-Type","application/json"); self.send_header("Access-Control-Allow-Origin","*"); self.send_header("Access-Control-Allow-Headers","Content-Type"); self.end_headers(); self.wfile.write(json.dumps(obj).encode())
    def do_OPTIONS(self): self._send({})
    def do_GET(self):
        if self.path.startswith("/health"): self._send({"status":"ok","service":"SmartClinic AI"})
        else: self._send({"message":"SmartClinic AI service"})
    def do_POST(self):
        l=int(self.headers.get("Content-Length",0)); data=json.loads(self.rfile.read(l) or b"{}")
        if self.path.startswith("/api/ai/chat"): self._send({"answer":answer(data.get("message",""))})
        elif self.path.startswith("/api/ai/symptoms"): self._send({"warning":"Orientation only, not a diagnosis.","orientations":[{"name":"General medical review recommended","confidence":0.72}]})
        else: self._send({"error":"not found"},404)

print("SmartClinic Python AI running on http://127.0.0.1:5001")
HTTPServer(("127.0.0.1",5001),H).serve_forever()
