import uuid
import datetime

# In-memory mock database (since we want it to run without actual Sheets API for demo)
# In a real app, this would use google-api-python-client to update a spreadsheet
DB = {
    "vendors": [
        {
            "id": "v-1",
            "company_name": "Acme Corp",
            "contact_email": "hello@acme.com",
            "vendor_type": "IT",
            "status": "Documents pending",
            "created_at": "2024-05-01T10:00:00Z",
            "documents": [
                {"name": "GST Certificate", "status": "Missing", "extracted_data": None},
                {"name": "Bank Details", "status": "Missing", "extracted_data": None},
                {"name": "Cyber Liability Insurance", "status": "Missing", "extracted_data": None},
                {"name": "SOC2/ISO Cert", "status": "Missing", "extracted_data": None},
                {"name": "NDA", "status": "Missing", "extracted_data": None}
            ]
        },
        {
            "id": "v-2",
            "company_name": "Global Supplies Ltd",
            "contact_email": "sales@globalsupplies.com",
            "vendor_type": "Goods",
            "status": "Under review",
            "created_at": "2024-05-15T12:30:00Z",
            "documents": [
                {"name": "GST Certificate", "status": "Received", "extracted_data": {"Valid": True, "Expiry": "2025-12-31"}},
                {"name": "Bank Details", "status": "Received", "extracted_data": {"Valid": True}},
                {"name": "Product Liability Insurance", "status": "Received", "extracted_data": {"Valid": True, "Expiry": "2024-11-01"}},
                {"name": "Quality Certifications", "status": "Received", "extracted_data": {"Valid": True}}
            ]
        }
    ]
}

def _get_checklist(vendor_type: str):
    if vendor_type.lower() == "goods":
        return ["GST Certificate", "Bank Details", "Product Liability Insurance", "Quality Certifications"]
    elif vendor_type.lower() == "services":
        return ["GST Certificate", "Bank Details", "Professional Indemnity Insurance", "Service Agreement"]
    else: # IT
        return ["GST Certificate", "Bank Details", "Cyber Liability Insurance", "SOC2/ISO Cert", "NDA"]

def create_vendor(vendor_data: dict):
    vendor_id = f"v-{str(uuid.uuid4())[:8]}"
    checklist = _get_checklist(vendor_data["vendor_type"])
    
    docs = [{"name": doc, "status": "Missing", "extracted_data": None} for doc in checklist]
    
    new_vendor = {
        "id": vendor_id,
        "company_name": vendor_data["company_name"],
        "contact_email": vendor_data["contact_email"],
        "vendor_type": vendor_data["vendor_type"],
        "status": "Documents pending",
        "created_at": datetime.datetime.now().isoformat() + "Z",
        "documents": docs
    }
    DB["vendors"].append(new_vendor)
    return vendor_id

def get_all_vendors():
    # order by created_at desc
    return sorted(DB["vendors"], key=lambda x: x["created_at"], reverse=True)

def get_vendor(vendor_id: str):
    for v in DB["vendors"]:
        if v["id"] == vendor_id:
            return v
    return None

def update_vendor_status(vendor_id: str, new_status: str):
    for v in DB["vendors"]:
        if v["id"] == vendor_id:
            v["status"] = new_status
            return True
    return False

def update_vendor_document(vendor_id: str, doc_name: str, extracted_data: dict):
    vendor = get_vendor(vendor_id)
    if not vendor: return False
    
    # Try to match the uploaded filename to our checklist
    # Real app would use Gemini to map it, we'll just update the first missing one or matching one
    doc_type = extracted_data.get("document_type", "Unknown Document")
    
    # Simple mapping
    for doc in vendor["documents"]:
        # If the gemini extracted doc_type is similar to our checklist item
        if doc_type.lower() in doc["name"].lower() or doc["name"].lower() in doc_type.lower() or doc["status"] == "Missing":
            doc["status"] = "Received"
            doc["extracted_data"] = extracted_data
            
            # Check if all received
            all_received = all(d["status"] == "Received" for d in vendor["documents"])
            if all_received:
                update_vendor_status(vendor_id, "Under review")
                
            return True
            
    # If no match, add as extra document
    vendor["documents"].append({
        "name": doc_type,
        "status": "Received",
        "extracted_data": extracted_data
    })
    return True
