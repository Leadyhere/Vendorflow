from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import our services
import auth
import sheets_service
import document_processor
import gemini_agent
import gmail_service
import calendar_service

load_dotenv()

app = FastAPI(title="VendorFlow API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class VendorCreate(BaseModel):
    company_name: str
    contact_email: str
    vendor_type: str

class ChatMessage(BaseModel):
    message: str

# --- Routes ---

@app.get("/")
def read_root():
    return {"status": "VendorFlow Backend Running"}

@app.get("/api/auth/login")
def login():
    """Start OAuth flow."""
    auth_url = auth.get_authorization_url()
    return {"auth_url": auth_url}

@app.get("/api/auth/callback")
def auth_callback(code: str):
    """Handle OAuth callback."""
    success = auth.handle_callback(code)
    if success:
        return {"status": "Successfully authenticated with Google."}
    raise HTTPException(status_code=400, detail="Authentication failed.")

@app.get("/api/auth/status")
def auth_status():
    return {"authenticated": auth.is_authenticated()}

@app.post("/api/vendors")
def create_vendor(vendor: VendorCreate):
    """Create a new vendor in Sheets."""
    vendor_id = sheets_service.create_vendor(vendor.dict())
    return {"vendor_id": vendor_id, "status": "Created"}

@app.get("/api/vendors")
def get_vendors():
    """List all vendors."""
    vendors = sheets_service.get_all_vendors()
    return {"vendors": vendors}

@app.get("/api/vendors/{vendor_id}")
def get_vendor(vendor_id: str):
    """Get single vendor details."""
    vendor = sheets_service.get_vendor(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@app.post("/api/vendors/{vendor_id}/upload")
async def upload_document(vendor_id: str, file: UploadFile = File(...)):
    """Upload document, extract data, update sheets."""
    # Read file content
    content = await file.read()
    
    # 1. Store in Drive (Mocked for now or implemented)
    # file_url = drive_service.upload_file(vendor_id, file.filename, content)
    
    # 2. Extract with Gemini
    extracted_data = document_processor.extract_info(content, file.filename)
    
    # 3. Update Sheets
    sheets_service.update_vendor_document(vendor_id, file.filename, extracted_data)
    
    return {"status": "uploaded", "extracted_data": extracted_data}

@app.post("/api/vendors/{vendor_id}/approve")
def approve_vendor(vendor_id: str, approver_type: str):
    """Trigger approval flow."""
    # Calendar service creates invite
    calendar_service.schedule_approval(vendor_id, approver_type)
    return {"status": f"Approval scheduled for {approver_type}"}

@app.post("/api/agent/chat")
def chat_with_agent(chat: ChatMessage):
    """Send message to Gemini agent."""
    response = gemini_agent.handle_message(chat.message)
    return {"reply": response}

@app.post("/api/run-followups")
def trigger_followups():
    """Trigger automated email follow-ups."""
    results = gmail_service.run_followup_job()
    return {"status": "completed", "results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
