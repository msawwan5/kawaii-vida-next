import { ClawCanvas, DecoCanvas, SiteEffects } from "@/components/SiteEffects";
import { MobileNav } from "@/components/MobileNav";
import type React from "react";

const decoItems = [
  ["phone", "Phone Case", "$25"],
  ["heart-mirror", "Heart Mirror", "$9"],
  ["brush", "Brush", "$9"],
  ["hair-clip", "Hair Clips", "2 for $8"],
  ["claw-clip", "Claw Clip", "$9"],
  ["jewelry-box", "Jewelry Box", "$28"],
  ["heart-purse", "Heart Purse", "$28"],
  ["instax-frame", "Instax Frame + Photo", "$15"],
  ["custom", "Custom Item", "Ask Us!"],
];

const lattes = [
  ["🌾", "Horchata", "$7.00", "$8.00"],
  ["🍰", "Tres Leches", "$7.00", "$8.00"],
  ["🌹", "Rose", "$7.00", "$8.00"],
  ["💜", "Ube", "$7.00", "$8.00"],
  ["✨", "The Simple", "$6.00", "$7.00"],
  ["🍓", "Strawberries & Crema Matcha", "—", "$8.00"],
  ["🍵", "Pistachio Cafe", "$7.00", "—"],
];

const shop = [
  ["🧸", "Kawaii Plushies", "Cinnamoroll, Pokemon, anime & more — soft, squishy, and irresistibly cute.", "Fan Fave", "plush"],
  ["🎁", "Blind Boxes", "Mystery collectibles — will you pull the secret rare? The thrill is half the fun.", "New In", "blind"],
  ["🧍", "Anime Figures", "Chibi figures and collector pieces from your favorite series.", "", "anime"],
  ["🍿", "Exotic Snacks", "Buldak chips, Japanese mochi, Korean sweets & more — always rotating.", "Imported", "snacks"],
  ["💍", "Accessories & Gifts", "Beaded jewelry, charms, keychains, and the cutest little gifts for someone special.", "", "gifts"],
];

const snacks = [
  ["🧀", "Buldak Cheddar Cheese", "🌶️ Medium"],
  ["🌶️", "Buldak Habanero Lime", "🌶️🌶️ Hot"],
  ["🔥", "Buldak Original", "🌶️🌶️🌶️ Extra Hot"],
  ["🍡", "Mini Mochi Treats", "🍬 Sweet"],
  ["🐢", "Turtle Chips", "🌿 Mild"],
  ["🔮", "Mystery Snack of the Week", "🌟 Always Rotating"],
];

const events = [
  ["Jun", "5-7", "Soft Opening 🎀", "Join us for our soft opening weekend with studio sessions, dreamy lattes, kawaii gifts, claw machines, and sweet first-look vibes.", "Soft Opening"],
];

