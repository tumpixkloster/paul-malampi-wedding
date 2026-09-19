const WEDDING = {
  start: new Date("2026-11-21T09:00:00+02:00"),
  churchMap: "https://www.google.com/maps/search/?api=1&query=-12.970409422362602,28.641622770637557",
  receptionMap: "https://maps.app.goo.gl/UH8mLAkQSzAgvjht5",
  contacts: [
    { name: "James Kaimba", phone: "260977403271" },
    { name: "Micah Kambe", phone: "260967440813" }
  ]
};

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

async function loadGuest() {
  const slug = new URLSearchParams(window.location.search).get("g");
  if (!slug) return null;

  try {
    const response = await fetch("assets/data/guests.json");
    if (!response.ok) throw new Error(`Guest list could not be loaded: ${response.status}`);
    const guests = await response.json();
    return guests.find((item) => item.slug === slug) || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function renderGuest(guest) {
  if (!guest) return;

  $("#guestName").textContent = `Dear ${guest.name}`;
  $("#guestMeta").textContent = guest.size > 1
    ? `Invitation for ${guest.size} guests`
    : "Personal invitation";
  $("#ticketName").textContent = guest.name;
  $("#ticketParty").textContent = `Admits ${guest.size} ${guest.size === 1 ? "guest" : "guests"}`;
  $("#ticketId").textContent = guest.id;
  $("#ticketQr").src = guest.ticket;
  document.title = `${guest.name} | Paul & Malampi`;

  $("#downloadTicket").addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = guest.ticket;
    link.download = `${guest.id}-${guest.slug}.png`;
    link.click();
  });
}

function startCountdown() {
  const tick = () => {
    const milliseconds = Math.max(0, WEDDING.start.getTime() - Date.now());
    const seconds = Math.floor(milliseconds / 1000);
    $("#cd-days").textContent = Math.floor(seconds / 86400);
    $("#cd-hours").textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
    $("#cd-min").textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    $("#cd-sec").textContent = String(seconds % 60).padStart(2, "0");
  };

  tick();
  window.setInterval(tick, 1000);
}

function setupDirections() {
  $("#dirChurch").href = WEDDING.churchMap;
  $("#dirReception").href = WEDDING.receptionMap;
}

function setupRsvp(guest) {
  const guestName = guest ? guest.name : "a guest";
  $("#rsvpButtons").innerHTML = WEDDING.contacts.map((contact) => {
    const message = encodeURIComponent(
      `Hello ${contact.name}, this is ${guestName}. I would like to RSVP for Paul & Malampi's wedding on 21 November 2026.`
    );
    return `<a class="button" target="_blank" rel="noopener noreferrer" href="https://wa.me/${contact.phone}?text=${message}">RSVP with ${contact.name.split(" ")[0]}</a>`;
  }).join("");
}

function toIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function setupCalendar() {
  $("#addToCalendar").addEventListener("click", () => {
    const end = new Date(WEDDING.start.getTime() + 10 * 60 * 60 * 1000);
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${toIcsDate(WEDDING.start)}`,
      `DTEND:${toIcsDate(end)}`,
      "SUMMARY:Paul & Malampi Wedding",
      "LOCATION:Bethel Church International, Ndola",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([content], { type: "text/calendar" }));
    link.download = "paul-malampi-wedding.ics";
    link.click();
  });
}

function setupGallery() {
  const lightbox = $("#lightbox");
  const enlargedImage = $("img", lightbox);

  $$("#gallery img").forEach((image) => {
    image.addEventListener("click", () => {
      enlargedImage.src = image.src;
      lightbox.classList.add("open");
    });
  });

  $("button", lightbox).addEventListener("click", () => lightbox.classList.remove("open"));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.classList.remove("open");
  });
}

(async function init() {
  const guest = await loadGuest();
  renderGuest(guest);
  startCountdown();
  setupDirections();
  setupRsvp(guest);
  setupCalendar();
  setupGallery();
})();
