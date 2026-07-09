import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Ultherapy PRIME — Om Aesthetics" },
  description:
    "Ultherapy PRIME: FDA-cleared, micro-focused ultrasound that lifts and firms the brow, jaw, neck and chin — no surgery, no downtime.",
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
  @media (max-width:860px){
    #om-root .om-hero,#om-root .om-split,#om-root .om-depths{grid-template-columns:1fr !important}
    #om-root .om-3col{grid-template-columns:1fr 1fr !important}
    #om-root .om-4col{grid-template-columns:1fr 1fr !important}
    #om-root .om-compare{font-size:12px !important}
    #om-root h1{font-size:40px !important}
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
      <a href="/om/treatments" style="color:#0f1c2e">Treatments</a>
      <a class="navlink" href="/om/about">About</a>
      <a class="navlink" href="/om/contact">Contact</a>
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700">Book on WhatsApp</a>
    </div>
  </div>
</div>

<!-- breadcrumb -->
<div style="max-width:1200px;margin:0 auto;padding:20px 32px 0;font:600 12.5px 'Archivo';color:#8394a8"><a href="/om" class="navlink">Home</a> &nbsp;/&nbsp; <a href="/om/treatments" class="navlink">Treatments</a> &nbsp;/&nbsp; <span style="color:#1257c9">Ultherapy PRIME</span></div>

<!-- hero -->
<div class="om-hero" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;padding:40px 32px 56px">
  <div>
    <div style="display:inline-flex;align-items:center;gap:8px;font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9;background:#eef4fd;padding:7px 12px;border-radius:100px">FDA-CLEARED, MICRO-FOCUSED ULTRASOUND</div>
    <h1 style="font:800 54px/1.02 'Archivo';letter-spacing:-.02em;margin:22px 0 0">Lift and firm.<br>No surgery,<br>no downtime.</h1>
    <p style="font-size:17px;line-height:1.6;color:#43566b;max-width:440px;margin:22px 0 0">Ultherapy PRIME sends micro-focused ultrasound to the exact depths a facelift targets, stimulating your own collagen to lift the brow, jaw, neck and chin.</p>
    <div style="display:flex;gap:14px;margin-top:32px;flex-wrap:wrap">
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:15px 26px;border-radius:9px;font:700 15px 'Archivo'">Book a consultation</a>
      <a href="#how" style="border:1.5px solid #d3dbe6;color:#0f1c2e;padding:15px 24px;border-radius:9px;font:700 15px 'Archivo'">How it works</a>
    </div>
  </div>
  <div style="position:relative;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:url('/om/assets/model-zones.jpg') 50% 25%/cover no-repeat, radial-gradient(120% 120% at 70% 30%,#e7f0fe,#cfe0f8)">
    <div style="position:absolute;left:18px;bottom:18px;background:rgba(255,255,255,.94);backdrop-filter:blur(4px);border-radius:11px;padding:12px 16px">
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.06em;color:#1257c9">1.5 &middot; 3.0 &middot; 4.5 mm</div>
      <div style="font:600 12.5px 'Archivo';color:#5b6f88;margin-top:2px">three focused depths, one session</div>
    </div>
  </div>
</div>

<!-- trust strip -->
<div style="border-top:1px solid #eaeef4;border-bottom:1px solid #eaeef4;background:#f6f9fd">
  <div class="om-4col" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)">
    <div style="padding:24px 28px;border-right:1px solid #eaeef4"><div style="font:800 24px 'Archivo';color:#1257c9">12&ndash;18</div><div style="font-size:12px;color:#5b6f88;margin-top:2px">months of results</div></div>
    <div style="padding:24px 28px;border-right:1px solid #eaeef4"><div style="font:800 24px 'Archivo';color:#1257c9">0</div><div style="font-size:12px;color:#5b6f88;margin-top:2px">days downtime</div></div>
    <div style="padding:24px 28px;border-right:1px solid #eaeef4"><div style="font:800 24px 'Archivo';color:#1257c9">45&ndash;60</div><div style="font-size:12px;color:#5b6f88;margin-top:2px">min per session</div></div>
    <div style="padding:24px 28px"><div style="font:800 24px 'Archivo';color:#1257c9">FDA</div><div style="font-size:12px;color:#5b6f88;margin-top:2px">cleared technology</div></div>
  </div>
