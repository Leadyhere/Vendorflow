# Mock Drive Service

def upload_file(vendor_id: str, filename: str, content: bytes):
    """
    Mock uploading a file to Google Drive.
    In a real app, this would use googleapiclient.discovery.build('drive', 'v3', ...)
    and upload to VendorFlow / [Vendor Name] / [filename]
    """
    print(f"Mock Drive: Uploaded {filename} for vendor {vendor_id} (size: {len(content)} bytes)")
    return f"https://drive.google.com/mock_file_url/{vendor_id}/{filename}"
