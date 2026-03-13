import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SERVICE_LABELS = {"basic": "Basic Wash", "deluxe": "Deluxe Wash", "premium": "Premium Wash"}
PLAN_LABELS = {"standard": "Standard", "premium": "Premium", "premium_plus": "Premium Plus"}


def _smtp_cfg():
    return {
        "user": os.getenv("SMTP_USER", ""),
        "password": os.getenv("SMTP_PASSWORD", ""),
        "host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", 587)),
    }


def _header_html():
    return """
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:28px 32px;background:#0A1628;border-bottom:1px solid rgba(255,255,255,0.1);">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" valign="middle"
                  style="width:36px;height:36px;background:#3B82F6;border-radius:50%;font-size:13px;font-weight:bold;color:#ffffff;text-align:center;line-height:36px;">
                LW
              </td>
              <td width="10"></td>
              <td align="left" valign="middle"
                  style="font-size:20px;font-weight:bold;color:#ffffff;font-family:system-ui,sans-serif;">
                LuxeWash
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>"""


def _footer_html():
    return """
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding:20px 32px;background:#0A1628;border-top:1px solid rgba(255,255,255,0.1);">
          <p style="color:#94A3B8;font-size:12px;margin:0 0 5px;font-family:system-ui,sans-serif;">
            123 Shine Ave, Suite 100, City, State 00000
          </p>
          <p style="color:#94A3B8;font-size:12px;margin:0 0 10px;font-family:system-ui,sans-serif;">
            +1 (555) 123-4567 &nbsp;&middot;&nbsp; hello@luxewash.com
          </p>
          <p style="color:rgba(148,163,184,0.5);font-size:11px;margin:0;font-family:system-ui,sans-serif;">
            &copy; 2026 LuxeWash. All rights reserved.
          </p>
        </td>
      </tr>
    </table>"""


def _detail_row(label, value, last=False):
    border = "" if last else "border-bottom:1px solid rgba(255,255,255,0.07);"
    return f"""
    <tr>
      <td style="color:#94A3B8;font-size:14px;padding:12px 0;{border}font-family:system-ui,sans-serif;">{label}</td>
      <td style="color:#ffffff;font-size:14px;padding:12px 0;{border}text-align:right;font-family:system-ui,sans-serif;">{value}</td>
    </tr>"""


async def send_welcome_email(name: str, email: str):
    cfg = _smtp_cfg()
    if not cfg["user"] or not cfg["password"] or "your_email" in cfg["user"]:
        return

    msg = MIMEMultipart("alternative")
    msg["From"] = f"LuxeWash <{cfg['user']}>"
    msg["To"] = email
    msg["Subject"] = "Welcome to LuxeWash!"

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#0A1628;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background:#0F2040;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:560px;">

          {_header_html()}

          <!-- Icon + heading -->
          <tr>
            <td align="center" style="padding:36px 32px 20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="width:64px;height:64px;background:rgba(59,130,246,0.12);border:1px solid rgba(59,130,246,0.35);border-radius:50%;font-size:28px;text-align:center;line-height:64px;color:#3B82F6;">
                    &#9733;
                  </td>
                </tr>
              </table>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:16px 0 8px;font-family:system-ui,sans-serif;">
                Welcome to LuxeWash, {name}!
              </h1>
              <p style="color:#94A3B8;font-size:14px;margin:0;line-height:1.6;font-family:system-ui,sans-serif;">
                Hi {name},<br><br>
                Your account has been created successfully.<br>
                Experience the finest car wash services tailored just for you.
              </p>
            </td>
          </tr>

          <!-- Account details -->
          <tr>
            <td style="padding:0 32px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;">
                <tr>
                  <td colspan="2"
                      style="background:rgba(59,130,246,0.08);padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <span style="color:#3B82F6;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;font-family:system-ui,sans-serif;">
                      Account Details
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="color:#94A3B8;font-size:14px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.07);font-family:system-ui,sans-serif;">Full Name</td>
                  <td style="color:#ffffff;font-size:14px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.07);text-align:right;font-family:system-ui,sans-serif;">{name}</td>
                </tr>
                <tr>
                  <td style="color:#94A3B8;font-size:14px;padding:12px 16px;font-family:system-ui,sans-serif;">Email</td>
                  <td style="color:#ffffff;font-size:14px;padding:12px 16px;text-align:right;font-family:system-ui,sans-serif;">{email}</td>
                </tr>
              </table>
            </td>
          </tr>

          {_footer_html()}

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
            hostname=cfg["host"],
            port=cfg["port"],
            start_tls=True,
            username=cfg["user"],
            password=cfg["password"],
        )
        print(f"✅ Welcome email sent to {email}")
    except Exception as e:
        print(f"❌ Welcome email failed: {e}")


