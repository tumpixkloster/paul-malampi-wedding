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
  const churchButton = document.querySelector("#dirChurch");
  const receptionButton = document.querySelector("#dirReception");

  const churchUrl =
    "https://www.google.com/maps/search/?api=1&query=-12.970409422362602,28.641622770637557";

  const receptionUrl =
    "https://maps.app.goo.gl/UH8mLAkQSzAgvjht5";

  if (churchButton) {
    churchButton.setAttribute("href", churchUrl);
    churchButton.setAttribute("target", "_blank");
    churchButton.setAttribute("rel", "noopener noreferrer");
  }

  if (receptionButton) {
    receptionButton.setAttribute("href", receptionUrl);
    receptionButton.setAttribute("target", "_blank");
    receptionButton.setAttribute("rel", "noopener noreferrer");
  }
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
  const button = document.querySelector("#addToCalendar");

  if (!button) return;

  button.addEventListener("click", () => {
    const useGoogleCalendar = window.confirm(
      "Add to Google Calendar?\n\nSelect OK for Google Calendar.\nSelect Cancel for Apple Calendar or Outlook."
    );

    if (useGoogleCalendar) {
      const googleCalendarUrl =
        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
        "&text=" +
        encodeURIComponent("Paul & Malampi's Wedding") +
        "&dates=20261121T070000Z/20261121T170000Z" +
        "&details=" +
        encodeURIComponent(
          "Marriage Blessing at 9:00 AM at Bethel Church International. Picture Session at 12:00 PM and Reception at 4:00 PM at Minsundu Recreation Park."
        ) +
        "&location=" +
        encodeURIComponent("Bethel Church International, Ndola, Zambia");

      window.location.href = googleCalendarUrl;
      return;
    }

    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Paul and Malampi Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:paul-malampi-wedding-20261121@wedding",
      "DTSTAMP:20260919T100000Z",
      "DTSTART:20261121T070000Z",
      "DTEND:20261121T170000Z",
      "SUMMARY:Paul & Malampi's Wedding",
      "DESCRIPTION:Marriage Blessing at 9:00 AM at Bethel Church International. Picture Session at 12:00 PM and Reception at 4:00 PM at Minsundu Recreation Park.",
      "LOCATION:Bethel Church International, Ndola, Zambia",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const calendarBlob = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8"
    });

    const calendarFileUrl = URL.createObjectURL(calendarBlob);
    const downloadLink = document.createElement("a");

    downloadLink.href = calendarFileUrl;
    downloadLink.download = "paul-and-malampi-wedding.ics";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(calendarFileUrl);
    }, 1000);
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
