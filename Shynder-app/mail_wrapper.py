from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME = "shynder.support@ukr.net",
    MAIL_PASSWORD = "dJP0sJRUqx0zHDkx",
    MAIL_FROM = "shynder.support@ukr.net",
    MAIL_PORT = 465,
    MAIL_SERVER="smtp.ukr.net",
    MAIL_FROM_NAME="shynder.support@ukr.net",
    USE_CREDENTIALS=True,
    MAIL_SSL_TLS=True,
    MAIL_STARTTLS=False
)

async def send_email(email: str, username: str, token:str):
    body = ""
    with open("./static/email/verify.html", "r") as file:
        body = file.read()
    body = body.replace("[USERNAME]", username)
    body = body.replace("[TOKEN]", token)
    print(body)
    message = MessageSchema(
        subject="Shynder Verification",
        recipients=[email],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)