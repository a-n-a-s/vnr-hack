# ✅ Imports (updated)
from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_cohere import CohereEmbeddings  # Changed to use Cohere embeddings
import os

# 🔐 API Keys


# ✅ Load saved Chroma vector DB (embedded with Cohere)
embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")  # Use a model that produces 1024-dimensional embeddings
vectorstore = Chroma(
    persist_directory="./chroma_db_finance_main/content/chroma_db_cohere_main",
    embedding_function=embeddings  # Use the correct embedding function
)
retriever = vectorstore.as_retriever()

# ✅ Use updated Groq-compatible model (Mixtral is deprecated)
llm = ChatOpenAI(
    openai_api_base="https://api.groq.com/openai/v1",
    openai_api_key=os.environ["GROQ_API_KEY"],
    model="llama-3.1-8b-instant",  # ✅ Use this or llama3-8b-8192
    temperature=0.3
)

# ✅ RetrievalQA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)


docs = retriever.invoke("What is the outstanding home loan amount?")
print(f"Number of retrieved docs: {len(docs)}")
for i, d in enumerate(docs):
    print(f"Doc #{i+1} content:\n{d.page_content}\n---")


# ❓ Ask your question
query = "Show me my credit transactions"
result = qa_chain.invoke(query)

# 🖨️ Print answer and sources
print("\nAnswer:", result["result"])
print("\nSources:")
for i, doc in enumerate(result["source_documents"]):
    print(f"Source #{i+1}:\n{doc.page_content}\n")
