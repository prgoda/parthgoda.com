import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "About — Om Aesthetics" },
  description:
    "Om Aesthetics is a doctor-led clinic in Singapore built on clinical judgement, not upselling. Meet Dr Neil (Nilesh Pawar), Board Certified in Aesthetic Medicine.",
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
    #om-root .om-hero,#om-root .om-split,#om-root .om-bio{grid-template-columns:1fr !important}
    #om-root .om-3col{grid-template-columns:1fr !important}
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
      <a href="/om/about" style="color:#0f1c2e">About</a>
      <a class="navlink" href="/om/contact">Contact</a>
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700">Book on WhatsApp</a>
    </div>
  </div>
</div>

<!-- hero -->
<div class="om-hero" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 340px;gap:48px;align-items:center;padding:64px 32px 56px">
  <div>
    <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">ABOUT THE CLINIC</div>
    <h1 style="font:800 52px/1.04 'Archivo';letter-spacing:-.02em;margin:16px 0 0">Medicine first.<br>Aesthetics always.</h1>
    <p style="font-size:17px;line-height:1.6;color:#43566b;max-width:520px;margin:20px 0 0">Om Aesthetics is a doctor-led clinic in Singapore built on a simple belief: the best aesthetic outcomes come from clinical judgement, not upselling. Every plan starts with an honest assessment and ends with results that still look like you.</p>
  </div>
  <div style="aspect-ratio:3/4;border-radius:16px;overflow:hidden;background:url('/om/assets/dr-neil-scrubs.png') 50% top/cover no-repeat, linear-gradient(160deg,#1c2c42,#243851)"></div>
</div>

<!-- values -->
<div style="border-top:1px solid #eaeef4;background:#f6f9fd">
  <div class="om-3col" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:56px 32px">
    <div style="background:#fff;border:1px solid #e4e9f0;border-radius:14px;padding:28px"><div style="font:700 13px 'Space Mono';color:#1257c9">01</div><div style="font:700 19px 'Archivo';margin:10px 0 6px">Honest first</div><div style="font-size:14px;color:#5b6f88;line-height:1.6">If a treatment won't help you, we say so. Trust is the whole practice.</div></div>
    <div style="background:#fff;border:1px solid #e4e9f0;border-radius:14px;padding:28px"><div style="font:700 13px 'Space Mono';color:#1257c9">02</div><div style="font:700 19px 'Archivo';margin:10px 0 6px">Evidence-led</div><div style="font-size:14px;color:#5b6f88;line-height:1.6">We invest in proven, cleared technology and the training to use it well.</div></div>
    <div style="background:#fff;border:1px solid #e4e9f0;border-radius:14px;padding:28px"><div style="font:700 13px 'Space Mono';color:#1257c9">03</div><div style="font:700 19px 'Archivo';margin:10px 0 6px">Natural results</div><div style="font-size:14px;color:#5b6f88;line-height:1.6">Subtle, balanced outcomes, never overdone, tuned to your own features.</div></div>
  </div>
</div>

<!-- doctor bio -->
<div style="max-width:1200px;margin:0 auto;padding:64px 32px">
  <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">MEET DR NEIL</div>
  <h2 style="font:700 36px/1.08 'Archivo';letter-spacing:-.01em;margin:12px 0 20px;max-width:640px">Dr Neil (Nilesh Pawar), a doctor other doctors learn from</h2>
  <div class="om-bio" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start">
    <div style="font-size:15.5px;line-height:1.7;color:#43566b">
      <p style="margin:0 0 16px">Dr Neil is Board Certified in Aesthetic Medicine by the American Academy of Aesthetic Medicine (AAAM, USA), one of very few physicians accredited to that standard in Singapore. He also holds a Distinction in Clinical Dermatology from the United Kingdom.</p>
      <p style="margin:0">Beyond his own practice, he is a trainer and speaker trusted to teach other physicians across the region, from filler technique to the latest regenerative injectables. His focus is face-lifting and slimming, using his own combination protocols to deliver natural, artistic results.</p>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <div style="border:1px solid #e4e9f0;border-radius:12px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px"><span style="font:700 15px 'Archivo'">MBBS, First-class honours</span><span style="font:700 11px 'Space Mono';color:#1257c9">DEGREE</span></div>
      <div style="border:1px solid #e4e9f0;border-radius:12px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px"><span style="font:700 15px 'Archivo'">Board Certified, AAAM (USA)</span><span style="font:700 11px 'Space Mono';color:#1257c9">CERT</span></div>
      <div style="border:1px solid #e4e9f0;border-radius:12px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px"><span style="font:700 15px 'Archivo'">Dip. Clinical Dermatology (Distinction)</span><span style="font:700 11px 'Space Mono';color:#1257c9">UK</span></div>
      <div style="border:1px solid #e4e9f0;border-radius:12px;padding:18px 22px;display:flex;justify-content:space-between;align-items:center;gap:12px"><span style="font:700 15px 'Archivo'">Certified Trainer, HA Fillers</span><span style="font:700 11px 'Space Mono';color:#1257c9">TRAINER</span></div>
    </div>
  </div>
</div>

<!-- why choose us / award -->
<div style="background:#0f1c2e;color:#fff">
  <div class="om-split" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:300px 1fr;gap:44px;align-items:center;padding:64px 32px">
    <div style="aspect-ratio:4/5;border-radius:14px;overflow:hidden;background:url('/om/assets/award.jpg') 26% 50%/cover no-repeat, #efe7d5"></div>
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#6ea2f0">WHY CHOOSE US</div>
      <h2 style="font:700 32px/1.1 'Archivo';letter-spacing:-.01em;margin:12px 0 10px">Merz Ultherapy Gold Award, 2024</h2>
      <p style="font-size:15px;line-height:1.65;color:#b7c4d6;max-width:560px;margin:0 0 22px">Recognition from Merz Aesthetics for excellence in Ultherapy, and a reflection of the volume, consistency and care behind every treatment performed at the clinic.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        <span style="font:600 12.5px 'Archivo';background:rgba(255,255,255,.09);padding:9px 15px;border-radius:100px">Int'l Speaker, Juvelook &amp; Lenisna</span>
        <span style="font:600 12.5px 'Archivo';background:rgba(255,255,255,.09);padding:9px 15px;border-radius:100px">Regional Trainer, Rejuran</span>
        <span style="font:600 12.5px 'Archivo';background:rgba(255,255,255,.09);padding:9px 15px;border-radius:100px">Certified Trainer, HA Fillers</span>
      </div>
    </div>
  </div>
</div>

<!-- cta -->
<div style="background:#1257c9;color:#fff">
  <div style="max-width:1200px;margin:0 auto;padding:56px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
    <div><h2 style="font:800 32px 'Archivo';margin:0 0 6px">Meet Dr Neil in person</h2><p style="margin:0;color:#cfe0fb;font-size:15px">Book a consultation and get a clear, honest plan for your skin.</p></div>
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

export default function OmAboutPage() {
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
