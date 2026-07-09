import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contact — Om Aesthetics" },
  description:
    "Book a consultation with Dr Neil at Om Aesthetics, Singapore. WhatsApp (+65) 8894 7314. Mon–Sat, 10am–8pm.",
  robots: { index: false },
};

const HTML = `
<style>
  #om-root *{box-sizing:border-box}
  #om-root{font-family:'Archivo',system-ui,sans-serif;color:#0f1c2e;background:#fff;line-height:normal}
  #om-root a{color:#1257c9;text-decoration:none}
  #om-root a:hover{color:#0e46a3}
  #om-root .navlink{color:#43566b !important}
  #om-root .navlink:hover{color:#0f1c2e !important}
  #om-root .fld{width:100%;border:1.5px solid #d3dbe6;border-radius:9px;padding:13px 15px;font:500 14px 'Archivo';color:#0f1c2e;background:#fff;outline:none}
  #om-root .fld:focus{border-color:#1257c9}
  #om-root .fld::placeholder{color:#9aa8ba}
  @media (max-width:860px){
    #om-root .om-contact,#om-root .om-expect{grid-template-columns:1fr !important}
    #om-root .om-foot{grid-template-columns:1fr 1fr !important}
    #om-root h1{font-size:38px !important}
  }
</style>
<div id="om-root">

<!-- announcement bar -->
<div style="background:#0f1c2e;color:#cfe0fb;font:600 12.5px 'Archivo';text-align:center;padding:9px 20px;letter-spacing:.01em">Awarded the Merz Ultherapy Gold Award 2024 &middot; Board-certified aesthetic medicine in Singapore</div>

<!-- nav -->
<div style="position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:blur(10px);border-bottom:1px solid #eaeef4">
  <div style="max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:15px 32px">
    <a href="/om" style="display:flex"><img src="/om/assets/om-logo.svg" alt="Om Aesthetics" style="height:44px;display:block"></a>
    <div style="display:flex;align-items:center;gap:28px;font:600 14px 'Archivo'">
      <a class="navlink" href="/om">Home</a>
      <a class="navlink" href="/om/treatments">Treatments</a>
      <a class="navlink" href="/om/about">About</a>
      <a href="/om/contact" style="color:#0f1c2e">Contact</a>
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700">Book on WhatsApp</a>
    </div>
  </div>
</div>

<!-- hero + form -->
<div class="om-contact" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:56px;padding:64px 32px 64px;align-items:start">
  <div>
    <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">BOOK A CONSULTATION</div>
    <h1 style="font:800 50px/1.04 'Archivo';letter-spacing:-.02em;margin:16px 0 0">Let's talk about<br>your skin.</h1>
    <p style="font-size:16.5px;line-height:1.6;color:#43566b;max-width:440px;margin:20px 0 30px">Tell us a little about what you're looking for. Our team will reach out to arrange a consultation with Dr Neil at a time that suits you.</p>

    <div style="display:flex;flex-direction:column;gap:16px">
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="display:flex;align-items:center;gap:14px;border:1px solid #e4e9f0;border-radius:12px;padding:18px 20px">
        <div style="width:42px;height:42px;border-radius:11px;background:#e7f0e9;display:flex;align-items:center;justify-content:center;font-size:20px">&#128172;</div>
        <div><div style="font:700 15px 'Archivo';color:#0f1c2e">WhatsApp (fastest)</div><div style="font-size:13px;color:#5b6f88">(+65) 8894 7314</div></div>
      </a>
      <div style="display:flex;align-items:center;gap:14px;border:1px solid #e4e9f0;border-radius:12px;padding:18px 20px">
        <div style="width:42px;height:42px;border-radius:11px;background:#eef4fd;display:flex;align-items:center;justify-content:center;font-size:20px">&#128205;</div>
        <div><div style="font:700 15px 'Archivo';color:#0f1c2e">Visit the clinic</div><div style="font-size:13px;color:#5b6f88">Singapore &middot; by appointment</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;border:1px solid #e4e9f0;border-radius:12px;padding:18px 20px">
        <div style="width:42px;height:42px;border-radius:11px;background:#fef3d9;display:flex;align-items:center;justify-content:center;font-size:20px">&#128336;</div>
        <div><div style="font:700 15px 'Archivo';color:#0f1c2e">Opening hours</div><div style="font-size:13px;color:#5b6f88">Mon&ndash;Sat, 10am&ndash;8pm &middot; Closed Sun</div></div>
      </div>
    </div>
  </div>

  <!-- form -->
  <div style="border:1px solid #e4e9f0;border-radius:16px;padding:32px;box-shadow:0 20px 50px -30px rgba(15,28,46,.4)">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">First name</label><input class="fld" placeholder="Jane"></div>
      <div><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">Last name</label><input class="fld" placeholder="Tan"></div>
    </div>
    <div style="margin-top:14px"><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">Mobile</label><input class="fld" placeholder="+65 0000 0000"></div>
    <div style="margin-top:14px"><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">Email</label><input class="fld" placeholder="jane@email.com"></div>
    <div style="margin-top:14px"><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">I'm interested in</label>
      <select class="fld"><option>Ultherapy PRIME</option><option>Injectables</option><option>Skinboosters</option><option>Thread Lifts</option><option>Laser &amp; Pigment</option><option>Not sure yet</option></select>
    </div>
    <div style="margin-top:14px"><label style="font:600 12.5px 'Archivo';color:#43566b;display:block;margin-bottom:6px">Anything you'd like us to know?</label><textarea class="fld" rows="3" placeholder="Optional"></textarea></div>
    <a href="https://api.whatsapp.com/send?phone=6588947314" style="display:block;width:100%;margin-top:20px;background:#1257c9;color:#fff;padding:15px;border-radius:9px;font:700 15px 'Archivo';text-align:center">Request consultation</a>
    <p style="font-size:11.5px;color:#8394a8;text-align:center;margin:12px 0 0;line-height:1.5">By submitting, you agree to be contacted about your enquiry. We never share your details.</p>
  </div>
</div>

<!-- what to expect + consultant -->
<div style="background:#f6f9fd;border-top:1px solid #eaeef4;border-bottom:1px solid #eaeef4">
  <div class="om-expect" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 300px;gap:44px;align-items:end;padding:56px 32px 0">
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">WHAT TO EXPECT</div>
      <h2 style="font:700 30px/1.1 'Archivo';letter-spacing:-.01em;margin:12px 0 20px">A warm, unhurried first visit</h2>
      <div style="display:flex;flex-direction:column;gap:14px;padding-bottom:56px">
        <div style="display:flex;gap:14px;align-items:flex-start"><div style="font:700 12px 'Space Mono';color:#1257c9;padding-top:2px">01</div><div style="font-size:14.5px;color:#43566b;line-height:1.55">A relaxed chat about your goals, history and what's realistic.</div></div>
        <div style="display:flex;gap:14px;align-items:flex-start"><div style="font:700 12px 'Space Mono';color:#1257c9;padding-top:2px">02</div><div style="font-size:14.5px;color:#43566b;line-height:1.55">A hands-on skin assessment by Dr Neil, no rush.</div></div>
        <div style="display:flex;gap:14px;align-items:flex-start"><div style="font:700 12px 'Space Mono';color:#1257c9;padding-top:2px">03</div><div style="font-size:14.5px;color:#43566b;line-height:1.55">A clear recommendation and transparent pricing before anything begins.</div></div>
      </div>
    </div>
    <div style="height:280px;display:flex;align-items:flex-end;justify-content:center"><img src="/om/assets/woman-chair.png" alt="Om Aesthetics consultant" style="height:100%;width:auto;object-fit:contain;object-position:bottom"></div>
  </div>
</div>

<!-- footer -->
<footer style="background:#0f1c2e;color:#b7c4d6;padding:56px 32px 30px">
  <div class="om-foot" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:36px">
    <div>
      <img src="/om/assets/om-logo.svg" alt="Om Aesthetics" style="height:30px;filter:brightness(0) invert(1);opacity:.95">
      <p style="font-size:13.5px;line-height:1.6;margin:16px 0 0;max-width:280px">A doctor-led aesthetic medicine clinic in Singapore, focused on evidence, precision and natural results.</p>
    </div>
    <div>
      <div style="font:700 12px 'Space Mono',monospace;letter-spacing:.08em;color:#6ea2f0;margin-bottom:14px">TREATMENTS</div>
      <div style="display:flex;flex-direction:column;gap:9px;font-size:13.5px"><a href="/om/treatments" style="color:#b7c4d6">Ultherapy PRIME</a><a href="/om/treatments" style="color:#b7c4d6">Injectables</a><a href="/om/treatments" style="color:#b7c4d6">Skinboosters</a><a href="/om/treatments" style="color:#b7c4d6">Thread Lifts</a></div>
    </div>
    <div>
      <div style="font:700 12px 'Space Mono',monospace;letter-spacing:.08em;color:#6ea2f0;margin-bottom:14px">CLINIC</div>
      <div style="display:flex;flex-direction:column;gap:9px;font-size:13.5px"><a href="/om/about" style="color:#b7c4d6">About Dr Neil</a><a href="/om/about" style="color:#b7c4d6">Why choose us</a><a href="/om/contact" style="color:#b7c4d6">Contact</a><a href="/om/contact" style="color:#b7c4d6">Book now</a></div>
    </div>
    <div>
      <div style="font:700 12px 'Space Mono',monospace;letter-spacing:.08em;color:#6ea2f0;margin-bottom:14px">VISIT</div>
      <div style="font-size:13.5px;line-height:1.7">Mon&ndash;Sat, 10am&ndash;8pm<br>Singapore<br><a href="https://api.whatsapp.com/send?phone=6588947314" style="color:#fff;font-weight:700">(+65) 8894 7314</a></div>
    </div>
  </div>
  <div style="max-width:1200px;margin:36px auto 0;padding-top:22px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:12px;color:#7d93af">
    <span>&copy; 2026 Om Aesthetics. All rights reserved.</span>
    <span>Results vary between individuals. This site is for information and does not constitute medical advice.</span>
  </div>
</footer>

</div>
`;

export default function OmContactPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
    </>
  );
}
