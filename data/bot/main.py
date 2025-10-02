import json
import requests
import numpy as np
import faiss

# === CONFIG ===
JSON_FILE = "data\\bot\\dummy_financial_data.json"  # Your JSON file path

CHUNK_SIZE = 500  # characters per chunk
TOP_K = 3         # number of chunks to retrieve


# === 1. Load and chunk JSON file ===
def load_and_chunk_json(file_path, chunk_size=500):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    text = json.dumps(data, indent=2)
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    return chunks


# === 2. Get embeddings from Cohere API ===
def get_embeddings(texts, batch_size=10):
    url = "https://api.cohere.ai/v1/embed"
    headers = {
        "Authorization": f"Bearer {COHERE_API_KEY}",
        "Content-Type": "application/json"
    }
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        data = {
            "texts": batch,
            "model": "embed-english-v3.0"  # or check your available model
        }
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        batch_embeddings = response.json()["embeddings"]
        embeddings.extend(batch_embeddings)
    return embeddings
# === 3. Create FAISS index ===
def create_faiss_index(embeddings):
    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype('float32'))
    return index


# === 4. Search top-k chunks from FAISS ===
def search_index(index, query_embedding, top_k=3):
    distances, indices = index.search(np.array([query_embedding]).astype('float32'), top_k)
    return indices[0]


# === 5. Query Groq LLaMA3-8b chat API ===
def query_groq(question, context):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    messages = [
        {
            "role": "user",
            "content": f"Use the context below to answer the question.\n\nContext:\n{context}\n\nQuestion: {question}"
        }
    ]
    data = {
        "model": "llama3-8b-8192",
        "messages": messages,
        "temperature": 0.3,
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]


def main():
    print("[+] Loading and chunking JSON...")
    chunks = load_and_chunk_json(JSON_FILE, CHUNK_SIZE)

    print(f"[+] Got {len(chunks)} chunks. Embedding with Cohere...")
    embeddings = get_embeddings(chunks)

    print("[+] Creating FAISS index...")
    faiss_index = create_faiss_index(embeddings)

    print("Ready! Ask your question (or type 'exit'):")
    while True:
        question = input("Q: ")
        if question.lower() in ('exit', 'quit'):
            break

        print("[*] Embedding your question...")
        question_emb = get_embeddings([question])[0]

        print(f"[*] Searching top {TOP_K} relevant chunks...")
        top_indices = search_index(faiss_index, question_emb, TOP_K)

        # Combine retrieved chunks as context
        context = "\n\n---\n\n".join([chunks[i] for i in top_indices])

        print("[*] Querying Groq chat API...")
        answer = query_groq(question, context)
        print(f"A: {answer}\n")


if __name__ == "__main__":
    main()
