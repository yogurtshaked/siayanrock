import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;
const TO_EMAIL = Deno.env.get("INQUIRY_TO_EMAIL")!;
const FROM_EMAIL =
    Deno.env.get("INQUIRY_FROM_EMAIL") ?? "Siayanrock Inquiries <inquiries@siayanrockhometel.com>";

// provided automatically inside Edge Functions
const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const esc = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// strip line breaks so user input can't inject email headers
const oneLine = (v: unknown) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();

const nightsBetween = (a?: string, b?: string) =>
    a && b ? Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000) : null;

Deno.serve(async (req) => {
    if (req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    if (payload.type !== "INSERT" || payload.table !== "inquiries") {
        return new Response("Ignored", { status: 200 });
    }

    const r = payload.record;
    const nights = nightsBetween(r.check_in, r.check_out);

    const rows: [string, string][] = [
        ["Name", r.name],
        ["Email", r.email],
        ["Phone", r.phone ?? "-"],
        ["Guests", r.guests ?? "-"],
        ["Check-in", r.check_in ?? "-"],
        ["Check-out", r.check_out ?? "-"],
        ["Nights", nights !== null ? String(nights) : "-"],
        ["Interested in", r.interest],
    ];

    const text =
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\n\nMessage:\n${r.message ?? "(none)"}`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px">New inquiry from ${esc(r.name)}</h2>
        <table style="border-collapse:collapse;width:100%">
          ${rows.map(([k, v]) => `
            <tr>
              <td style="padding:6px 12px 6px 0;color:#6b7373;white-space:nowrap">${esc(k)}</td>
              <td style="padding:6px 0"><strong>${esc(v)}</strong></td>
            </tr>`).join("")}
        </table>
        <h3 style="margin:20px 0 6px">Message</h3>
        <p style="white-space:pre-wrap;margin:0">${esc(r.message ?? "(none)")}</p>
        <p style="color:#9a9a9a;font-size:12px;margin-top:24px">Reply to this email to answer the guest directly.</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: [TO_EMAIL],
            reply_to: r.email,
            subject: oneLine(
                `New inquiry: ${r.name} · ${r.interest}${nights ? ` · ${nights} night${nights > 1 ? "s" : ""}` : ""}`,
            ),
            html,
            text,
        }),
    });

    if (!res.ok) {
        console.error("Resend error:", res.status, await res.text());
        return new Response("Email failed", { status: 502 });
    }

    // record that the email went out
    await admin
        .from("inquiries")
        .update({ emailed_at: new Date().toISOString() })
        .eq("id", r.id);

    return new Response("ok", { status: 200 });
});