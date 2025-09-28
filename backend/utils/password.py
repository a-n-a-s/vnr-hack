from passlib.hash import bcrypt

def hash_password(password: str) -> str:
    # Truncate password to 72 characters to comply with bcrypt limit
    truncated_password = password[:72] if len(password) > 72 else password
    return bcrypt.hash(truncated_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Truncate the plain password to match the hashing process
    truncated_password = plain_password[:72] if len(plain_password) > 72 else plain_password
    return bcrypt.verify(truncated_password, hashed_password)
