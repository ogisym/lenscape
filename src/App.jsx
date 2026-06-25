import { useState, useEffect, useId, useRef } from "react";
import "./App.css";

/* ============================================================
   PODESI OVDE  —  sve što menjaš je na ovom mestu.
   Promeni broj telefona, mejl, grad i linkove ka mrežama.
   ============================================================ */
const CONFIG = {
  brand: "Lenscapers",
  tagline: "Ti živi u trenutku, ja sam tu da ga učinim večnim.",
  motto: "Uhvaćeni u pokretu. Sačuvani od zaborava.",
  intro:
    "Profesionalna fotografija u Beogradu — portreti, rođendani i proslave, automobili. Svaki kadar ispričan kako treba.",
  city: "Beograd, Srbija", // promeni svoj grad
  phone: "+381 64 9311765", // upiši svoj broj
  email: "kontakt@lenscapers.rs", // upiši svoj mejl
  // Web3Forms ključ — zameni ovo svojim "access key" sa https://web3forms.com
  // (upišeš svoj mejl, stigne ti ključ; mejlovi sa forme stižu na taj mejl):
  web3formsKey: "74752800-e347-4547-b2ec-8ded9aeb1ae5",
  // Linkovi ka mrežama — zameni '#' svojim profilima kad ih napraviš:
  social: {
    instagram: "https://www.instagram.com/lenscapers.rs/",
    tiktok: "https://www.tiktok.com/@lenscapers",
  },
  // Brojke koje grade poverenje (slobodno promeni):
  stats: [
    { num: "50+", label: "snimanja" },
    { num: "3", label: "godina iskustva" },
    { num: "100%", label: "zadovoljnih klijenata" },
  ],
};

/* Adresa sajta uživo — koristi se za SEO (canonical, sitemap, JSON-LD). */
export const SITE_URL = "https://lenscapers.rs";

/* Usluge — svaka vodi na svoju zasebnu (SEO) stranicu */
const SERVICES = [
  {
    icon: "🎂",
    title: "Rođendani & proslave",
    text: "Od prve sveće do poslednjeg plesa — sve emocije na jednom mestu.",
    href: "/fotografisanje-rodjendana-beograd/",
  },
  {
    icon: "🚗",
    title: "Automobili",
    text: "Dinamični i studijski kadrovi koji ističu svaku liniju vozila.",
    href: "/fotograf-automobila-beograd/",
  },
  {
    icon: "👤",
    title: "Portreti & ljudi",
    text: "Lični portreti, biznis fotografije i porodični kadrovi sa karakterom.",
    href: "/portreti-beograd/",
  },
];

/* Galerija — placeholder fotke (zameni svojim slikama kasnije).
   'cat' služi za filtriranje. 'alt' je opis za Google (SEO) i pristupačnost. */
const GALLERY = [
  { id: 1, cat: "Ljudi", seed: "people1", alt: "Portret — slikanje u Beogradu" },
  { id: 2, cat: "Automobili", seed: "car1", alt: "Fotografija automobila u Beogradu" },
  { id: 3, cat: "Proslave", seed: "party1", alt: "Slikanje rođendana u Beogradu" },
  { id: 4, cat: "Vozila", seed: "bus1", alt: "Fotografija vozila u Beogradu" },
  { id: 5, cat: "Ljudi", seed: "people2", alt: "Portret osobe — fotograf Beograd" },
  { id: 6, cat: "Automobili", seed: "car2", alt: "Studijska fotografija automobila" },
  { id: 7, cat: "Proslave", seed: "party2", alt: "Fotografisanje proslave u Beogradu" },
  { id: 8, cat: "Ljudi", seed: "people3", alt: "Porodični portret u Beogradu" },
  { id: 9, cat: "Automobili", seed: "car3", alt: "Auto fotografija — Beograd" },
  { id: 10, cat: "Vozila", seed: "bus2", alt: "Reportažna fotografija vozila" },
  { id: 11, cat: "Proslave", seed: "party3", alt: "Slikanje rođendana i žurke" },
  { id: 12, cat: "Ljudi", seed: "people4", alt: "Biznis portret u Beogradu" },
];
const CATEGORIES = ["Sve", "Ljudi", "Proslave", "Automobili", "Vozila"];

/* placeholder slika preko picsum.photos — kasnije menjaš svojim fotkama */
const img = (seed, w = 600, h = 700) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* Pozadinske slike hero bloka — slajduju se svake 3s.
   Za sad no-copyright placeholderi (Lorem Picsum); kasnije zameni
   svojim fotkama (idealno tamne/atmosferične, ~1920×1080). */
