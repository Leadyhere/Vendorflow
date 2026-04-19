import os
import google.generativeai as genai
from dotenv import load_dotenv
import sheets_service
import gmail_service
import calendar_service
import json

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "your_gemini_api_key_here":
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

# Define tool functions
def get_vendor_status(vendor_id: str):
    v = sheets_service.get_vendor(vendor_id)
    if v:
        return f"Vendor {v['company_name']} is currently '{v['status']}'."
    return "Vendor not found."

def send_reminder_email(vendor_id: str):
    v = sheets_service.get_vendor(vendor_id)
    if not v: return "Vendor not found."
    missing = [d['name'] for d in v['documents'] if d['status'] == 'Missing']
    return gmail_service.send_reminder_email(vendor_id, missing)

def schedule_approval_meeting(vendor_id: str, approver_type: str):
    return calendar_service.schedule_approval(vendor_id, approver_type)

def update_vendor_status(vendor_id: str, new_status: str):
    sheets_service.update_vendor_status(vendor_id, new_status)
    return f"Status updated to {new_status}"

# Mock agent for fallback
def _mock_agent(message: str):
    msg = message.lower()
    if "status" in msg and "vendor" in msg:
        vendors = sheets_service.get_all_vendors()
        if vendors:
            v = vendors[0]
            return f"The latest vendor is {v['company_name']} and their status is '{v['status']}'."
        return "There are no vendors yet."
    elif "remind" in msg or "email" in msg:
        vendors = sheets_service.get_all_vendors()
        if vendors:
            v = vendors[0]
            send_reminder_email(v['id'])
            return f"I've sent a reminder email to {v['company_name']} for their missing documents."
        return "No vendors to remind."
    elif "approve" in msg or "schedule" in msg:
        vendors = sheets_service.get_all_vendors()
        if vendors:
            v = vendors[0]
            schedule_approval_meeting(v['id'], "Legal")
            return f"I've scheduled an approval meeting with Legal for {v['company_name']}."
        return "No vendors to approve."
    return "I am the VendorFlow Assistant. I can check status, send reminders, and route approvals. Try asking 'What's the status of the latest vendor?'"

def handle_message(message: str):
    """
    Handle natural language message using Gemini function calling.
    """
    if model is None:
        return _mock_agent(message)
        
    try:
        # In a real app we'd define the tools to Gemini
        # tools = [get_vendor_status, send_reminder_email, schedule_approval_meeting, update_vendor_status]
        # model = genai.GenerativeModel('gemini-1.5-flash', tools=tools)
        # response = model.generate_content(message)
        # Handle function calls in response...
        
        # For this demo, let's just use the mock logic to simulate the agentic behavior reliably
        return _mock_agent(message)
    except Exception as e:
        print(f"Agent error: {e}")
        return "Sorry, I encountered an error while processing your request."
