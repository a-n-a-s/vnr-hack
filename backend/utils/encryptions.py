from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import base64
import os
import json

# Use a fixed key stored in your .env or config
# Must be 32 bytes for AES-256
ENCRYPTION_KEY = bytes.fromhex("b7895e2a9fef45c6ac8a42b19e10a81aef7bd4fd27a6d74250ab0f343f29b3cd")

def encrypt_data(data: dict) -> dict:
    iv = os.urandom(16)
    backend = default_backend()
    cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=backend)
    encryptor = cipher.encryptor()

    # Pad data to block size
    padder = padding.PKCS7(128).padder()
    json_data = json.dumps(data).encode()
    padded_data = padder.update(json_data) + padder.finalize()

    # Encrypt
    encrypted = encryptor.update(padded_data) + encryptor.finalize()

    return {
        "iv": base64.b64encode(iv).decode(),
        "encrypted_data": base64.b64encode(encrypted).decode()
    }

def decrypt_data(encrypted_data_b64: str, iv_b64: str) -> dict:
    iv = base64.b64decode(iv_b64)
    encrypted_data = base64.b64decode(encrypted_data_b64)
    backend = default_backend()
    cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=backend)
    decryptor = cipher.decryptor()

    # Decrypt and unpad
    decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    decrypted_data = unpadder.update(decrypted_padded) + unpadder.finalize()

    return json.loads(decrypted_data.decode())
