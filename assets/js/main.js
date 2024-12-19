document.addEventListener('DOMContentLoaded', function () {

  // Function to fetch and set language
  function changeLanguage(lang) {
    fetch(`/locales/${lang}.json`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched translations:', data); // Log translations for debugging
        translateDOM(data);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set direction based on language
        updateLanguageButton(lang);
      })
      .catch(error => console.error('Error fetching translation', error));
  }

  // Function to insert list items
  function insertListItems(element, items) {
    element.innerHTML = ''; // Clear existing content
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<i class="bi bi-check-circle"></i> ${item}`;
      // listItem.innerHTML = `${item}`;
      // listItem.classList.add('bi', 'bi-check-circle');

      element.appendChild(listItem);
    });
  }

  // Function to translate DOM elements
  function translateDOM(translations) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key.includes('.')) {
        // Handle nested keys
        const nestedKeys = key.split('.');
        let value = translations;
        nestedKeys.forEach(nestedKey => {
          value = value[nestedKey];
          console.log("VAL", value);
        });
        if (Array.isArray(value)) {
          // Handle array values (if needed)
          insertListItems(element, value);
        } else {
          element.textContent = value;
        }
      }
      // Handle specific structure for hero section
      if (key === 'hero.title') {
        const title = translations.hero.title;
        const title_br = translations.hero.title_br;
        const title_span = translations.hero.title_span;
        console.log(title, title_br, title_span);
        if (title && title_br && title_span) {
          element.innerHTML = `${title}<br>${title_br}<span>${title_span}</span>`;
        }
      }
      if (key === 'footer.designedBy')
        element.innerHTML = `${translations.footer.designedBy} <a href="https://jp-log.com/">${translations.footer.companyName}</a>`;
    });
  }
  // Function to update language switcher button text and direction
  function updateLanguageButton(lang) {
    const langButton = document.getElementById('lang-btn');
    if (lang === 'en') {
      langButton.textContent = 'عربي';
    } else if (lang === 'ar') {
      langButton.textContent = 'English';
    }
  }

  // Function to toggle language
  window.toggleLanguage = function () {
    const currentLang = document.documentElement.lang;
    const newLang = currentLang === 'en' ? 'ar' : 'en'; // Toggle between 'en' and 'ar'
    changeLanguage(newLang);
  };

  // Event handler for language toggle button
  const langButton = document.getElementById('lang-btn');
  if (langButton) {
    langButton.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default anchor click behavior
      toggleLanguage();
    });
  } else {
    console.error('Language button not found.');
  }

  // Initial translation on page load (default to 'en')
  changeLanguage('en');
});

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    if (!header.classList.contains('header-scrolled')) {
      offset -= 20
    }

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });


  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

})();