async def send_reset_email(name: str, email: str, reset_link: str):
    cfg = _smtp_cfg()
    if not cfg["user"] or not cfg["password"] or "your_email" in cfg["user"]:
        return

    msg = MIMEMultipart("alternative")
    msg["From"] = f"LuxeWash <{cfg['user']}>"
    msg["To"] = email
    msg["Subject"] = "LuxeWash — Reset Your Password"

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#0A1628;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background:#0F2040;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:560px;">

          {_header_html()}

          <!-- Icon + heading -->
          <tr>
            <td align="center" style="padding:36px 32px 28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="width:64px;height:64px;background:rgba(234,179,8,0.12);border:1px solid rgba(234,179,8,0.35);border-radius:50%;font-size:26px;text-align:center;line-height:64px;">
                    &#128273;
                  </td>
                </tr>
              </table>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:16px 0 8px;font-family:system-ui,sans-serif;">
                Reset Your Password
              </h1>
              <p style="color:#94A3B8;font-size:14px;margin:0 0 28px;line-height:1.6;font-family:system-ui,sans-serif;">
                Hi {name}, click the button below to reset your password.<br>
                This link expires in <strong style="color:#ffffff;">1 hour</strong>.
              </p>
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="background:linear-gradient(135deg,#3B82F6,#2563EB);border-radius:10px;">
                    <a href="{reset_link}"
                       style="display:inline-block;color:#ffffff;text-decoration:none;padding:14px 36px;font-size:15px;font-weight:600;font-family:system-ui,sans-serif;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#64748B;font-size:12px;margin:20px 0 0;font-family:system-ui,sans-serif;">
                If you didn&apos;t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          {_footer_html()}

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
            hostname=cfg["host"],
            port=cfg["port"],
            start_tls=True,
            username=cfg["user"],
            password=cfg["password"],
        )
        print(f"✅ Reset email sent to {email}")
    except Exception as e:
        print(f"❌ Reset email failed: {e}")


async def send_confirmation_email(result: dict):
    cfg = _smtp_cfg()
    if not cfg["user"] or not cfg["password"] or "your_email" in cfg["user"]:
        return

    customer_email = result.get("customer_email")
    customer_name = result.get("customer_name", "Valued Customer")
    is_service = result.get("type") == "service"

    msg = MIMEMultipart("alternative")
    msg["From"] = f"LuxeWash <{cfg['user']}>"
    msg["To"] = customer_email
    msg["Subject"] = (
        f"LuxeWash — Booking Confirmed #{result.get('booking_ref', '')}"
        if is_service else
        f"LuxeWash — {PLAN_LABELS.get(result.get('plan',''), 'Membership')} Activated"
    )

    if is_service:
        details_rows = (
            _detail_row("Booking ID", f"#{result.get('booking_ref')}")
            + _detail_row("Service", SERVICE_LABELS.get(result.get("service", ""), result.get("service", "")))
            + _detail_row("Date", result.get("appointment_date"))
            + _detail_row("Time", result.get("appointment_time"))
            + _detail_row("Subtotal", f"${result.get('price', 0):.2f}")
            + _detail_row("Tax", f"${result.get('tax', 0):.2f}")
        )
        total_label = "Total Paid"
        total_value = f"${result.get('total', 0):.2f}"
        headline = "Your booking is confirmed!"
        subline = f"Hi {customer_name}, we look forward to seeing you and your vehicle."
        icon_char = "&#10003;"
        icon_bg = "rgba(34,197,94,0.12)"
        icon_border = "rgba(34,197,94,0.35)"
        icon_color = "#22C55E"
        section_label = "Booking Summary"
    else:
        details_rows = (
            _detail_row("Plan", PLAN_LABELS.get(result.get("plan", ""), result.get("plan", "")))
            + _detail_row("Status", '<span style="color:#22C55E;font-weight:600;">Active</span>')
            + _detail_row("Next Renewal", result.get("renews_at"))
        )
        total_label = "Amount Charged"
        total_value = f"${result.get('price', 0):.2f}/mo"
        headline = "Your membership is now active!"
        subline = f"Hi {customer_name}, enjoy unlimited washes and exclusive member benefits."
        icon_char = "&#9733;"
        icon_bg = "rgba(59,130,246,0.12)"
        icon_border = "rgba(59,130,246,0.35)"
        icon_color = "#3B82F6"
        section_label = "Membership Details"

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background-color:#0A1628;font-family:system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background:#0F2040;border-radius:16px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;max-width:560px;">

          {_header_html()}

          <!-- Icon + heading -->
          <tr>
            <td align="center" style="padding:36px 32px 20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="width:64px;height:64px;background:{icon_bg};border:1px solid {icon_border};border-radius:50%;font-size:28px;text-align:center;line-height:64px;color:{icon_color};">
                    {icon_char}
                  </td>
                </tr>
              </table>
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:16px 0 8px;font-family:system-ui,sans-serif;">
                {headline}
              </h1>
              <p style="color:#94A3B8;font-size:14px;margin:0;line-height:1.6;font-family:system-ui,sans-serif;">
                {subline}
              </p>
            </td>
          </tr>

          <!-- Details table -->
          <tr>
            <td style="padding:0 32px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px solid rgba(255,255,255,0.08);border-radius:10px;overflow:hidden;">
                <tr>
                  <td colspan="2"
                      style="background:rgba(59,130,246,0.08);padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <span style="color:#3B82F6;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;font-family:system-ui,sans-serif;">
                      {section_label}
                    </span>
                  </td>
                </tr>
                <tr><td colspan="2" style="padding:0 16px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    {details_rows}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Total row -->
          <tr>
            <td style="padding:0 32px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.2);border-radius:10px;">
                <tr>
                  <td style="color:#3B82F6;font-size:15px;font-weight:700;padding:14px 16px;font-family:system-ui,sans-serif;">
                    {total_label}
                  </td>
                  <td style="color:#3B82F6;font-size:20px;font-weight:700;padding:14px 16px;text-align:right;font-family:system-ui,sans-serif;">
                    {total_value}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          {_footer_html()}

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
            hostname=cfg["host"],
            port=cfg["port"],
            start_tls=True,
            username=cfg["user"],
            password=cfg["password"],
        )
        print(f"✅ Confirmation email sent to {customer_email}")
    except Exception as e:
        print(f"❌ Email send failed: {e}")