const HERO_IMAGES = [
  "https://picsum.photos/seed/lens-hero-01/1920/1080",
  "https://picsum.photos/seed/lens-hero-02/1920/1080",
  "https://picsum.photos/seed/lens-hero-03/1920/1080",
  "https://picsum.photos/seed/lens-hero-04/1920/1080",
  "https://picsum.photos/seed/lens-hero-05/1920/1080",
];

/* ============================================================
   ZASEBNE STRANICE PO USLUZI  (SEO landing stranice).
   Svaka cilja svoju Google frazu (vidi `seoTitle`).
   Tekst slobodno doteruj — bitno je da se ključne reči
   ("u Beogradu", "slikanje", "portreti"...) prirodno pominju.
   ============================================================ */
const SERVICE_PAGES = {
  "/fotografisanje-rodjendana-beograd/": {
    eyebrow: "Rođendani & proslave",
    h1: "Fotografisanje rođendana u Beogradu",
    lead: "Slikanje rođendana, dečjih proslava i jubileja u Beogradu — od prve sveće do poslednjeg plesa, sve emocije ostaju zauvek.",
    cat: "Proslave",
    body: [
      "Tražite fotografa za slikanje rođendana u Beogradu? Snimam dečje rođendane, punoletstva, jubileje i porodične proslave reportažno — bez poziranja, da uhvatim pravu atmosferu žurke onako kako se desila.",
      "Radim u stanu, restoranu, sali ili na otvorenom, prilagođavam se prostoru i svetlu. Posle slikanja dobijate obrađene fotografije spremne za štampu i deljenje.",
    ],
    seoTitle:
      "Fotografisanje rođendana u Beogradu | Slikanje proslava — Lenscapers",
    seoDesc:
      "Profesionalno slikanje rođendana i proslava u Beogradu. Reportažna fotografija dečjih rođendana, punoletstava i jubileja. Zakažite termin — Lenscapers.",
  },
  "/portreti-beograd/": {
    eyebrow: "Portreti & ljudi",
    h1: "Portreti u Beogradu",
    lead: "Profesionalno slikanje portreta u Beogradu — lični, poslovni i porodični portreti sa karakterom, u studiju ili na lokaciji.",
    cat: "Ljudi",
    body: [
      "Potreban vam je portret u Beogradu — za sebe, CV, LinkedIn ili porodični album? Pravim portrete koji izgledaju prirodno, a opet doterano: vodim vas kroz poziranje i svetlo da se osećate opušteno pred objektivom.",
      "Slikanje radim u studiju ili na lokaciji po vašem izboru širom Beograda. Rezultat su obrađene fotografije visoke rezolucije, spremne za štampu i mreže.",
    ],
    seoTitle:
      "Portreti u Beogradu | Profesionalno slikanje portreta — Lenscapers",
    seoDesc:
      "Slikanje portreta u Beogradu — lični, poslovni i porodični portreti. Studijski i portreti na lokaciji. Zakažite svoj termin kod Lenscapers.",
  },
  "/fotograf-automobila-beograd/": {
    eyebrow: "Automobili & vozila",
    h1: "Fotograf automobila u Beogradu",
    lead: "Dinamično i studijsko slikanje automobila i vozila u Beogradu — kadrovi koji ističu svaku liniju i odsjaj.",
    cat: "Automobili",
    body: [
      "Slikam automobile i vozila u Beogradu — za prodaju, oglas, promociju ili lični album. Dinamični kadrovi u pokretu i čisti studijski snimci koji prikazuju vozilo u najboljem svetlu.",
      "Bilo da je u pitanju polovnjak za oglas ili ljubimac iz garaže, vodim računa o uglu, svetlu i detaljima. Dobijate obrađene fotografije spremne za objavu.",
    ],
    seoTitle:
      "Fotograf automobila u Beogradu | Slikanje vozila — Lenscapers",
    seoDesc:
      "Profesionalno slikanje automobila i vozila u Beogradu — dinamični i studijski kadrovi. Auto fotografija za prodaju i promociju. Lenscapers.",
  },
};

/* Spisak svih ruta — koristi ga prerender skripta i sitemap. */
export const ROUTES = ["/", ...Object.keys(SERVICE_PAGES)];

/* ============================================================
   SEO  —  naslov, opis i strukturirani podaci po stranici.
   ============================================================ */
function normalizePath(p) {
  if (!p) return "/";
  let path = p.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) path = "/" + path;
  if (path.length > 1 && !path.endsWith("/")) path += "/";
  return path === "//" ? "/" : path;
}

