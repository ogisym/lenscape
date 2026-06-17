import { useState, useEffect, useId, useRef } from "react";
import "./App.css";

/* ============================================================
   PODESI OVDE  —  sve što menjaš je na ovom mestu.
   Promeni broj telefona, mejl, grad i linkove ka mrežama.
   ============================================================ */
const CONFIG = {
  brand: "Lenscape",
  tagline: "Ti živi u trenutku, ja sam tu da ga učinim večnim.",
  motto: "Uhvaćeni u pokretu. Sačuvani od zaborava.",
  intro:
    "Profesionalna fotografija za ljude i mašine — svaki kadar ispričan kako treba.",
  city: "Beograd, Srbija", // promeni svoj grad
  phone: "+381 64 9311765", // upiši svoj broj
  email: "kontakt@lenscapers.rs", // upiši svoj mejl
  // Web3Forms ključ — zameni ovo svojim "access key" sa https://web3forms.com
  // (upišeš svoj mejl, stigne ti ključ; mejlovi sa forme stižu na taj mejl):
  web3formsKey: "74752800-e347-4547-b2ec-8ded9aeb1ae5",
  // Linkovi ka mrežama — zameni '#' svojim profilima kad ih napraviš:
  social: {
    instagram: "#",
    tiktok: "#",
    youtube: "#",
  },
  // Brojke koje grade poverenje (slobodno promeni):
  stats: [
    { num: "50+", label: "snimanja" },
    { num: "3", label: "godina iskustva" },
    { num: "100%", label: "zadovoljnih klijenata" },
  ],
};

/* Usluge */
const SERVICES = [
  {
    icon: "🎂",
    title: "Rođendani & proslave",
    text: "Od prve sveće do poslednjeg plesa — sve emocije na jednom mestu.",
  },
  {
    icon: "🚗",
    title: "Automobili",
    text: "Dinamični i studijski kadrovi koji ističu svaku liniju vozila.",
  },
  {
    icon: "👤",
    title: "Portreti & ljudi",
    text: "Lični portreti, biznis fotografije i porodični kadrovi sa karakterom.",
  },
];

/* Galerija — placeholder fotke (zameni svojim slikama kasnije).
   'cat' služi za filtriranje. */
const GALLERY = [
  { id: 1, cat: "Ljudi", seed: "people1" },
  { id: 2, cat: "Automobili", seed: "car1" },
  { id: 3, cat: "Proslave", seed: "party1" },
  { id: 4, cat: "Vozila", seed: "bus1" },
  { id: 5, cat: "Ljudi", seed: "people2" },
  { id: 6, cat: "Automobili", seed: "car2" },
  { id: 7, cat: "Proslave", seed: "party2" },
  { id: 8, cat: "Ljudi", seed: "people3" },
  { id: 9, cat: "Automobili", seed: "car3" },
  { id: 10, cat: "Vozila", seed: "bus2" },
  { id: 11, cat: "Proslave", seed: "party3" },
  { id: 12, cat: "Ljudi", seed: "people4" },
];
const CATEGORIES = ["Sve", "Ljudi", "Proslave", "Automobili", "Vozila"];

/* placeholder slika preko picsum.photos — kasnije menjaš svojim fotkama */
const img = (seed, w = 600, h = 700) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* Logo — objektiv sa odsjajem (boju nasleđuje iz currentColor) */
function Logo({ className }) {
  const clipId = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 380 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="translate(190,190)" stroke="currentColor">
        <circle cx="0" cy="0" r="175" strokeWidth="14" />
        <circle cx="0" cy="0" r="120" strokeWidth="9" />
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r="116" />
        </clipPath>
        <g clipPath={`url(#${clipId})`} fill="currentColor" stroke="none">
          <path d="M -90,-95 C -40,-130 60,-120 95,-70 C 50,-95 -30,-90 -70,-50 C -95,-25 -100,-60 -90,-95 Z" />
          <path d="M 30,40 C 55,25 85,35 95,60 C 70,50 45,55 30,75 C 18,60 18,52 30,40 Z" />
        </g>
      </g>
    </svg>
  );
}

