 
  /* LOADER */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600);
    }, 800);
  });

  /*   SCROLL PROGRESS BAR*/
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('progress-bar').style.width = (scrolled / total * 100) + '%';
  });

  /* NAVBAR: transparent → solid on scroll */
  window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    nb.classList.toggle('scrolled', window.scrollY > 40);

    // Active nav link
    const sections = ['home','about','skills','projects','contact'];
    const links = document.querySelectorAll('.nav-link-custom');
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });
    links.forEach(l => {
      l.classList.remove('active-link');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active-link');
    });
  });

  /* MOBILE MENU TOGGLE */
  document.getElementById('navToggler').addEventListener('click', () => {
    const m = document.getElementById('mobileMenu');
    const isOpen = m.style.display === 'block';
    m.style.display = isOpen ? 'none' : 'block';
    m.style.setProperty('display', isOpen ? 'none' : 'block', 'important');
  });

  // Close mobile menu on link click
  document.querySelectorAll('#mobileMenu .nav-link-custom').forEach(l => {
    l.addEventListener('click', () => {
      const m = document.getElementById('mobileMenu');
      m.style.setProperty('display', 'none', 'important');
    });
  });

  /* TYPING ANIMATION*/
  const phrases = [
    'Full Stack Developer',
    'React.js Enthusiast',
    'Node.js Backend Dev',
    'UI/UX Craftsman',
    'Problem Solver',
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const typedEl = document.getElementById('typed-output');

  function type() {
    const word = phrases[phraseIdx];
    if (deleting) {
      typedEl.textContent = word.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 60);
    } else {
      typedEl.textContent = word.substring(0, charIdx++);
      if (charIdx > word.length) { deleting = true; setTimeout(type, 1400); return; }
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 800);

  /* SCROLL REVEAL (Intersection Observer) */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /*  CONTACT FORM VALIDATION */
// Initialize EmailJS

 

async function submitForm() {
  const name  = document.getElementById('f-name');
  const email = document.getElementById('f-email');
  const msg   = document.getElementById('f-msg');
  const result = document.getElementById('form-result');
  const btn = document.getElementById('submit-btn');

  let valid = true;

  // Reset errors
  [name, email, msg].forEach(f => f.classList.remove('error-field'));
  document.getElementById('err-name').textContent = '';
  document.getElementById('err-email').textContent = '';
  document.getElementById('err-msg').textContent = '';
  result.style.display = 'none';

  // Validation
  if (!name.value.trim()) {
    name.classList.add('error-field');
    document.getElementById('err-name').textContent = 'Name is required.';
    valid = false;
  }

  if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error-field');
    document.getElementById('err-email').textContent = 'Enter a valid email.';
    valid = false;
  }

  if (!msg.value.trim() || msg.value.trim().length < 10) {
    msg.classList.add('error-field');
    document.getElementById('err-msg').textContent = 'Message must be at least 10 characters.';
    valid = false;
  }

  if (!valid) return;

  // UI loading state
  btn.innerText = "Sending...";
  btn.disabled = true;

  const payload = {
    name: name.value,
    email: email.value,
    message: msg.value
  };

  console.log("Sending data:", payload);

  try {
    const res = await fetch("https://portfolio-kpmz7y1gm-wwwsurajpagi-gmailcoms-projects.vercel.app/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("HTTP status:", res.status);

    const data = await res.json();
    console.log("Response data:", data);

    if (res.ok) {
      result.className = 'form-msg success';
      result.innerHTML = "✅ Message sent successfully!";
      // Clear form
      name.value = '';
      email.value = '';
      msg.value = '';
    } else {
      result.className = 'form-msg error';
      result.innerHTML = `❌ Failed to send message: ${data.error || "Unknown error"}`;
    }

  } catch (error) {
    console.error("Error sending message:", error);
    result.className = 'form-msg error';
    result.innerHTML = "❌ Failed to send message. Check console.";
  } finally {
    result.style.display = 'block';
    btn.innerText = "Send Message";
    btn.disabled = false;
  }
}
 