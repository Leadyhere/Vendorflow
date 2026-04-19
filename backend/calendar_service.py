import sheets_service
import datetime

def schedule_approval(vendor_id: str, approver_type: str):
    """
    Mock scheduling a Google Calendar event for approval.
    """
    vendor = sheets_service.get_vendor(vendor_id)
    if not vendor:
        return "Vendor not found"
        
    company_name = vendor["company_name"]
    # Usually approver email would be looked up based on type (Legal, Finance)
    approver_email = f"{approver_type.lower()}_approver@company.com"
    
    print(f"Mock Calendar: Scheduled meeting with {approver_email} for vendor {company_name}")
    
    # Update vendor status to reflect approval routing
    sheets_service.update_vendor_status(vendor_id, f"Pending {approver_type} Approval")
    
    return True
