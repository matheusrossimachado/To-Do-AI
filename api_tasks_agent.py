from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import (
    BaseChatMessageHistory,
    InMemoryChatMessageHistory,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo e prompt
model = Ollama(model="mistral:7b")

prompt_inicial = (
    "you are an assistance bot, that helps people with doubts about their taks, you will receive tasks on history_tasks and have to answer questions about them."
    "you can not create any task, edit or delete"
    "be helpful and nice to the users"
    "wait for the answers, be direct and dont take so many words to answer"
    "history_tasks can be empty so dont worry about that, it can happen and its normal"
    "history changes(edited or sometimes deleted), so the only data history that counts is the one you have just received"
)

human_template = "Tasks:\n{tasks}\n\nUser question:\n{question}"

prompt_template = ChatPromptTemplate.from_messages(
    [
        MessagesPlaceholder(variable_name="history"),
        ("human", human_template),
    ]
)

chain = prompt_template | model

# Armazena sessões
store = {}

def get_by_session_id(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        history = InMemoryChatMessageHistory()
        history.add_ai_message(prompt_inicial)
        store[session_id] = history
    return store[session_id]

# Adapta para rodar como API
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_by_session_id,
    input_messages_key="question",
    history_messages_key="history",
)

# Modelo da requisição
class Requisicao(BaseModel):
    user_id: str
    history_tasks: str
    mensagem: str

# Rota da API
@app.post("/chat")
async def conversar(req: Requisicao):
    result = await chain_with_history.ainvoke(
        {
            "question": req.mensagem,
            "tasks": req.history_tasks
        },
        config={"configurable": {"session_id": req.user_id}},
    )
    return {"resposta": str(result)}