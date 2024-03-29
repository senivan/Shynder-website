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

def load_html():
    global HTML_VERIFY
    global HTML_RESET
    with open("./static/email/verify.html", "r") as file:
        HTML_VERIFY = file.read()
    with open("./static/email/reset.html", "r") as file:
        HTML_RESET = file.read()

load_html()

async def send_email(email: str, username: str, token:str, type:str = "verify"):
    if type == "verify":
        body = HTML_VERIFY
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
    elif type == "reset":
        body = HTML_RESET
        body = body.replace("[USERNAME]", username)
        body = body.replace("[TOKEN]", token)
        message = MessageSchema(
            subject="Shynder Password Reset",
            recipients=[email],
            body=body,
            subtype="html"
        )
        fm = FastMail(conf)
        await fm.send_message(message)