/* LocalBusiness/Photographer — pojavi se na svim stranicama.
   Ovo Google koristi za "rich" prikaz i lokalno rangiranje. */
function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Photographer",
    "@id": `${SITE_URL}/#business`,
    name: CONFIG.brand,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/favicon.svg`,
    description:
      "Profesionalni fotograf u Beogradu — portreti, rođendani i proslave, automobili i vozila.",
    telephone: CONFIG.phone.replace(/\s/g, ""),
    email: CONFIG.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Beograd",
      addressCountry: "RS",
    },
    areaServed: { "@type": "City", name: "Beograd" },
    sameAs: [CONFIG.social.instagram, CONFIG.social.tiktok],
  };
}

export function getSeo(rawPath) {
  const path = normalizePath(rawPath);
  const url = `${SITE_URL}${path}`;
  const jsonLd = [businessJsonLd()];

  if (path === "/") {
    return {
      title:
        "Fotograf u Beogradu | Portreti, rođendani, automobili — Lenscapers",
      description:
        "Profesionalni fotograf u Beogradu. Slikanje portreta, rođendana i proslava, automobila i vozila. Pogledajte radove i zakažite termin — Lenscapers.",
      canonical: url,
      jsonLd,
    };
  }

  const page = SERVICE_PAGES[path];
  if (page) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      serviceType: page.eyebrow,
      areaServed: { "@type": "City", name: "Beograd" },
      provider: { "@id": `${SITE_URL}/#business` },
      url,
    });
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Početna",
          item: `${SITE_URL}/`,
        },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    });
    return {
      title: page.seoTitle,
      description: page.seoDesc,
      canonical: url,
      jsonLd,
    };
  }

  // nepoznata ruta (404)
  return {
    title: `Stranica nije pronađena — ${CONFIG.brand}`,
    description: CONFIG.intro,
    canonical: `${SITE_URL}/`,
    jsonLd,
  };
}

/* Generiše <head> sadržaj kao string — koristi ga prerender skripta
   da bi svaka statička stranica imala svoj naslov, opis i JSON-LD. */
export function renderHead(rawPath) {
  const seo = getSeo(rawPath);
  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="sr_RS" />`,
  ];
  for (const obj of seo.jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(obj)}</script>`,
    );
  }
  return tags.join("\n    ");
}

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
    </div>
  );
}

/* ---------- NAV (deljen na svim stranicama) ---------- */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Linkovi vode na sekcije početne strane (rade i sa podstranica).
  const navLinks = [
    ["/#usluge", "Usluge"],
    ["/#galerija", "Galerija"],
    ["/#o-nama", "O nama"],
    ["/#kontakt", "Kontakt"],
  ];

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="container nav__inner">
        <a href="/" className="brand">
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
            href="/#kontakt"
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
  );
}

/* ---------- GALERIJA ---------- */
function Gallery({ category }) {
  const [filter, setFilter] = useState(category || "Sve");
  const galleryRef = useRef(null);

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

  return (
    <>
      {!category && (
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
      )}

      <div className="masonry" ref={galleryRef}>
        {visible.map((g) => (
          <figure key={g.id} className="tile">
            <img src={img(g.seed)} alt={g.alt} loading="lazy" />
            <figcaption>{g.cat}</figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

/* ---------- KONTAKT FORMA (deljena) ---------- */
function ContactForm() {
  const [formStatus, setFormStatus] = useState("idle"); // idle | sending | success | error
  return (
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
        <p className="form-msg form-msg--ok">✓ Hvala! Javljamo se uskoro.</p>
      )}
      {formStatus === "error" && (
        <p className="form-msg form-msg--err">
          Greška pri slanju. Pokušaj ponovo ili nas pozovi direktno.
        </p>
      )}
    </form>
  );
}

/* ---------- KONTAKT SEKCIJA (deljena) ---------- */
function ContactSection() {
  return (
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
        <ContactForm />
      </div>
    </section>
  );
}

/* ---------- FOOTER (deljen) ---------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <a href="/" className="brand brand--light">
          <Logo className="brand__mark" />
          {CONFIG.brand}
        </a>
        <p className="footer__tag">{CONFIG.tagline}</p>

        {/* Interni linkovi ka uslugama — dobri za SEO i navigaciju */}
        <nav className="footer__nav">
          {SERVICES.map((s) => (
            <a key={s.href} href={s.href}>
              {s.title}
            </a>
          ))}
        </nav>

        <SocialLinks />
        <p className="footer__copy">
          © {new Date().getFullYear()} {CONFIG.brand}. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
}

/* ---------- HERO SLAJDŠOU (pozadinske slike na 3s) ---------- */
function HeroSlideshow() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setI((p) => (p + 1) % HERO_IMAGES.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="hero__bg" aria-hidden="true">
      {HERO_IMAGES.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`hero__bg-img ${idx === i ? "is-active" : ""}`}
          loading={idx === 0 ? "eager" : "lazy"}
        />
      ))}
      <div className="hero__scrim" />
    </div>
  );
}