export default function Home() {
  return (
    <>
      <SiteEffects />
      <nav>
        <a className="nav-logo-wrap" href="#home" aria-label="Kawaii Vida home">
          <img className="brand-mark" src="/Logo.png" alt="" />
          <span className="nav-logo-text">kawaii vida</span>
        </a>
        <ul className="nav-links">
          <li><a href="#studio">DIY Studio</a></li>
          <li><a href="#drinks">Latte Bar</a></li>
          <li><a href="#shop">Gift Shop</a></li>
          <li><a href="#events">Soft Opening</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact" className="nav-cta">Visit Us 🌸</a></li>
        </ul>
        <MobileNav />
      </nav>

      <main>
        <section id="home">
          <div className="floater-wrap" aria-hidden="true">
            {["🎨", "✨", "🌸", "🧸", "💮", "🎀", "📱", "💅"].map((item, index) => (
              <span className={`floater floater-${index}`} key={item}>{item}</span>
            ))}
          </div>
          <div className="hero-inner">
            <img className="hero-logo" src="/Logo.png" alt="Kawaii Vida" />
            <div className="hero-eyebrow">✿ DIY Craft Studio · Latte Bar · Gift Shop · Baltimore, MD</div>
            <h1 className="hero-title">
              <span className="pop">Create.</span> Sip. Explore.
              <span className="sub-line">Baltimore&apos;s kawaii craft studio & latte bar</span>
            </h1>
            <p className="hero-desc">
              Customize your own deco cream phone case, mirror, hair clip & more — then sip a dreamy latte, shop kawaii gifts, and try your luck at our claw machines. All in one magical studio. 🌸
            </p>
            <div className="hero-btns">
              <a href="#studio" className="btn btn-primary">Start Creating 🎨</a>
              <a href="#drinks" className="btn btn-outline">View Latte Menu ☕</a>
            </div>
            <div className="hero-pills">
              {["🍬 Deco Cream", "☕ Latte Bar", "🕹️ Claw Machines", "🎁 Blind Boxes"].map((pill) => (
                <span className="hero-pill" key={pill}>{pill}</span>
              ))}
            </div>
          </div>
        </section>

        <Wave fill="#fffcfd" />

        <section id="studio">
          <div className="section-wrap">
            <div className="studio-intro">
              <div className="reveal canvas-wrap"><DecoCanvas /></div>
              <div className="reveal">
                <div className="section-tag">✿ The Studio</div>
                <h2 className="section-title">DIY Craft <span className="accent">Studio</span></h2>
                <p className="section-sub compact">
                  Walk in or book a session — our studio is your creative playground. Pick your canvas, load up on deco cream, gems, and charms, and make something totally yours. No experience needed, just good vibes. 🌸
                </p>
                <div className="info-chips">
                  <span className="chip">🚶 Walk-ins Welcome</span>
                  <span className="chip">👩‍🎨 All Skill Levels</span>
                  <span className="chip green">🎂 10+ Party Reservations</span>
                </div>
              </div>
            </div>

            <div className="deco-spotlight reveal">
              <div>
                <div className="section-tag">⭐ Our Specialty</div>
                <h3>Deco Cream <span>Customization</span></h3>
                <p>Use fluffy deco cream, resin gems, kawaii charms, pearls, and flowers to decorate your item into a one-of-a-kind masterpiece. Every piece is sealed and ready to show off. ✨</p>
              </div>
              <div className="deco-items-grid">
                {decoItems.map(([icon, name, price]) => (
                  <div className="deco-item" key={name}>
                    <span className={`di-emoji di-${icon}`} aria-hidden="true" />
                    <div className="di-name">{name}</div>
                    <div className="di-price">{price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="booking-banner reveal">
              <div>
                <h3>Party Reservations 📅</h3>
                <p>Reservations are available for parties of 10 or more only. Email us about your group and we&apos;ll help you plan your visit.</p>
              </div>
              <div className="booking-actions">
                <a href="mailto:kawaiividabaltimore@gmail.com?subject=Kawaii%20Vida%20Event%20Inquiry" className="btn btn-white">Email Us ✨</a>
                <span>kawaiividabaltimore@gmail.com</span>
              </div>
            </div>
          </div>
        </section>

        <Wave fill="#fff0f8" background="#fffcfd" />

        <section id="drinks">
          <div className="section-wrap">
            <SectionIntro tag="☕ Latte Bar" title={<>The <span className="accent">Kawaii</span> Latte Bar</>} copy="Sip something dreamy while you create. All lattes made with whole or oat milk." center />
            <div className="drinks-layout reveal">
              <div className="latte-card">
                <h3>☕ Our Lattes</h3>
                <div className="col-headers"><span>Latte</span><span>☕ Espresso</span><span>🍵 Matcha</span></div>
                {lattes.map(([emoji, name, espresso, matcha]) => (
                  <div className="latte-row" key={name}>
                    <div className="ln"><span className="le">{emoji}</span>{name}</div>
                    <div className={espresso === "—" ? "lp na" : "lp"}>{espresso}</div>
                    <div className={matcha === "—" ? "lp na" : "lp"}>{matcha}</div>
                  </div>
                ))}
                <div className="milk-note">🥛 Whole or Oat Milk on all lattes</div>
              </div>
              <div className="order-panel">
                <span className="op-emoji">☕</span>
                <h3>Order Online</h3>
                <p>Order your latte ahead of time and have it ready when you arrive at the studio!</p>
                <a href="#" className="btn btn-primary full-btn">Order on Toast ☕</a>
                <span className="order-coming">✿ Online ordering coming soon!</span>
                <div className="dessert-note">
                  <strong>🍰 Desserts</strong>
                  <p>Tres Leches Cake · Kawaii Macarons<br /><span>+ Rotating seasonal specials</span></p>
                  <span className="order-coming">✿ Full dessert menu dropping soon</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Wave fill="#fffcfd" background="#fff0f8" flip />

        <section id="shop">
          <div className="section-wrap">
            <SectionIntro tag="🛍️ Gift Shop" title={<>Kawaii <span className="accent">Gift Shop</span></>} copy="Hand-picked kawaii goods, imported snacks, blind boxes, collectibles, and craft add-ons." />
            <div className="shop-grid">
              {shop.map(([emoji, title, desc, badge, tone]) => (
                <article className="shop-card reveal" key={title}>
                  <div className={`sc-img ${tone}`}>{badge ? <div className="sc-badge">{badge}</div> : null}<span>{emoji}</span></div>
                  <div className="sc-body"><div className="sc-name">{title}</div><p className="sc-desc">{desc}</p></div>
                </article>
              ))}
            </div>
            <div className="reveal snack-heading"><div className="activities-title">🍿 Current Snack Selection</div></div>
            <div className="snack-strip">
              {snacks.map(([emoji, name, heat], index) => (
                <div className={`snack-row reveal ${index === snacks.length - 1 ? "mystery" : ""}`} key={name}>
                  <span className="sr-emoji">{emoji}</span>
                  <div><div className="sr-name">{name}</div><div className="sr-heat">{heat}</div></div>
                </div>
              ))}
            </div>
            <div className="claw-banner reveal">
              <div className="claw-text">
                <h3>Claw Machines 🎀</h3>
                <p>Test your skills on our kawaii claw machines loaded with plushies, blind box prizes, and surprise goodies. Win your new favorite toy — or keep trying, we dare you! 😄</p>
                <span className="claw-tag">✿ In-Store Only</span>
              </div>
              <ClawCanvas />
            </div>
          </div>
        </section>

        <Wave fill="var(--lavender)" background="#fffcfd" />

        <section id="events">
          <div className="section-wrap">
            <SectionIntro tag="🎉 You're Invited" title={<>Soft <span className="accent">Opening</span></>} copy="Celebrate Kawaii Vida's soft opening from June 5th to June 7th." />
            <div className="events-grid">
              {events.map(([month, day, title, desc, tag]) => (
                <article className="event-card reveal" key={title}>
                  <div className="event-date"><span className="month">{month}</span><span className="day">{day}</span></div>
                  <div className="event-title">{title}</div>
                  <p className="event-desc">{desc}</p>
                  <span className="event-tag">{tag}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Wave fill="#fffcfd" background="var(--lavender)" flip />

        <section id="about">
          <div className="section-wrap about-grid">
            <img className="reveal about-logo-big" src="/Logo.png" alt="Kawaii Vida" />
            <div className="reveal about-text">
              <div className="section-tag">✿ Our Story</div>
              <h2 className="section-title">About <span className="accent">Kawaii Vida</span></h2>
              <p>Kawaii Vida is a Baltimore creative studio made for people who want an easy, joyful place to make something cute, sip something sweet, and hang out a while.</p>
              <p>Bring your friends, your date, your family, or just yourself. We keep the supplies ready and the vibes soft.</p>
              <div className="about-pills"><span>Latte bar</span><span>Craft studio</span><span>Gift shop</span><span>Private parties</span></div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="section-wrap">
            <SectionIntro tag="📍 Visit Us" title={<>Come <span className="accent">Create</span> With Us</>} copy="Walk in, book ahead, or message us about private parties." center />
            <div className="contact-grid reveal">
              <div className="contact-card">
                <h3>Studio Info</h3>
                <p><strong>Address</strong><br />430 S Highland Ave, Baltimore MD 21224</p>
                <p><strong>Email</strong><br />kawaiividabaltimore@gmail.com</p>
                <p><strong>Social</strong><br />@kawaiividabaltimore on Instagram & TikTok</p>
              </div>
              <div className="map-card">
                <div>📍</div>
                <strong>Kawaii Vida</strong>
                <span>Baltimore, MD</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="fl-wrap"><span className="fl-name">kawaii vida ✿</span></div>
        <p>430 S Highland Ave, Baltimore MD 21224 · kawaiivida.com</p>
        <p>@kawaiividabaltimore · kawaiividabaltimore@gmail.com</p>
        <p className="made">Made with <span className="fh">♥</span> for Baltimore&apos;s creative community</p>
      </footer>
    </>
  );
}

function SectionIntro({
  tag,
  title,
  copy,
  center = false,
}: {
  tag: string;
  title: React.ReactNode;
  copy: string;
  center?: boolean;
}) {
  return (
    <div className={`reveal section-intro ${center ? "center" : ""}`}>
      <div className="section-tag">{tag}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{copy}</p>
    </div>
  );
}

function Wave({ fill, background, flip = false }: { fill: string; background?: string; flip?: boolean }) {
  return (
    <div className={`wave ${flip ? "flip" : ""}`} style={{ background }}>
      <svg viewBox="0 0 1440 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 28C360 55 1080 0 1440 28L1440 55H0Z" fill={fill} />
      </svg>
    </div>
  );
}
