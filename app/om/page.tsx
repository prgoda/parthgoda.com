import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Om Aesthetics — Singapore Aesthetic Medicine Clinic" },
  description:
    "A doctor-led aesthetic medicine clinic in Singapore, focused on evidence, precision and natural results — from non-surgical lifting to injectables and skin health.",
  robots: { index: false },
};

// Imported from Claude Design project "OM Aesthetics website redesign" (Home.dc.html).
// The three photographs exceed the design MCP's 256 KiB transfer cap, so each is
// layered as a CSS background over the design's original gradient: when the image
// is present it fills the frame, and until then the gradient shows cleanly.
const HTML = `
<style>
  #om-root *{box-sizing:border-box}
  #om-root{font-family:'Archivo',system-ui,sans-serif;color:#0f1c2e;background:#fff;line-height:normal}
  #om-root a{color:#1257c9;text-decoration:none}
  #om-root a:hover{color:#0e46a3}
  #om-root .navlink{color:#43566b !important}
  #om-root .navlink:hover{color:#0f1c2e !important}
  #om-root details>summary{list-style:none;cursor:pointer}
  #om-root details>summary::-webkit-details-marker{display:none}
  #om-root details[open] .faq-plus{transform:rotate(45deg)}
  #om-root .tcard:hover{border-color:#1257c9 !important;box-shadow:0 16px 40px -20px rgba(18,87,201,.4)}
  #om-root .tcard{transition:border-color .2s,box-shadow .2s}
  @media (max-width:860px){
    #om-root .om-hero,#om-root .om-split{grid-template-columns:1fr !important}
    #om-root .om-3col{grid-template-columns:1fr !important}
    #om-root .om-foot{grid-template-columns:1fr 1fr !important}
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
      <a href="/om" style="color:#0f1c2e">Home</a>
      <a class="navlink" href="/om/treatments">Treatments</a>
      <a class="navlink" href="/om/about">About</a>
      <a class="navlink" href="/om/contact">Contact</a>
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:10px 18px;border-radius:8px;font-weight:700">Book on WhatsApp</a>
    </div>
  </div>
</div>

<!-- hero -->
<div class="om-hero" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:48px;align-items:center;padding:64px 32px 56px">
  <div>
    <div style="display:inline-flex;align-items:center;gap:8px;font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9;background:#eef4fd;padding:7px 12px;border-radius:100px">SINGAPORE AESTHETIC MEDICINE CLINIC</div>
    <h1 style="font:800 56px/1.02 'Archivo';letter-spacing:-.02em;margin:20px 0 0">Confident skin,<br>backed by the<br>science of lifting.</h1>
    <p style="font-size:17.5px;line-height:1.6;color:#43566b;max-width:460px;margin:22px 0 0">A doctor-led clinic where every treatment is chosen for evidence, precision and natural results, from non-surgical lifting to injectables and skin health.</p>
    <div style="display:flex;gap:14px;margin-top:30px;flex-wrap:wrap">
      <a href="https://api.whatsapp.com/send?phone=6588947314" style="background:#1257c9;color:#fff;padding:15px 26px;border-radius:9px;font:700 15px 'Archivo'">Book a consultation</a>
      <a href="/om/treatments" style="border:1.5px solid #d3dbe6;color:#0f1c2e;padding:15px 24px;border-radius:9px;font:700 15px 'Archivo'">Explore treatments</a>
    </div>
    <div style="display:flex;gap:26px;margin-top:34px;flex-wrap:wrap">
      <div><div style="font:800 26px 'Archivo';color:#1257c9">15+</div><div style="font-size:12.5px;color:#5b6f88">years in practice</div></div>
      <div style="border-left:1px solid #e4e9f0;padding-left:26px"><div style="font:800 26px 'Archivo';color:#1257c9">FDA</div><div style="font-size:12.5px;color:#5b6f88">cleared technology</div></div>
      <div style="border-left:1px solid #e4e9f0;padding-left:26px"><div style="font:800 26px 'Archivo';color:#1257c9">AAAM</div><div style="font-size:12.5px;color:#5b6f88">board certified</div></div>
    </div>
  </div>
  <div style="position:relative;aspect-ratio:4/5;border-radius:18px;overflow:hidden;background:url('/om/assets/model-zones.jpg') 50% 25%/cover no-repeat, radial-gradient(120% 120% at 70% 20%,#e7f0fe,#cfe0f8)">
    <div style="position:absolute;left:18px;bottom:18px;background:rgba(255,255,255,.94);backdrop-filter:blur(4px);border-radius:11px;padding:12px 16px">
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.06em;color:#1257c9">MICRO-FOCUSED ULTRASOUND</div>
      <div style="font:600 12.5px 'Archivo';color:#5b6f88;margin-top:2px">lift &amp; firm, zero downtime</div>
    </div>
  </div>
</div>

<!-- logos / trust strip -->
<div style="border-top:1px solid #eaeef4;border-bottom:1px solid #eaeef4;background:#f6f9fd">
  <div style="max-width:1200px;margin:0 auto;display:flex;flex-wrap:wrap;gap:14px 40px;align-items:center;justify-content:center;padding:22px 32px;font:700 12.5px 'Space Mono',monospace;letter-spacing:.06em;color:#5b6f88">
    <span>ULTHERAPY</span><span style="color:#c7d2e0">/</span><span>REJURAN</span><span style="color:#c7d2e0">/</span><span>JUVELOOK</span><span style="color:#c7d2e0">/</span><span>LENISNA</span><span style="color:#c7d2e0">/</span><span>MERZ AESTHETICS</span>
  </div>
</div>

<!-- treatments -->
<div style="max-width:1200px;margin:0 auto;padding:72px 32px 20px">
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:32px">
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">WHAT WE DO</div>
      <h2 style="font:700 38px/1.05 'Archivo';letter-spacing:-.01em;margin:12px 0 0">Treatments, chosen with intent</h2>
    </div>
    <p style="font-size:15px;color:#43566b;max-width:360px;margin:0">Every protocol is doctor-planned and tailored, never a one-size menu. Here is where most journeys begin.</p>
  </div>
  <div class="om-3col" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    <a href="/om/treatments" class="tcard" style="grid-column:span 1;border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column;background:#0f1c2e;color:#fff">
      <div style="font:700 10.5px 'Space Mono',monospace;letter-spacing:.1em;color:#6ea2f0">FEATURED</div>
      <div style="font:700 21px 'Archivo';margin:10px 0 6px;color:#fff">Ultherapy PRIME</div>
      <div style="font-size:13.5px;color:#b7c4d6;line-height:1.55;flex:1">Non-surgical lifting with micro-focused ultrasound, reaching the same deep layer a facelift targets.</div>
      <div style="margin-top:18px;font:700 13px 'Archivo';color:#fff">View treatment &rarr;</div>
    </a>
    <div class="tcard" style="border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column">
      <div style="width:42px;height:42px;border-radius:11px;background:#eef4fd;margin-bottom:14px"></div>
      <div style="font:700 18px 'Archivo';margin-bottom:6px">Injectables</div>
      <div style="font-size:13.5px;color:#5b6f88;line-height:1.55;flex:1">Wrinkle-relaxing and dermal filler treatments for balance, contour and softened lines.</div>
    </div>
    <div class="tcard" style="border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column">
      <div style="width:42px;height:42px;border-radius:11px;background:#e7f0e9;margin-bottom:14px"></div>
      <div style="font:700 18px 'Archivo';margin-bottom:6px">Skinboosters</div>
      <div style="font-size:13.5px;color:#5b6f88;line-height:1.55;flex:1">Regenerative injectables like Rejuran and Juvelook for hydration, glow and skin quality.</div>
    </div>
    <div class="tcard" style="border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column">
      <div style="width:42px;height:42px;border-radius:11px;background:#fbe9e4;margin-bottom:14px"></div>
      <div style="font:700 18px 'Archivo';margin-bottom:6px">Thread Lifts</div>
      <div style="font-size:13.5px;color:#5b6f88;line-height:1.55;flex:1">Absorbable threads that reposition and support for an immediate, natural lift.</div>
    </div>
    <div class="tcard" style="border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column">
      <div style="width:42px;height:42px;border-radius:11px;background:#f3ecff;margin-bottom:14px"></div>
      <div style="font:700 18px 'Archivo';margin-bottom:6px">Laser &amp; Pigment</div>
      <div style="font-size:13.5px;color:#5b6f88;line-height:1.55;flex:1">Targeted laser protocols for pigmentation, redness, texture and overall clarity.</div>
    </div>
    <div class="tcard" style="border:1px solid #e4e9f0;border-radius:14px;padding:26px;display:flex;flex-direction:column">
      <div style="width:42px;height:42px;border-radius:11px;background:#fef3d9;margin-bottom:14px"></div>
      <div style="font:700 18px 'Archivo';margin-bottom:6px">Skin Health</div>
      <div style="font-size:13.5px;color:#5b6f88;line-height:1.55;flex:1">Medical facials and maintenance plans that keep results looking effortless.</div>
    </div>
  </div>
</div>

<!-- why choose us / award -->
<div style="background:#f6f9fd;border-top:1px solid #eaeef4;border-bottom:1px solid #eaeef4;margin-top:64px">
  <div class="om-split" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:44px;align-items:center;padding:64px 32px">
    <div style="aspect-ratio:4/5;border-radius:14px;overflow:hidden;background:url('/om/assets/award.jpg') 26% 50%/cover no-repeat, #efe7d5"></div>
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">WHY CHOOSE US</div>
      <h2 style="font:700 34px/1.08 'Archivo';letter-spacing:-.01em;margin:12px 0 8px">Treated by a doctor others learn from</h2>
      <p style="font-size:15.5px;line-height:1.65;color:#43566b;max-width:560px;margin:0 0 22px">Your treatment is performed by a physician who is not only highly experienced, but trusted to train and share knowledge with other doctors across the region.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        <span style="font:600 12.5px 'Archivo';background:#fff;border:1px solid #dbe4f0;color:#1257c9;padding:9px 15px;border-radius:100px">Merz Ultherapy Gold Award 2024</span>
        <span style="font:600 12.5px 'Archivo';background:#fff;border:1px solid #dbe4f0;color:#1257c9;padding:9px 15px;border-radius:100px">Certified Trainer, HA Fillers</span>
        <span style="font:600 12.5px 'Archivo';background:#fff;border:1px solid #dbe4f0;color:#1257c9;padding:9px 15px;border-radius:100px">Int'l Speaker, Juvelook &amp; Lenisna</span>
        <span style="font:600 12.5px 'Archivo';background:#fff;border:1px solid #dbe4f0;color:#1257c9;padding:9px 15px;border-radius:100px">Regional Trainer, Rejuran</span>
      </div>
    </div>
  </div>
</div>

<!-- process -->
<div style="max-width:1200px;margin:0 auto;padding:72px 32px">
  <div style="text-align:center;margin-bottom:40px">
    <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">HOW IT WORKS</div>
    <h2 style="font:700 38px/1.05 'Archivo';letter-spacing:-.01em;margin:12px 0 0">Three steps, no guesswork</h2>
  </div>
  <div class="om-3col" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:30px">
      <div style="font:700 13px 'Space Mono',monospace;color:#1257c9">01</div>
      <div style="font:700 20px 'Archivo';margin:12px 0 6px">Consultation</div>
      <div style="font-size:14px;color:#5b6f88;line-height:1.6">The doctor assesses your skin, listens to your goals and explains what will and won't help, honestly.</div>
    </div>
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:30px">
      <div style="font:700 13px 'Space Mono',monospace;color:#1257c9">02</div>
      <div style="font:700 20px 'Archivo';margin:12px 0 6px">Tailored plan</div>
      <div style="font-size:14px;color:#5b6f88;line-height:1.6">A protocol built around your face and timeline, single treatment or a considered combination.</div>
    </div>
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:30px">
      <div style="font:700 13px 'Space Mono',monospace;color:#1257c9">03</div>
      <div style="font:700 20px 'Archivo';margin:12px 0 6px">Results &amp; review</div>
      <div style="font-size:14px;color:#5b6f88;line-height:1.6">Collagen rebuilds over the following months. We review together and fine-tune your maintenance.</div>
    </div>
  </div>
</div>

<!-- doctor -->
<div style="background:#0f1c2e;color:#fff">
  <div class="om-split" style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:44px;align-items:center;padding:64px 32px">
    <div style="aspect-ratio:3/4;border-radius:14px;overflow:hidden;background:url('/om/assets/dr-neil-scrubs.png') 50% top/cover no-repeat, linear-gradient(160deg,#1c2c42,#243851)"></div>
    <div>
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#6ea2f0">YOUR DOCTOR</div>
      <h2 style="font:700 34px 'Archivo';margin:10px 0 4px">Dr Neil (Nilesh Pawar)</h2>
      <p style="font-size:15px;line-height:1.65;color:#b7c4d6;max-width:580px;margin:8px 0 20px">Board Certified in Aesthetic Medicine (AAAM, USA), one of very few accredited in Singapore, with a Distinction in Clinical Dermatology (UK). He is known for natural, artistic results and his own combination protocols for lifting and slimming.</p>
      <a href="/om/about" style="color:#fff;font:700 14px 'Archivo';border-bottom:1.5px solid rgba(255,255,255,.4);padding-bottom:2px">Read his full story &rarr;</a>
    </div>
  </div>
</div>

<!-- testimonials -->
<div style="max-width:1200px;margin:0 auto;padding:72px 32px">
  <div style="text-align:center;margin-bottom:40px">
    <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">IN THEIR WORDS</div>
    <h2 style="font:700 38px/1.05 'Archivo';letter-spacing:-.01em;margin:12px 0 0">Patients who felt heard</h2>
  </div>
  <div class="om-3col" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:28px">
      <div style="color:#f2b705;font-size:15px;letter-spacing:2px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;line-height:1.6;color:#2b3a4d;margin:14px 0 20px">&ldquo;I never felt pushed into anything. The plan was clear, the lift is subtle, and I still look like myself, just fresher.&rdquo;</p>
      <div style="display:flex;align-items:center;gap:11px"><div style="width:38px;height:38px;border-radius:50%;background:#eef4fd;display:flex;align-items:center;justify-content:center;font:700 13px 'Archivo';color:#1257c9">SL</div><div><div style="font:700 13px 'Archivo'">Serene L.</div><div style="font-size:12px;color:#5b6f88">Ultherapy PRIME</div></div></div>
    </div>
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:28px">
      <div style="color:#f2b705;font-size:15px;letter-spacing:2px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;line-height:1.6;color:#2b3a4d;margin:14px 0 20px">&ldquo;What stood out was the honesty. He told me what I didn't need, which is why I trusted what he did recommend.&rdquo;</p>
      <div style="display:flex;align-items:center;gap:11px"><div style="width:38px;height:38px;border-radius:50%;background:#e7f0e9;display:flex;align-items:center;justify-content:center;font:700 13px 'Archivo';color:#2f7d52">MT</div><div><div style="font:700 13px 'Archivo'">Marcus T.</div><div style="font-size:12px;color:#5b6f88">Skinboosters</div></div></div>
    </div>
    <div style="border:1px solid #e4e9f0;border-radius:14px;padding:28px">
      <div style="color:#f2b705;font-size:15px;letter-spacing:2px">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
      <p style="font-size:15px;line-height:1.6;color:#2b3a4d;margin:14px 0 20px">&ldquo;Calm clinic, zero downtime, and my jawline looks defined again. Worth every visit and I've already rebooked.&rdquo;</p>
      <div style="display:flex;align-items:center;gap:11px"><div style="width:38px;height:38px;border-radius:50%;background:#fbe9e4;display:flex;align-items:center;justify-content:center;font:700 13px 'Archivo';color:#b5573c">AH</div><div><div style="font:700 13px 'Archivo'">Adeline H.</div><div style="font-size:12px;color:#5b6f88">Thread Lift</div></div></div>
    </div>
  </div>
</div>

<!-- faq -->
<div style="background:#f6f9fd;border-top:1px solid #eaeef4">
  <div style="max-width:820px;margin:0 auto;padding:72px 32px">
    <div style="text-align:center;margin-bottom:36px">
      <div style="font:700 11px 'Space Mono',monospace;letter-spacing:.12em;color:#1257c9">GOOD TO KNOW</div>
      <h2 style="font:700 38px/1.05 'Archivo';letter-spacing:-.01em;margin:12px 0 0">Frequently asked</h2>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      <details style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 24px"><summary style="display:flex;justify-content:space-between;align-items:center;font:700 16px 'Archivo'">Is there any downtime?<span class="faq-plus" style="font-size:22px;color:#1257c9;font-weight:400;transition:transform .2s">+</span></summary><p style="font-size:14.5px;color:#5b6f88;line-height:1.6;margin:14px 0 0">Most treatments have little to no downtime. You can usually return to your day right after, and the doctor will flag anything specific during your consultation.</p></details>
      <details style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 24px"><summary style="display:flex;justify-content:space-between;align-items:center;font:700 16px 'Archivo'">When will I see results?<span class="faq-plus" style="font-size:22px;color:#1257c9;font-weight:400;transition:transform .2s">+</span></summary><p style="font-size:14.5px;color:#5b6f88;line-height:1.6;margin:14px 0 0">Some treatments give an immediate effect, while collagen-based lifting builds gradually over two to three months and can continue to improve after that.</p></details>
      <details style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 24px"><summary style="display:flex;justify-content:space-between;align-items:center;font:700 16px 'Archivo'">How do I know what I need?<span class="faq-plus" style="font-size:22px;color:#1257c9;font-weight:400;transition:transform .2s">+</span></summary><p style="font-size:14.5px;color:#5b6f88;line-height:1.6;margin:14px 0 0">That's exactly what the consultation is for. The doctor assesses your skin in person and recommends only what genuinely suits your goals.</p></details>
      <details style="background:#fff;border:1px solid #e4e9f0;border-radius:12px;padding:20px 24px"><summary style="display:flex;justify-content:space-between;align-items:center;font:700 16px 'Archivo'">How do I book?<span class="faq-plus" style="font-size:22px;color:#1257c9;font-weight:400;transition:transform .2s">+</span></summary><p style="font-size:14.5px;color:#5b6f88;line-height:1.6;margin:14px 0 0">The fastest way is WhatsApp. Message us and our team will help you find a consultation slot that works for you.</p></details>
    </div>
  </div>
</div>

<!-- cta -->
<div style="background:#1257c9;color:#fff">
  <div style="max-width:1200px;margin:0 auto;padding:56px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap">
    <div><h2 style="font:800 32px 'Archivo';margin:0 0 6px">Book your consultation</h2><p style="margin:0;color:#cfe0fb;font-size:15px">A clear, honest assessment with Dr Neil, no obligation.</p></div>
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

export default function OmAestheticsPage() {
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