function Icon({ name }) {
  const paths = {
    instagram: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
    youtube: (
      <>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

/* TikTok ima poseban (popunjen) logo */
function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

function SocialLinks({ size = "md" }) {
  const { social } = CONFIG;
  return (
    <div className={`socials socials--${size}`}>
      <a
        href={social.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
      >
        <Icon name="instagram" />
      </a>
      <a
        href={social.tiktok}
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
      >
        <TikTokIcon />
      </a>
      <a
        href={social.youtube}
        target="_blank"
        rel="noreferrer"
        aria-label="YouTube"
      >
        <Icon name="youtube" />
      </a>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("Sve");
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
  const galleryRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-slajder galerije — samo na telefonu (≤600px).
  // Menja sliku svake 3s; pauzira dok korisnik prevlači prstom.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 600px)");
    let timer = null;
    let paused = false;

    const slideNext = () => {
      if (paused) return;
      const w = el.clientWidth;
      const maxScroll = el.scrollWidth - w;
      const next = el.scrollLeft + w > maxScroll + 2 ? 0 : el.scrollLeft + w;
      el.scrollTo({ left: next, behavior: "smooth" });
    };
    const start = () => {
      stop();
      if (mq.matches) timer = setInterval(slideNext, 3000);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const onDown = () => {
      paused = true;
      stop();
    };
    const onUp = () => {
      paused = false;
      start();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    mq.addEventListener("change", start);
    start();

    return () => {
      stop();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      mq.removeEventListener("change", start);
    };
  }, [filter]);

  const visible =
    filter === "Sve" ? GALLERY : GALLERY.filter((g) => g.cat === filter);

  const navLinks = [
    ["#usluge", "Usluge"],
    ["#galerija", "Galerija"],
    ["#o-nama", "O nama"],
    ["#kontakt", "Kontakt"],
  ];

  return (
    <div className="app">
      {/* ---------- NAV ---------- */}
      <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
        <div className="container nav__inner">
          <a href="#top" className="brand">
            <Logo className="brand__mark" />
            {CONFIG.brand}
          </a>

          <nav className={`nav__links ${menuOpen ? "is-open" : ""}`}>
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="btn btn--small nav__cta"
              onClick={() => setMenuOpen(false)}
            >
              Zakaži termin
            </a>
          </nav>

          <button
            className="nav__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Meni"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="hero" id="top">
        <div className="container hero__inner">
          <div className="hero__text">
            <h1>{CONFIG.tagline}</h1>
            <p className="hero__motto">{CONFIG.motto}</p>
            <p className="hero__lead">{CONFIG.intro}</p>
            <div className="hero__actions">
              <a href="#galerija" className="btn btn--ghost">
                Pogledaj radove
              </a>
            </div>
            <SocialLinks />
          </div>

          <div className="hero__gallery">
            <div className="hero__col">
              <img src={img("hero-a", 500, 620)} alt="" />
              <img src={img("hero-b", 500, 400)} alt="" />
            </div>
            <div className="hero__col hero__col--down">
              <img src={img("hero-c", 500, 420)} alt="" />
              <img src={img("hero-d", 500, 600)} alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="stats">
        <div className="container stats__grid">
          {CONFIG.stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat__num">{s.num}</span>
              <span className="stat__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- USLUGE ---------- */}
      <section className="section" id="usluge">
        <div className="container">
          <div className="section__head">
            <h2>Usluge po meri</h2>
            <p className="section__sub">
              Sve redom — od najtoplijih porodičnih trenutaka do moćnih kadrova
              vozila.
            </p>
          </div>
          <div className="cards">
            {SERVICES.map((s) => (
              <article key={s.title} className="card">
                <div className="card__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- O NAMA ---------- */}
      <section className="section section--alt about" id="o-nama">
        <div className="container about__inner">
          <div className="about__img">
            <img src={img("about", 600, 720)} alt="Fotograf" />
          </div>
          <div className="about__text">
            <p className="eyebrow">O nama</p>
            <h2>Strast prema svetlu i detalju</h2>
            <p>
              {CONFIG.brand} je nastao iz ljubavi prema priči koju jedna
              fotografija može da ispriča. Bilo da je u pitanju osmeh na
              proslavi ili odsjaj na haubi automobila — tražim onaj jedan kadar
              koji ostaje.
            </p>
            <a href="#kontakt" className="btn">
              Hajde da sarađujemo
            </a>
          </div>
        </div>
      </section>

      {/* ---------- GALERIJA ---------- */}
      <section className="section" id="galerija">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Portfolio</p>
            <h2>Izabrani radovi</h2>
            <p className="section__sub">
              Placeholder fotografije — uskoro pravi radovi. Filtriraj po
              kategoriji.
            </p>
          </div>

          <div className="filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${filter === c ? "is-active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="masonry" ref={galleryRef}>
            {visible.map((g) => (
              <figure key={g.id} className="tile">
                <img src={img(g.seed)} alt={g.cat} loading="lazy" />
                <figcaption>{g.cat}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KONTAKT ---------- */}
      <section className="section section--alt contact" id="kontakt">
        <div className="container contact__inner">
          <div className="contact__info">
            <p className="eyebrow">Kontakt</p>
            <h2>Rezerviši svoj termin</h2>
            <ul className="contact__list">
              <li>
                <span>Telefon</span>
                <a href={`tel:${CONFIG.phone.replace(/\s/g, "")}`}>
                  {CONFIG.phone}
                </a>
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
              </li>
              <li>
                <span>Lokacija</span>
                {CONFIG.city}
              </li>
            </ul>
            <SocialLinks size="lg" />
          </div>

          <form
            className="contact__form"
            onSubmit={async (e) => {
              e.preventDefault();
              const f = e.target;
              setFormStatus("sending");
              try {
                const res = await fetch("https://api.web3forms.com/submit", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify({
                    access_key: CONFIG.web3formsKey,
                    subject: `Nova prijava za snimanje — ${f.ime.value}`,
                    from_name: `${CONFIG.brand} sajt`,
                    ime: f.ime.value,
                    telefon: f.tel.value,
                    poruka: f.poruka.value,
                    botcheck: f.botcheck.checked,
                  }),
                });
                const data = await res.json();
                if (data.success) {
                  setFormStatus("success");
                  f.reset();
                } else {
                  setFormStatus("error");
                }
              } catch {
                setFormStatus("error");
              }
            }}
          >
            {/* anti-spam: skriveno polje koje samo botovi popunjavaju */}
            <input
              type="checkbox"
              name="botcheck"
              className="hp-field"
              tabIndex={-1}
              autoComplete="off"
            />
            <label>
              Ime i prezime
              <input name="ime" type="text" required placeholder="Tvoje ime" />
            </label>
            <label>
              Telefon
              <input name="tel" type="tel" placeholder="06X..." />
            </label>
            <label>
              Poruka
              <textarea
                name="poruka"
                rows="4"
                required
                placeholder="Kakvo snimanje te zanima?"
              />
            </label>
            <button
              className="btn btn--full"
              type="submit"
              disabled={formStatus === "sending"}
            >
              {formStatus === "sending" ? "Šaljem…" : "Pošalji upit"}
            </button>
            {formStatus === "success" && (
              <p className="form-msg form-msg--ok">
                ✓ Hvala! Javljamo se uskoro.
              </p>
            )}
            {formStatus === "error" && (
              <p className="form-msg form-msg--err">
                Greška pri slanju. Pokušaj ponovo ili nas pozovi direktno.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <div className="container footer__inner">
          <a href="#top" className="brand brand--light">
            <Logo className="brand__mark" />
            {CONFIG.brand}
          </a>
          <p className="footer__tag">{CONFIG.tagline}</p>
          <SocialLinks />
          <p className="footer__copy">
            © {new Date().getFullYear()} {CONFIG.brand}. Sva prava zadržana.
          </p>
        </div>
      </footer>
    </div>
  );
}
