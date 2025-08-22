AOS.init({ duration: 1000, once: true });
document.addEventListener('DOMContentLoaded', function () {
  // Hamburger menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navClose = document.querySelector('.nav-close');
  const dropdown = document.querySelector('.dropdown');
  const dropbtn = document.querySelector('.dropbtn');
  let timeoutId; // For auto-close timer

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('show');
      menuToggle.classList.toggle('active');
      // Reset auto-close timer
      clearTimeout(timeoutId);
      if (navLinks.classList.contains('show')) {
        timeoutId = setTimeout(() => {
          navLinks.classList.remove('show');
          menuToggle.classList.remove('active');
          if (dropdown) dropdown.classList.remove('open'); // Close dropdown if open
        }, 3000); // Auto-close after 3 seconds
      }
    });

    // Close menu on nav-close click
    if (navClose) {
      navClose.addEventListener('click', function () {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
        if (dropdown) dropdown.classList.remove('open'); // Close dropdown if open
        clearTimeout(timeoutId);
      });
    }

    // Close menu on nav link click
    navLinks.querySelectorAll('a.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        menuToggle.classList.remove('active');
        if (dropdown) dropdown.classList.remove('open'); // Close dropdown if open
        clearTimeout(timeoutId);
      });
    });
  }

  if (dropbtn && dropdown) {
    // Dropdown toggle for mobile
    dropbtn.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        dropdown.classList.toggle('open');
        // Reset auto-close timer
        clearTimeout(timeoutId);
        if (navLinks.classList.contains('show')) {
          timeoutId = setTimeout(() => {
            navLinks.classList.remove('show');
            menuToggle.classList.remove('active');
            dropdown.classList.remove('open');
          }, 3000);
        }
      }
    });
    // Close dropdown if clicked outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropdown')) {
        dropdown.classList.remove('open');
      }
    });
    // Hover behavior for desktop
    dropdown.addEventListener('mouseenter', function () {
      if (window.innerWidth > 900) dropdown.classList.add('open');
    });
    dropdown.addEventListener('mouseleave', function () {
      if (window.innerWidth > 900) dropdown.classList.remove('open');
    });
  }

  // Enhanced Service Field Toggle
  function toggleServiceFields() {
    const service = document.querySelector('input[name="serviceType"]:checked')?.value;
    const educationFields = document.getElementById('educationFields');
    const healthFields = document.getElementById('healthFields');
    if (!educationFields || !healthFields) return;
    // Smooth transition for field visibility
    educationFields.classList.toggle('active', service === 'Education');
    healthFields.classList.toggle('active', service === 'Health');
    // Reset fields in the hidden section
    const fieldsToReset = service === 'Education' ? healthFields.querySelectorAll('input') : educationFields.querySelectorAll('input');
    fieldsToReset.forEach(field => {
      field.value = '';
      const errorMessage = field.nextElementSibling;
      if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.classList.remove('active');
        field.classList.remove('error');
      }
    });
    validateForm(); // Update submit button state
  }

  // Validation rules
  const validationRules = {
    name: {
      regex: /^[A-Za-z\s]{2,100}$/,
      error: 'Name must be 2-100 characters, letters and spaces only'
    },
    email: {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: 'Please enter a valid email address'
    },
    phone: {
      regex: /^[0-9]{10,15}$/,
      error: 'Phone must be 10-15 digits'
    },
    country: {
      regex: /^[A-Za-z\s]{0,50}$/,
      error: 'Country must be letters and spaces only (max 50 characters)'
    },
    state: {
      regex: /^[A-Za-z\s]{2,50}$/,
      error: 'State must be 2-50 characters, letters and spaces only'
    },
    city: {
      regex: /^[A-Za-z\s]{2,50}$/,
      error: 'City must be 2-50 characters, letters and spaces only'
    },
    address: {
      regex: /^.{5,200}$/,
      error: 'Address must be 5-200 characters'
    },
    desiredCourse: {
      regex: /^[A-Za-z0-9\s]{0,100}$/,
      error: 'Course must be letters, numbers, and spaces only (max 100 characters)'
    },
    qualification: {
      regex: /^[A-Za-z0-9\s]{0,100}$/,
      error: 'Qualification must be letters, numbers, and spaces only (max 100 characters)'
    },
    institution: {
      regex: /^[A-Za-z0-9\s]{0,100}$/,
      error: 'Institution must be letters, numbers, and spaces only (max 100 characters)'
    },
    healthConcern: {
      regex: /^[A-Za-z0-9\s]{0,100}$/,
      error: 'Health concern must be letters, numbers, and spaces only (max 100 characters)'
    },
    preferredHospital: {
      regex: /^[A-Za-z0-9\s]{0,100}$/,
      error: 'Hospital must be letters, numbers, and spaces only (max 100 characters)'
    },
    preferredDate: {
      validate: (value) => {
        if (!value) return true; // Optional field
        const today = new Date('2025-08-15');
        const inputDate = new Date(value);
        return inputDate >= today;
      },
      error: 'Date must be today or later'
    },
    message: {
      regex: /^.{0,500}$/,
      error: 'Message must be 500 characters or less'
    }
  };

  // Validate single field
  function validateField(input) {
    const fieldName = input.name;
    const value = input.value.trim();
    const errorMessage = input.nextElementSibling;
    const rule = validationRules[fieldName];
    if (!rule) return true; // No validation rule for this field
    // Check required fields
    if (input.required && !value) {
      errorMessage.textContent = `${input.placeholder} is required`;
      errorMessage.classList.add('active');
      input.classList.add('error');
      return false;
    }
    // Apply regex or custom validation
    if (rule.regex && value && !rule.regex.test(value)) {
      errorMessage.textContent = rule.error;
      errorMessage.classList.add('active');
      input.classList.add('error');
      return false;
    } else if (rule.validate && value && !rule.validate(value)) {
      errorMessage.textContent = rule.error;
      errorMessage.classList.add('active');
      input.classList.add('error');
      return false;
    }
    // Clear error
    errorMessage.textContent = '';
    errorMessage.classList.remove('active');
    input.classList.remove('error');
    return true;
  }

  // Validate entire form
  function validateForm() {
    const inputs = document.getElementById('serviceForm').querySelectorAll('input, textarea');
    let valid = true;
    inputs.forEach(input => {
      if (input.required || input.value.trim()) {
        if (!validateField(input)) {
          valid = false;
        }
      }
    });
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = !valid;
    return valid;
  }

  // Run toggle on load
  toggleServiceFields();

  // Re-run on radio change with keyboard support
  document.querySelectorAll('input[name="serviceType"]').forEach(radio => {
    radio.addEventListener('change', toggleServiceFields);
    radio.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        radio.checked = true;
        toggleServiceFields();
      }
    });
  });

  // Real-time validation on input and blur
  document.getElementById('serviceForm').querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
      validateForm();
    });
    input.addEventListener('blur', () => {
      validateField(input);
      validateForm();
    });
  });

  // Enhanced Form Submission
  const submitButton = document.querySelector('button[type="submit"]');
  document.getElementById('serviceForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!validateForm()) {
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    submitButton.innerHTML = 'Submitting... <span class="button-icon"><i class="fas fa-spinner fa-spin"></i></span>';
    submitButton.disabled = true;
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback success';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = 'Thank you for your inquiry! We will get back to you soon.';
        form.parentNode.appendChild(feedback);
        form.reset();
        toggleServiceFields();
        setTimeout(() => feedback.remove(), 5000);
      } else {
        const feedback = document.createElement('div');
        feedback.className = 'form-feedback error';
        feedback.setAttribute('role', 'alert');
        feedback.textContent = 'There was an issue submitting your form. Please try again.';
        form.parentNode.appendChild(feedback);
        setTimeout(() => feedback.remove(), 5000);
      }
    } catch (error) {
      const feedback = document.createElement('div');
      feedback.className = 'form-feedback error';
      feedback.setAttribute('role', 'alert');
      feedback.textContent = 'Error: Could not connect to the server.';
      form.parentNode.appendChild(feedback);
      setTimeout(() => feedback.remove(), 5000);
    } finally {
      submitButton.innerHTML = 'Submit <span class="button-icon"><i class="fas fa-arrow-right"></i></span>';
      submitButton.disabled = false;
      validateForm();
    }
  });

  // Scroll arrows functionality
  const scrollDown = document.querySelector('.scroll-down');
  const scrollUp = document.querySelector('.scroll-up');
  scrollDown.addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  });
  scrollUp.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      scrollUp.classList.add('show');
    } else {
      scrollUp.classList.remove('show');
    }
  });
});