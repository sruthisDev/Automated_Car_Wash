from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from models.models import ContactMessage
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


async def send_contact_notification(name: str, email: str, subject: str, message: str):
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    if not smtp_user or not smtp_password or "your_email" in smtp_user:
        return  # skip if not configured

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[LuxeWash Contact] {subject}"
    msg["From"] = smtp_user
    msg["To"] = smtp_user  # notify LuxeWash inbox

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#0A1628;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background:#0F2040;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:560px;">

          <tr>
            <td align="center" style="padding:24px 32px;background:#0A1628;border-bottom:1px solid rgba(255,255,255,0.1);">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" valign="middle"
                      style="width:34px;height:34px;background:#3B82F6;border-radius:50%;font-size:12px;font-weight:bold;color:#ffffff;text-align:center;line-height:34px;">
                    LW
                  </td>
                  <td width="10"></td>
                  <td align="left" valign="middle"
                      style="font-size:19px;font-weight:bold;color:#ffffff;font-family:system-ui,sans-serif;">
                    LuxeWash
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 16px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:rgba(59,130,246,0.12);border-left:3px solid #3B82F6;border-radius:0 6px 6px 0;padding:10px 14px;">
                    <span style="color:#3B82F6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;font-family:system-ui,sans-serif;">
                      New Contact Message
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="color:#94A3B8;font-size:13px;font-weight:500;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.07);width:90px;font-family:system-ui,sans-serif;">Name</td>
                  <td style="color:#ffffff;font-size:14px;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:system-ui,sans-serif;">{name}</td>
                </tr>
                <tr>
                  <td style="color:#94A3B8;font-size:13px;font-weight:500;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:system-ui,sans-serif;">Email</td>
                  <td style="color:#ffffff;font-size:14px;padding:11px 16px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:system-ui,sans-serif;">{email}</td>
                </tr>
                <tr>
                  <td style="color:#94A3B8;font-size:13px;font-weight:500;padding:11px 16px;font-family:system-ui,sans-serif;">Subject</td>
                  <td style="color:#ffffff;font-size:14px;padding:11px 16px;font-family:system-ui,sans-serif;">{subject}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:#0A1628;border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,0.07);">
                    <span style="color:#94A3B8;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;font-family:system-ui,sans-serif;">
                      Message
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color:#e2e8f0;font-size:14px;line-height:1.7;padding:16px;font-family:system-ui,sans-serif;">
                    {message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:18px 32px;background:#0A1628;border-top:1px solid rgba(255,255,255,0.1);">
              <p style="color:rgba(148,163,184,0.5);font-size:11px;margin:0;font-family:system-ui,sans-serif;">
                &copy; 2026 LuxeWash &nbsp;&middot;&nbsp; Internal notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    msg.attach(MIMEText(html, "html"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=smtp_host,
            port=smtp_port,
            start_tls=True,
            username=smtp_user,
            password=smtp_password,
        )
    except Exception:
        pass  # don't fail the API if email fails


@router.post("")
async def submit_contact(payload: ContactRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    contact = ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(contact)
    db.commit()

    background_tasks.add_task(
        send_contact_notification,
        payload.name,
        payload.email,
        payload.subject,
        payload.message,
    )

    return {"message": "Message received. We'll get back to you within 24 hours."}