/* ============================================================
   POČETNA STRANA
   ============================================================ */
function HomePage() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero" id="top">
        <HeroSlideshow />
        <div className="container hero__grid">
          {/* H1 ostaje zbog Google-a, ali je vizuelno sakriven */}
          <h1 className="visually-hidden">Fotograf u Beogradu</h1>

          {/* gore levo: tagline + društvene mreže */}
          <div className="hero__corner hero__corner--tl">
            <p className="hero__tagline">{CONFIG.tagline}</p>
            <SocialLinks />
          </div>

          {/* dole desno: motto + dugme */}
          <div className="hero__corner hero__corner--br">
            <p className="hero__motto">{CONFIG.motto}</p>
            <a href="#galerija" className="btn">
              Pogledaj radove
            </a>
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
            <h2>Fotografske usluge u Beogradu</h2>
            <p className="section__sub">
              Portreti, slikanje rođendana i proslava, fotografija automobila —
              od najtoplijih porodičnih trenutaka do moćnih kadrova vozila.
            </p>
          </div>
          <div className="cards">
            {SERVICES.map((s) => (
              <a key={s.title} className="card" href={s.href}>
                <div className="card__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="card__more">Saznaj više →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- O NAMA ---------- */}
      <section className="section section--alt about" id="o-nama">
        <div className="container about__inner">
          <div className="about__img">
            <img src={img("about", 600, 720)} alt="Fotograf u Beogradu" />
          </div>
          <div className="about__text">
            <p className="eyebrow">O nama</p>
            <h2>Strast prema svetlu i detalju</h2>
            <p className="about__lead">{CONFIG.intro}</p>
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
          <Gallery />
        </div>
      </section>

      {/* ---------- KONTAKT ---------- */}
      <ContactSection />
    </>
  );
}

/* ============================================================
   STRANICA USLUGE  (rođendani / portreti / automobili)
   ============================================================ */
function ServicePage({ path }) {
  const page = SERVICE_PAGES[path];
  const others = ROUTES.filter((r) => r !== "/" && r !== path);

  return (
    <>
      {/* ---------- HERO USLUGE ---------- */}
      <section className="section service-hero" id="top">
        <div className="container">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="section__sub service-hero__lead">{page.lead}</p>
          <div className="hero__actions">
            <a href="#kontakt" className="btn">
              Zakaži termin
            </a>
            <a href="#galerija" className="btn btn--ghost">
              Pogledaj radove
            </a>
          </div>
          <SocialLinks />
        </div>
      </section>

      {/* ---------- OPIS ---------- */}
      <section className="section section--alt">
        <div className="container service-body">
          {page.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* ---------- GALERIJA (filtrirana) ---------- */}
      <section className="section" id="galerija">
        <div className="container">
          <div className="section__head">
            <p className="eyebrow">Portfolio</p>
            <h2>Primeri radova</h2>
            <p className="section__sub">
              Placeholder fotografije — uskoro pravi radovi.
            </p>
          </div>
          <Gallery category={page.cat} />
        </div>
      </section>

      {/* ---------- KONTAKT ---------- */}
      <ContactSection />

      {/* ---------- OSTALE USLUGE (interni linkovi) ---------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__head">
            <h2>Ostale usluge</h2>
          </div>
          <div className="cards">
            {others.map((r) => (
              <a key={r} className="card" href={r}>
                <h3>{SERVICE_PAGES[r].h1}</h3>
                <p>{SERVICE_PAGES[r].lead}</p>
                <span className="card__more">Saznaj više →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   APP  —  bira stranicu na osnovu putanje (path).
   Na serveru (prerender) path stiže kao prop; u pregledaču
   se čita iz window.location.pathname.
   ============================================================ */
export default function App({ path: pathProp }) {
  const path = normalizePath(
    pathProp ??
      (typeof window !== "undefined" ? window.location.pathname : "/"),
  );

  // Postavi naslov stranice (korisno u dev modu; u produkciji je već tačan).
  useEffect(() => {
    document.title = getSeo(path).title;
  }, [path]);

  const isService = path in SERVICE_PAGES;

  return (
    <div className="app">
      <Nav />
      {isService ? <ServicePage path={path} /> : <HomePage />}
      <Footer />
    </div>
  );
}