</div>

<!-- what it treats -->
<div style="max-width:1200px;margin:0 auto;padding:64px 32px">
  <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">WHAT IT TREATS</div>
  <h2 style="font:700 34px/1.1 'Archivo';letter-spacing:-.01em;margin:12px 0 28px">Where you'll see the lift</h2>
  <div class="om-3col" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Brow &amp; eyes</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Elevates drooping brows for a more open, youthful eye.</div></div>
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Jawline</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Defines a sharper V-shape and lifts sagging jowls.</div></div>
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Under-chin</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Firms the jaw-to-neck transition and softens fullness.</div></div>
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Neck</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Tightens crepey, lax skin along the neck.</div></div>
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Décolleté</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Smooths fine lines across the chest.</div></div>
    <div style="border:1px solid #e4e9f0;border-radius:12px;padding:24px"><div style="font:700 16px 'Archivo'">Fine lines</div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Refreshes texture and boosts everyday radiance.</div></div>
  </div>
</div>

<!-- how it works: depths -->
<div id="how" style="background:#f6f9fd;border-top:1px solid #eaeef4;border-bottom:1px solid #eaeef4">
  <div style="max-width:1200px;margin:0 auto;padding:64px 32px">
    <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">HOW IT WORKS</div>
    <h2 style="font:700 34px/1.1 'Archivo';letter-spacing:-.01em;margin:12px 0 8px">Three depths, one session</h2>
    <p style="font-size:15px;color:#43566b;max-width:520px;margin:0 0 30px">Real-time imaging lets the doctor place energy precisely, reaching the same SMAS layer a surgeon lifts.</p>
    <div class="om-depths" style="display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:stretch">
      <div style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-height:220px">
        <div style="flex:1;padding:14px 12px;display:flex;flex-direction:column;background:linear-gradient(#fbe9e4,#f6d9d0)"><span style="font:700 10px 'Space Mono';color:#b56a55">1.5mm</span><span style="font-size:10px;color:#b56a55">Upper dermis</span></div>
        <div style="flex:1.3;padding:14px 12px;display:flex;flex-direction:column;background:linear-gradient(#f6d9d0,#eec6b6)"><span style="font:700 10px 'Space Mono';color:#a85f45">3.0mm</span><span style="font-size:10px;color:#a85f45">Deep dermis &amp; fat</span></div>
        <div style="flex:1.6;padding:14px 12px;display:flex;flex-direction:column;background:linear-gradient(#e7b79f,#d99e80)"><span style="font:700 10px 'Space Mono';color:#7a4128">4.5mm</span><span style="font-size:10px;color:#7a4128">SMAS layer</span></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 22px"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font:700 16px 'Archivo'">1.5&thinsp;mm, Skin quality</div><div style="font:700 11px 'Space Mono';color:#1257c9">UPPER DERMIS</div></div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Smooths fine lines, refines texture and builds collagen in the superficial layers for a brighter finish.</div></div>
        <div style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 22px"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font:700 16px 'Archivo'">3.0&thinsp;mm, Contour</div><div style="font:700 11px 'Space Mono';color:#1257c9">DEEP DERMIS</div></div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Slims a heavy-looking face, defines the jawline and improves overall facial balance.</div></div>
        <div style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 22px"><div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font:700 16px 'Archivo'">4.5&thinsp;mm, Lift</div><div style="font:700 11px 'Space Mono';color:#1257c9">SMAS LAYER</div></div><div style="font-size:13.5px;color:#5b6f88;margin-top:6px;line-height:1.55">Lifts sagging jowls and lower face, tightens the neck and firms marionette and smile lines.</div></div>
      </div>
    </div>
  </div>
</div>

