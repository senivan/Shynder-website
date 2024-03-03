from python:3.12.2-slim

workdir /app

copy ./Shynder-app/main.py /app/main.py
copy ./Shynder-app/sql /app/sql
# copy ./Shydenr-app/chat_logs /app/chat_logs
COPY ./Shynder-app/static /app/static

run pip install fastapi uvicorn sqlalchemy pydantic bcrypt

expose 80

cmd ["python", "main.py"]