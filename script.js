(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const form = document.querySelector('#booking-form');
  const status = document.querySelector('#form-status');
  const dateInput = document.querySelector('#booking-date');
  const year = document.querySelector('#year');

  if (year) year.textContent = new Date().getFullYear();

  if (dateInput) {
    const localDate = new Date();
    const offset = localDate.getTimezoneOffset();
    const today = new Date(localDate.getTime() - offset * 60000).toISOString().split('T')[0];
    dateInput.min = today;
  }

  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  document.querySelectorAll('.primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const normalize = value => value.trim().replace(/\s+/g, ' ');

  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Vérifiez les champs requis.';
      return;
    }

    const data = new FormData(form);
    const service = normalize(data.get('service') || '');
    const doctor = normalize(data.get('doctor') || '');
    const date = normalize(data.get('date') || '');
    const time = normalize(data.get('time') || '');
    const name = normalize(data.get('name') || '');
    const phone = normalize(data.get('phone') || '');
    const email = normalize(data.get('email') || '');
    const message = normalize(data.get('message') || '');

    const lines = [
      'Bonjour, je souhaite demander un rendez-vous.',
      '',
      '• Service : ' + service,
      '• Praticien : ' + doctor,
      '• Date souhaitée : ' + date,
      '• Heure souhaitée : ' + time,
      '• Nom : ' + name,
      '• Téléphone : ' + phone,
      email ? '• Email : ' + email : '',
      message ? '• Message : ' + message : '',
      '',
      'Je comprends que ce créneau est une préférence et doit être confirmé par le cabinet.'
    ].filter(Boolean);

    const url = 'https://wa.me/212536701060?text=' + encodeURIComponent(lines.join('\n'));
    status.textContent = 'Ouverture de WhatsApp…';
    window.open(url, '_blank', 'noopener,noreferrer');
  });
})();