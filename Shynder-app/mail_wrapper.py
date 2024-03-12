from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME = "shynder451",
    MAIL_PASSWORD = "kskxgzlrunxvnjar",
    MAIL_FROM = "shynder451@gmail.com",
    MAIL_PORT = 587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_FROM_NAME="Shynder Verification",
    USE_CREDENTIALS=True,
    MAIL_SSL_TLS=False,
    MAIL_STARTTLS=True
)

async def send_email(email: str, username: str, token:str):
    body = ""
    with open("./static/email/verify.html", "r") as file:
        body = file.read()
    body = body.replace("[USERNAME]", username)
    body = body.replace("[TOKEN]", token)
    message = MessageSchema(
        subject="Shynder Verification",
        recipients=[email],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)