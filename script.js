document.addEventListener("DOMContentLoaded", () => {
  // Initialize EmailJS
  emailjs.init("YOUR_EMAILJS_PUBLIC_KEY")
  // Custom cursor
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (window.innerWidth > 768) {
    document.addEventListener("mousemove", (e) => {
      cursor.style.opacity = "1"
      cursorFollower.style.opacity = "1"

      cursor.style.left = e.clientX + "px"
      cursor.style.top = e.clientY + "px"

      cursorFollower.style.left = e.clientX + "px"
      cursorFollower.style.top = e.clientY + "px"
    })

    document.addEventListener("mouseout", () => {
      cursor.style.opacity = "0"
      cursorFollower.style.opacity = "0"
    })

    // Cursor hover effect on links and buttons
    const links = document.querySelectorAll("a, button, .gallery-item")
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
        cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)"
      })

      link.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)"
        cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
      })
    })
  }

  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  const navLinksItems = document.querySelectorAll(".nav-link")

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active")
      navLinks.classList.toggle("active")
      document.body.classList.toggle("menu-open", navLinks.classList.contains("active"))
    })
  }

  // Close mobile menu when clicking on a nav link
  navLinksItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
      document.body.classList.remove("menu-open")
    })
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
      document.body.classList.remove("menu-open")
    }
  })

  // Active nav link on scroll
  const sections = document.querySelectorAll("section")

  function setActiveLink() {
    let current = ""

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinksItems.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", setActiveLink)

  // Scroll animations with Intersection Observer
  const animateElements = document.querySelectorAll(
    ".reveal-text, .reveal-image, .reveal-left, .reveal-right, .reveal-stagger",
  )

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  animateElements.forEach((element) => {
    observer.observe(element)
  })

  // Activate hero animations immediately
  document.querySelector(".reveal-text").classList.add("active")
  document.querySelector(".reveal-image").classList.add("active")

  // Gallery Filter
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  // Load More Logic
  const loadMoreBtn = document.querySelector(".load-more-btn")
  const ITEMS_PER_LOAD = 12
  let currentVisible = 0
  let currentFilter = "all"

  function updateGalleryVisibility() {
    let shown = 0
    galleryItems.forEach((item, idx) => {
      const matchesFilter = currentFilter === "all" || item.getAttribute("data-category") === currentFilter
      if (matchesFilter && shown < currentVisible) {
        item.style.display = "block"
        setTimeout(() => {
          item.style.opacity = "1"
          item.style.transform = "translateY(0)"
        }, 100)
        shown++
      } else {
        item.style.opacity = "0"
        item.style.transform = "translateY(20px)"
        setTimeout(() => {
          item.style.display = "none"
        }, 300)
      }
    })
    // Hide Load More if all filtered items are visible
    const totalFiltered = Array.from(galleryItems).filter(item => currentFilter === "all" || item.getAttribute("data-category") === currentFilter).length
    if (currentVisible >= totalFiltered) {
      loadMoreBtn.style.display = "none"
    } else {
      loadMoreBtn.style.display = "inline-block"
    }
  }

  function resetGallery() {
    currentVisible = ITEMS_PER_LOAD
    updateGalleryVisibility()
  }

  // Initial gallery state
  resetGallery()

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((filterBtn) => {
        filterBtn.classList.remove("active")
      })
      // Add active class to clicked button
      btn.classList.add("active")
      currentFilter = btn.getAttribute("data-filter")
      resetGallery()
    })
  })

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      const totalFiltered = Array.from(galleryItems).filter(item => currentFilter === "all" || item.getAttribute("data-category") === currentFilter).length
      currentVisible += ITEMS_PER_LOAD
      updateGalleryVisibility()
      // Optionally scroll to the new items
      // this.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  // Form Submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      
      // Get form values
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const message = document.getElementById("message").value
      
      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>'
      submitBtn.disabled = true
      
      // Send email using EmailJS
      emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "kalyanimusicschool7@gmail.com"
      })
      .then(response => {
        alert("Thank you for your message! I will get back to you soon.")
        contactForm.reset()
      })
      .catch(error => {
        console.error('Error:', error)
        alert("Sorry, there was an error sending your message. Please try again or email me directly at kalyanimusicschool7@gmail.com")
      })
      .finally(() => {
        // Reset button state
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
      })
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
      }
    })
  })
})