<!-- compare -->
<div style="max-width:1200px;margin:0 auto;padding:64px 32px">
  <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">THE DIFFERENCE</div>
  <h2 style="font:700 34px/1.1 'Archivo';letter-spacing:-.01em;margin:12px 0 28px">Ultherapy vs Ultherapy PRIME</h2>
  <div class="om-compare" style="display:grid;grid-template-columns:1.4fr 1fr 1fr;border:1px solid #e4e9f0;border-radius:12px;overflow:hidden;font-size:14px">
    <div style="background:#f6f9fd;padding:16px 20px;border-bottom:1px solid #e4e9f0"></div>
    <div style="background:#f6f9fd;padding:16px 20px;font:700 15px 'Archivo';border-bottom:1px solid #e4e9f0;border-left:1px solid #e4e9f0">Ultherapy</div>
    <div style="background:#eef4fd;padding:16px 20px;font:700 15px 'Archivo';color:#1257c9;border-bottom:1px solid #e4e9f0;border-left:1px solid #e4e9f0">PRIME</div>
    <div style="padding:16px 20px;color:#43566b;border-bottom:1px solid #eef1f5">Comfort</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;color:#5b6f88">Standard</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;background:#f8fbff;font-weight:600">Gentler, refined delivery</div>
    <div style="padding:16px 20px;color:#43566b;border-bottom:1px solid #eef1f5">Real-time imaging</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;color:#5b6f88">Yes</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;background:#f8fbff;font-weight:600">Yes, enhanced visualization</div>
    <div style="padding:16px 20px;color:#43566b;border-bottom:1px solid #eef1f5">Personalisation</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;color:#5b6f88">Fixed protocols</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;border-bottom:1px solid #eef1f5;background:#f8fbff;font-weight:600">Tailored each session</div>
    <div style="padding:16px 20px;color:#43566b">Results</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;color:#5b6f88">Lift &amp; tighten</div><div style="padding:16px 20px;border-left:1px solid #eef1f5;background:#f8fbff;font-weight:600">Lift &amp; tighten, 12&ndash;18 mo</div>
  </div>
</div>

<!-- doctor -->
<div style="background:#0f1c2e;color:#fff">
  <div class="om-split" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:230px 1fr;gap:36px;align-items:center;padding:56px 32px">
    <div style="aspect-ratio:3/4;border-radius:12px;overflow:hidden;background:url('/om/assets/dr-neil-scrubs.png') 50% top/cover no-repeat, linear-gradient(160deg,#1c2c42,#243851)"></div>
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#6ea2f0">YOUR DOCTOR</div>
      <h2 style="font:700 30px 'Archivo';margin:10px 0 4px">Dr Neil (Nilesh Pawar)</h2>
      <p style="font-size:14.5px;line-height:1.6;color:#b7c4d6;max-width:560px;margin:8px 0 18px">Board Certified in Aesthetic Medicine (AAAM, USA), one of very few accredited in Singapore, with a Distinction in Clinical Dermatology (UK). He specialises in face-lifting and slimming, with his own combination protocols for natural results.</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        <span style="font:600 12px 'Archivo';background:rgba(255,255,255,.09);padding:7px 12px;border-radius:100px">MBBS, First-class honours</span>
        <span style="font:600 12px 'Archivo';background:rgba(255,255,255,.09);padding:7px 12px;border-radius:100px">Board Certified, AAAM</span>
        <span style="font:600 12px 'Archivo';background:rgba(255,255,255,.09);padding:7px 12px;border-radius:100px">Dip. Dermatology (Distinction)</span>
      </div>
    </div>
  </div>
</div>

<!-- cta -->
<div style="background:#1257c9;color:#fff">
  <div style="max-width:1200px;margin:0 auto;padding:52px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
    <div><h2 style="font:800 30px 'Archivo';margin:0 0 6px">Ready to see the lift?</h2><p style="margin:0;color:#cfe0fb;font-size:15px">Book a consultation with Dr Neil, we'll assess if PRIME is right for you.</p></div>
    <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#fff;color:#1257c9;padding:16px 30px;border-radius:10px;font:800 16px 'Archivo';white-space:nowrap">WhatsApp (+65) 8894 7314</a>
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

export default function OmTreatmentsPage() {
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
