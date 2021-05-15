
import os
import smtplib
import imghdr
from email.message import EmailMessage

EMAIL_ADDRESS = "notify.vaccine@gmail.com"
EMAIL_PASSWORD = "swqbnqnwujaxdqrg"

contacts = ['manash90852@gmail.com', 'manash90852@example.com']

msg = EmailMessage()
msg['Subject'] = 'Vaccination Slot Available!'
msg['From'] = EMAIL_ADDRESS
msg['To'] = 'manash90852@gmail.com'

msg.set_content('Slots have been found available in your District ')

msg.add_alternative("""\
<!DOCTYPE html>
<html>
    <body>
        <h1 style="color:SlateGray;">ACT FAST SLOTS FILLING UP VERY FAST!</h1>
    </body>
</html>
""", subtype='html')


with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
    smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    smtp.send_message(msg)
