document.addEventListener('DOMContentLoaded', function () {

  // Cache for translation elements to avoid repeated queries
  let translationElements = null;

  // Function to fetch and set language
  function changeLanguage(lang) {
    fetch(`/locales/${lang}.json`)
      .then(response => response.json())
      .then(data => {
        translateDOM(data);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set direction based on language
        updateLanguageButton(lang);
      })
      .catch(error => console.error('Error fetching translation', error));
  }

  // Function to insert list items
  function insertListItems(element, items) {
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `<i class="bi bi-check-circle"></i> ${item}`;
      fragment.appendChild(listItem);
    });
    element.innerHTML = ''; // Clear existing content
    element.appendChild(fragment);
  }

  // Function to translate DOM elements
  function translateDOM(translations) {
    // Cache elements if not already cached
    if (!translationElements) {
      translationElements = document.querySelectorAll('[data-i18n]');
    }
    
    translationElements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      
      // Handle specific structure for hero section
      if (key === 'hero.title') {
        const title = translations.hero.title;
        const title_br = translations.hero.title_br;
        const title_span = translations.hero.title_span;
        if (title && title_br && title_span) {
          element.innerHTML = `${title}<br>${title_br}<span>${title_span}</span>`;
        }
        return;
      }
      
      if (key === 'footer.designedBy') {
        element.innerHTML = `${translations.footer.designedBy} <a href="https://jp-log.com/">${translations.footer.companyName}</a>`;
        return;
      }
      
      if (key.includes('.')) {
        // Handle nested keys
        const nestedKeys = key.split('.');
        let value = translations;
        for (const nestedKey of nestedKeys) {
          value = value[nestedKey];
          if (value === undefined) break;
        }
        
        if (Array.isArray(value)) {
          // Handle array values (for lists)
          insertListItems(element, value);
        } else if (value !== undefined) {
          element.textContent = value;
        }
      }
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
  
  /**
   * Consolidated window load event handler
   */
  window.addEventListener('load', () => {
    // Navbar links active state
    navbarlinksActive();
    
    // Header scrolled state
    if (selectHeader) {
      headerScrolled();
    }
    
    // Back to top button
    if (backtotop) {
      toggleBacktotop();
    }
    
    // Scroll with offset on page load with hash links in the url
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
    
    // Animation on scroll initialization
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });
  
  // Set up scroll listeners
  onscroll(document, navbarlinksActive);

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

})();
