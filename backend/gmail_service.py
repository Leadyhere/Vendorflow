import sheets_service

def send_reminder_email(vendor_id: str, missing_docs: list):
    """
    Mock sending an email via Gmail API.
    In a real app, this builds a MIME message and calls gmail_service.users().messages().send()
    """
    vendor = sheets_service.get_vendor(vendor_id)
    if not vendor:
        return "Vendor not found"
        
    email_to = vendor["contact_email"]
    docs_str = ", ".join(missing_docs)
    
    print(f"Mock Gmail: Sent email to {email_to}")
    print(f"Subject: Action Required: Missing Onboarding Documents")
    print(f"Body: Please upload the following missing documents to continue your onboarding: {docs_str}")
    
    return f"Reminder sent to {email_to} for docs: {docs_str}"

def run_followup_job():
    """
    Cron job function to check for pending vendors > 48h and send emails.
    """
    vendors = sheets_service.get_all_vendors()
    results = []
    
    for v in vendors:
        if v["status"] == "Documents pending":
            missing_docs = [doc["name"] for doc in v["documents"] if doc["status"] == "Missing"]
            if missing_docs:
                # In a real app we'd check if created_at > 48h ago
                res = send_reminder_email(v["id"], missing_docs)
                results.append(res)
                
    return results
