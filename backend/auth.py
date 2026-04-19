import os
import uuid

# Mock auth state
_authenticated = False

def get_authorization_url():
    """Return a mock auth URL."""
    return f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/auth/callback?code=mock_code_123"

def handle_callback(code: str):
    """Handle mock callback."""
    global _authenticated
    if code == "mock_code_123":
        _authenticated = True
        return True
    return False

def is_authenticated():
    return _authenticated
