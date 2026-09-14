/* ============================================
   EVOLIX EVENT — PURPLE COW CAMPAIGN ENGINE
   3D Scene + Quiz + Scoring + Lead Submission
   ============================================ */

(function () {
  'use strict';

  // ============ CONFIGURATION ============
  var CONFIG = {
    WHATSAPP_NUMBER: '919098173239',
    // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW:
    GOOGLE_SHEET_URL: 'https://script.google.com/macros/s/AKfycbwZ2K0UiVIj6PuxJoaBcFL4IG9ppZkY1DX5ErG9XiFaOyGS7gkIOxy-uwXyWbpJ1U2YBw/exec',
    CAMPAIGN_SOURCE: '100_NOTE'
  };

  // ============ THREE.JS 3D SCENE ============
  var scene, camera, renderer, shapes = [], mouseX = 0, mouseY = 0, scrollY = 0;
  var reactionActive = false, reactionStartTime = 0;

  function initThreeScene() {
    var container = document.getElementById('ev-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient light — bright for white theme
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Point lights with EVOLIX brand colors — softer for light bg
    var redLight = new THREE.PointLight(0xcc3f48, 1.0, 80);
    redLight.position.set(15, 10, 20);
    scene.add(redLight);

    var goldLight = new THREE.PointLight(0xd9962f, 0.8, 80);
    goldLight.position.set(-15, -10, 15);
    scene.add(goldLight);

    var blueLight = new THREE.PointLight(0x6366f1, 0.4, 60);
    blueLight.position.set(0, 15, 10);
    scene.add(blueLight);

    // Create 3D shapes — translucent for white theme
    var shapeDefs = [
      { geo: new THREE.IcosahedronGeometry(3, 0), pos: [-12, 6, -5], speed: 0.003, floatSpeed: 0.001, floatAmp: 2 },
      { geo: new THREE.TorusKnotGeometry(2, 0.6, 80, 16, 2, 3), pos: [14, -4, -8], speed: 0.002, floatSpeed: 0.0015, floatAmp: 3 },
      { geo: new THREE.OctahedronGeometry(2.5, 0), pos: [-8, -8, -3], speed: 0.004, floatSpeed: 0.0012, floatAmp: 1.5 },
      { geo: new THREE.DodecahedronGeometry(2, 0), pos: [10, 10, -10], speed: 0.0025, floatSpeed: 0.001, floatAmp: 2.5 },
      { geo: new THREE.TetrahedronGeometry(2, 0), pos: [0, -12, -6], speed: 0.0035, floatSpeed: 0.0018, floatAmp: 2 },
    ];

    shapeDefs.forEach(function (def) {
      // Wireframe mesh — subtle on white
      var wireMat = new THREE.MeshBasicMaterial({
        color: 0xcc3f48,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      });
      var wireMesh = new THREE.Mesh(def.geo, wireMat);

      // Solid mesh — soft translucent for white bg
      var solidMat = new THREE.MeshPhongMaterial({
        color: 0xfaf9f6,
        emissive: 0xcc3f48,
        emissiveIntensity: 0.08,
        transparent: true,
        opacity: 0.18,
        shininess: 120
      });
      var solidMesh = new THREE.Mesh(def.geo.clone(), solidMat);

      var group = new THREE.Group();
      group.add(wireMesh);
      group.add(solidMesh);
      group.position.set(def.pos[0], def.pos[1], def.pos[2]);

      shapes.push({
        group: group,
        wireMat: wireMat,
        solidMat: solidMat,
        speed: def.speed,
        baseSpeed: def.speed,
        floatSpeed: def.floatSpeed,
        floatAmp: def.floatAmp,
        baseY: def.pos[1],
        baseScale: 1,
        targetScale: 1,
        time: Math.random() * 100
      });

      scene.add(group);
    });

    // Handle resize
    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse tracking
    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
      }
    }, { passive: true });

    // Scroll tracking
    window.addEventListener('scroll', function () {
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    }, { passive: true });

    animateScene();
  }

  function animateScene() {
    requestAnimationFrame(animateScene);

    var time = Date.now() * 0.001;
    var reactionProgress = 0;

    // 3D reaction timing
    if (reactionActive) {
      var elapsed = (Date.now() - reactionStartTime) / 1000;
      if (elapsed < 1.2) {
        // 0-0.3s: burst (fast spin + scale up)
        // 0.3-1.2s: settle back
        if (elapsed < 0.3) {
          reactionProgress = elapsed / 0.3; // 0→1 during burst
        } else {
          reactionProgress = 1 - ((elapsed - 0.3) / 0.9); // 1→0 during settle
        }
      } else {
        reactionActive = false;
        reactionProgress = 0;
        // Reset speeds and scales
        shapes.forEach(function (s) {
          s.speed = s.baseSpeed;
          s.targetScale = 1;
        });
      }
    }

    shapes.forEach(function (s) {
      // Speed boost during reaction
      var currentSpeed = s.speed + (reactionProgress * 0.03);
      s.time += currentSpeed;
      s.group.rotation.x += currentSpeed;
      s.group.rotation.y += currentSpeed * 0.7;

      // Scale interpolation during reaction
      var scale = s.baseScale + (s.targetScale - s.baseScale) * 0.1;
      s.baseScale = scale;
      var reactionScale = 1 + reactionProgress * 0.4;
      s.group.scale.setScalar(scale * reactionScale);

      // Wireframe opacity pulse during reaction
      if (s.wireMat) {
        s.wireMat.opacity = 0.12 + reactionProgress * 0.25;
      }
      if (s.solidMat) {
        s.solidMat.emissiveIntensity = 0.08 + reactionProgress * 0.2;
      }

      // Float animation
      s.group.position.y = s.baseY + Math.sin(time * s.floatSpeed * 10) * s.floatAmp;

      // Mouse parallax
      s.group.position.x += (mouseX * 2 - s.group.position.x) * 0.01;

      // Scroll parallax
      s.group.rotation.z = scrollY * 0.0003;
    });

    // Camera subtle movement
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // 3D REACTION when user selects an answer
  function triggerAnswerReaction() {
    if (!shapes.length) return;
    reactionActive = true;
    reactionStartTime = Date.now();

    // Temporarily boost all shape speeds
    shapes.forEach(function (s) {
      s.speed = s.baseSpeed * 5;
    });
  }


  // ============ QUIZ DATA (from PRD) ============
  var QUESTIONS = [
    {
      id: 'q1',
      category: 'BRAND CLARITY',
      weight: 10,
      text: 'If a new customer sees your business for 10 seconds, will they understand what you do and why they should choose you?',
      options: [
        { letter: 'A', text: 'Yes, our positioning is extremely clear', points: 10 },
        { letter: 'B', text: 'Mostly clear, but we could communicate it better', points: 7 },
        { letter: 'C', text: 'We mainly explain our products/services', points: 4 },
        { letter: 'D', text: 'Not really / we have never thought about this', points: 0 }
      ],
      areaName: 'Brand Clarity'
    },
    {
      id: 'q2',
      category: 'ONLINE PRESENCE',
      weight: 15,
      text: 'When someone searches for your business online, what do they find?',
      options: [
        { letter: 'A', text: 'Professional website + active social presence + correct business information', points: 15 },
        { letter: 'B', text: 'Website and social media, but some parts are outdated', points: 10 },
        { letter: 'C', text: 'Mainly Instagram/social media or Google listing', points: 5 },
        { letter: 'D', text: 'Very little / nothing professional', points: 0 }
      ],
      areaName: 'Online Presence'
    },
    {
      id: 'q3',
      category: 'LEAD GENERATION',
      weight: 15,
      text: 'Where do most of your new enquiries currently come from?',
      options: [
        { letter: 'A', text: 'Multiple predictable channels', points: 15 },
        { letter: 'B', text: 'One strong channel consistently', points: 10 },
        { letter: 'C', text: 'Mostly referrals / occasional social media enquiries', points: 5 },
        { letter: 'D', text: "We don't have a predictable source of leads", points: 0 }
      ],
      areaName: 'Lead Generation'
    },
    {
      id: 'q4',
      category: 'SALES PROCESS',
      weight: 15,
      text: 'Do you have a defined process from enquiry → follow-up → quotation → payment?',
      options: [
        { letter: 'A', text: 'Yes, it is clear and consistently followed', points: 15 },
        { letter: 'B', text: 'Mostly, but some steps are manual or inconsistent', points: 10 },
        { letter: 'C', text: 'It depends on the person handling it', points: 5 },
        { letter: 'D', text: 'No defined process', points: 0 }
      ],
      areaName: 'Sales Process'
    },
    {
      id: 'q5',
      category: 'CUSTOMER INFORMATION',
      weight: 15,
      text: 'Where is your customer and sales information stored?',
      options: [
        { letter: 'A', text: 'One organised system / CRM / ERP', points: 15 },
        { letter: 'B', text: 'Mostly organised spreadsheets or software', points: 10 },
        { letter: 'C', text: 'WhatsApp + spreadsheets + notebooks across different places', points: 5 },
        { letter: 'D', text: 'There is no proper system', points: 0 }
      ],
      areaName: 'Customer Information'
    },
    {
      id: 'q6',
      category: 'OPERATIONS',
      weight: 15,
      text: 'How much repetitive work does your team still do manually?',
      options: [
        { letter: 'A', text: 'Very little; most repetitive work is systemised', points: 15 },
        { letter: 'B', text: 'Some manual work remains', points: 10 },
        { letter: 'C', text: 'A lot of everyday work is manual', points: 5 },
        { letter: 'D', text: 'Almost everything depends on people doing it manually', points: 0 }
      ],
      areaName: 'Operations'
    },
    {
      id: 'q7',
      category: 'SCALABILITY',
      weight: 15,
      text: 'If your business suddenly doubled in customers next month, could your current systems handle the growth smoothly?',
      options: [
        { letter: 'A', text: 'Yes, we could handle it comfortably', points: 15 },
        { letter: 'B', text: 'Mostly, but we would need some adjustments', points: 10 },
        { letter: 'C', text: 'We would probably struggle in several areas', points: 5 },
        { letter: 'D', text: 'No, our current process would become difficult to manage', points: 0 }
      ],
      areaName: 'Scalability'
    }
  ];

  // Score bands
  var BANDS = [
    {
      min: 86, max: 100, name: 'HIGH PERFORMANCE', class: 'ev-band-high',
      headline: 'Strong foundation. Now find the next advantage.',
      copy: 'Your business appears well structured across the areas covered in this audit. The opportunity now is advanced optimisation, better intelligence, stronger conversion and scalable growth.'
    },
    {
      min: 71, max: 85, name: 'DIGITALLY STRONG', class: 'ev-band-strong',
      headline: 'Your business is operating well. The next opportunity is optimisation.',
      copy: 'You have a solid digital and operational base. The next level is connecting systems better, removing friction and preparing the business to scale without adding unnecessary complexity.'
    },
    {
      min: 51, max: 70, name: 'GROWTH READY', class: 'ev-band-growth',
      headline: 'You have a good base. Now strengthen the systems behind growth.',
      copy: 'Your business has several strong foundations. Improving a few weaker areas can make growth more predictable, easier to manage and less dependent on manual effort.'
    },
    {
      min: 31, max: 50, name: 'DEVELOPING', class: 'ev-band-developing',
      headline: 'Your business is moving, but disconnected processes may be holding it back.',
      copy: 'You already have pieces working, but some gaps may be creating lost enquiries, manual work or inconsistent customer experiences. The next step is connecting the important parts.'
    },
    {
      min: 0, max: 30, name: 'FOUNDATION NEEDED', class: 'ev-band-foundation',
      headline: 'Your business has room to build a stronger foundation.',
      copy: 'There are meaningful opportunities to strengthen how your business is presented, discovered, managed and prepared for growth. The priority is to fix the fundamentals before adding more complexity.'
    }
  ];

  // Recommendations per area
  var RECOMMENDATIONS = {
    'Brand Clarity': {
      title: 'Make your value clear in seconds',
      copy: 'Clarify what you do, who you help and why a customer should choose you. Use the same positioning consistently across your website, social profiles, sales material and introductions.'
    },
    'Online Presence': {
      title: 'Strengthen what customers find before they contact you',
      copy: 'Make sure your website, Google presence and social profiles are current, trustworthy and consistent. Every touchpoint should make the next action obvious.'
    },
    'Lead Generation': {
      title: 'Build a more predictable enquiry engine',
      copy: 'Reduce dependence on random enquiries or referrals alone. Develop at least one repeatable channel that consistently brings the right prospects into your business.'
    },
    'Sales Process': {
      title: 'Turn enquiries into a defined sales flow',
      copy: 'Create a clear process from enquiry to follow-up, quotation and payment so opportunities are not lost because of inconsistent handling.'
    },
    'Customer Information': {
      title: 'Create one reliable source of customer information',
      copy: 'Bring customer, sales and follow-up information into a structured system so your team is not depending on scattered chats, notebooks or disconnected files.'
    },
    'Operations': {
      title: 'Remove repetitive work from daily operations',
      copy: 'Identify the tasks your team repeats most often and systemise the highest-impact ones first. The goal is fewer manual steps, fewer errors and more visibility.'
    },
    'Scalability': {
      title: 'Prepare your systems before growth creates pressure',
      copy: 'Document the processes that would break first if demand doubled. Strengthen those areas before adding more customers, staff or locations.'
    }
  };

  // All-A fallback recommendations
  var ALL_A_RECS = [
    { title: 'Improve conversion intelligence', copy: 'Use data from your existing systems to better understand which channels, messages and processes convert best, and double down on what works.' },
    { title: 'Connect systems and reporting', copy: 'Link your existing tools so information flows automatically between them, reducing manual data entry and giving you a single view of business health.' },
    { title: 'Explore advanced automation and scale', copy: 'Look for the next layer of automation — AI-assisted workflows, predictive analytics, and scalable infrastructure that can handle 10x growth.' }
  ];

  // Business impact priority for tie-breaking (opportunity ordering)
  var IMPACT_PRIORITY = [
    'Lead Generation', 'Sales Process', 'Operations',
    'Customer Information', 'Scalability', 'Online Presence', 'Brand Clarity'
  ];

  // Industries
  var INDUSTRIES = [
    'Retail', 'Trading', 'Manufacturing', 'Construction', 'Real Estate',
    'Healthcare', 'Education', 'Food & Beverage', 'Beauty & Wellness',
    'Professional Services', 'E-commerce', 'Automotive', 'Hospitality',
    'Export/Import', 'Other'
  ];


  // ============ STATE ============
  var state = {
    currentScreen: 'hero', // hero, quiz, form, calculating, result
    currentQuestion: 0,
    answers: {},      // { q1: 'A', q2: 'B', ... }
    lead: {},
    score: 0,
    band: null,
    strongest: null,
    weakest: null,
    secondWeakest: null,
    recommendations: [],
    submitted: false
  };


  // ============ SCREEN MANAGER ============
  function showScreen(screenId) {
    var screens = document.querySelectorAll('[data-screen]');
    screens.forEach(function (el) {
      el.classList.remove('ev-active-screen');
    });
    var target = document.querySelector('[data-screen="' + screenId + '"]');
    if (target) {
      target.classList.add('ev-active-screen');
    }
    state.currentScreen = screenId;
    
    // Bulletproof scroll-to-top for SPAs
    document.documentElement.style.scrollBehavior = 'auto';
    setTimeout(function() {
      if (target) {
        try {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        } catch(e) {}
      }
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      
      setTimeout(function() {
        document.documentElement.style.scrollBehavior = 'smooth';
      }, 50);
    }, 50);
  }


  // ============ QUIZ RENDERER ============
  function renderQuestion(index, direction) {
    var q = QUESTIONS[index];
    var container = document.getElementById('ev-quiz-questions');
    if (!container) return;

    // Update progress
    var progressBar = document.getElementById('ev-progress-bar');
    var progressStep = document.getElementById('ev-progress-step');
    if (progressBar) progressBar.style.width = ((index + 1) / 7 * 100) + '%';
    if (progressStep) progressStep.textContent = 'QUESTION ' + (index + 1) + ' OF 7';

    // Build question card
    var selectedAnswer = state.answers[q.id] || null;

    var html = '<div class="ev-question-card ev-active" id="ev-qcard-' + index + '">';
    html += '<div class="ev-question-number">0' + (index + 1) + '</div>';
    html += '<div class="ev-question-category">' + q.category + '</div>';
    html += '<div class="ev-question-text">' + q.text + '</div>';
    html += '<ul class="ev-options-list">';

    q.options.forEach(function (opt) {
      var isSelected = selectedAnswer === opt.letter;
      html += '<li class="ev-option' + (isSelected ? ' ev-selected' : '') + '" data-question="' + q.id + '" data-letter="' + opt.letter + '">';
      html += '<span class="ev-option-letter">' + opt.letter + '</span>';
      html += '<span class="ev-option-text">' + opt.text + '</span>';
      html += '</li>';
    });

    html += '</ul></div>';
    container.innerHTML = html;

    // Update back button
    var backBtn = document.getElementById('ev-btn-back');
    if (backBtn) {
      if (index === 0) {
        backBtn.classList.add('ev-hidden');
      } else {
        backBtn.classList.remove('ev-hidden');
      }
    }

    // Update continue button
    updateContinueButton();

    // Bind option clicks
    var options = container.querySelectorAll('.ev-option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        var qid = this.getAttribute('data-question');
        var letter = this.getAttribute('data-letter');
        state.answers[qid] = letter;

        // Update UI
        options.forEach(function (o) {
          o.classList.remove('ev-selected');
          o.classList.remove('ev-answer-flash');
        });
        this.classList.add('ev-selected');
        this.classList.add('ev-answer-flash');
        updateContinueButton();

        // Trigger 3D shape reaction
        triggerAnswerReaction();

        // Analytics
        logEvent('question_' + (index + 1) + '_completed');
      });
    });
  }

  function updateContinueButton() {
    var q = QUESTIONS[state.currentQuestion];
    var continueBtn = document.getElementById('ev-btn-continue');
    var continueBtnText = document.getElementById('ev-btn-continue-text');
    if (!continueBtn) return;

    var hasAnswer = !!state.answers[q.id];
    if (hasAnswer) {
      continueBtn.classList.add('ev-enabled');
    } else {
      continueBtn.classList.remove('ev-enabled');
    }

    // Last question shows different text
    if (state.currentQuestion === 6) {
      if (continueBtnText) continueBtnText.textContent = 'CONTINUE';
    } else {
      if (continueBtnText) continueBtnText.textContent = 'CONTINUE';
    }
  }

  function nextQuestion() {
    var q = QUESTIONS[state.currentQuestion];
    if (!state.answers[q.id]) return;

    if (state.currentQuestion < 6) {
      state.currentQuestion++;
      renderQuestion(state.currentQuestion, 'next');
    } else {
      // All questions answered — go to lead form
      showScreen('form');
      logEvent('lead_form_viewed');
    }
  }

  function prevQuestion() {
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
      renderQuestion(state.currentQuestion, 'prev');
    }
  }


  // ============ SCORING ENGINE ============
  function calculateScore() {
    var totalScore = 0;
    var areas = [];

    QUESTIONS.forEach(function (q, i) {
      var answerLetter = state.answers[q.id];
      var points = 0;
      var normalized = 0;

      q.options.forEach(function (opt) {
        if (opt.letter === answerLetter) {
          points = opt.points;
        }
      });

      // Normalized strength
      if (answerLetter === 'A') normalized = 100;
      else if (answerLetter === 'B') normalized = 67;
      else if (answerLetter === 'C') normalized = 33;
      else normalized = 0;

      totalScore += points;
      areas.push({
        name: q.areaName,
        points: points,
        normalized: normalized,
        answerLetter: answerLetter,
        questionIndex: i
      });
    });

    if (totalScore > 85) {
      totalScore = 85;
    }
    state.score = totalScore;

    // Determine band
    BANDS.forEach(function (band) {
      if (totalScore >= band.min && totalScore <= band.max) {
        state.band = band;
      }
    });

    // Strongest area — highest normalized, first in questionnaire order for ties
    var sortedByStrength = areas.slice().sort(function (a, b) {
      if (b.normalized !== a.normalized) return b.normalized - a.normalized;
      return a.questionIndex - b.questionIndex;
    });
    state.strongest = sortedByStrength[0];

    // Opportunity ranking — weakest areas, using business-impact priority for ties
    var sortedByWeakness = areas.slice().sort(function (a, b) {
      if (a.normalized !== b.normalized) return a.normalized - b.normalized;
      // Tie: use business-impact priority
      var aPriority = IMPACT_PRIORITY.indexOf(a.name);
      var bPriority = IMPACT_PRIORITY.indexOf(b.name);
      return aPriority - bPriority;
    });

    state.weakest = sortedByWeakness[0];
    state.secondWeakest = sortedByWeakness[1];

    // 3 recommendations — lowest 3 areas
    var allA = areas.every(function (a) { return a.answerLetter === 'A'; });
    if (allA) {
      state.recommendations = ALL_A_RECS;
    } else {
      state.recommendations = [];
      for (var i = 0; i < 3 && i < sortedByWeakness.length; i++) {
        var rec = RECOMMENDATIONS[sortedByWeakness[i].name];
        if (rec) {
          state.recommendations.push({
            title: rec.title,
            copy: rec.copy,
            area: sortedByWeakness[i].name
          });
        }
      }
    }

    return totalScore;
  }


  // ============ LEAD FORM ============
  function validateForm() {
    var name = document.getElementById('ev-input-name');
    var business = document.getElementById('ev-input-business');
    var whatsapp = document.getElementById('ev-input-whatsapp');
    var industry = document.getElementById('ev-input-industry');
    var consent = document.getElementById('ev-input-consent');
    var errorEl = document.getElementById('ev-form-error');

    // Validate name
    var nameVal = name ? name.value.trim() : '';
    if (nameVal.length < 2 || nameVal.length > 80) {
      showFormError('Please enter your name (2-80 characters).');
      return false;
    }

    // Validate business
    var bizVal = business ? business.value.trim() : '';
    if (bizVal.length < 2 || bizVal.length > 120) {
      showFormError('Please enter your business name (2-120 characters).');
      return false;
    }

    // Validate WhatsApp
    var waVal = whatsapp ? whatsapp.value.trim().replace(/[\s\-\(\)]/g, '') : '';
    if (waVal.length < 10 || !/^\+?\d{10,15}$/.test(waVal)) {
      showFormError('Enter a valid WhatsApp number with country code.');
      return false;
    }

    // Validate industry
    var indVal = industry ? industry.value : '';
    if (!indVal) {
      showFormError('Please select your industry.');
      return false;
    }

    // Validate consent
    if (!consent || !consent.checked) {
      showFormError('Please confirm the checkbox to receive your audit result and relevant recommendations.');
      return false;
    }

    // Save lead data
    state.lead = {
      name: nameVal,
      business_name: bizVal,
      whatsapp: waVal,
      industry: indVal,
      website_or_instagram: (document.getElementById('ev-input-website') || {}).value || '',
      consent: true,
      consent_timestamp: new Date().toISOString()
    };

    hideFormError();
    return true;
  }

  function showFormError(msg) {
    var el = document.getElementById('ev-form-error');
    if (el) {
      el.textContent = msg;
      el.classList.add('ev-visible');
    }
  }

  function hideFormError() {
    var el = document.getElementById('ev-form-error');
    if (el) el.classList.remove('ev-visible');
  }

  function submitForm() {
    if (state.submitted) return;
    if (!validateForm()) return;
    state.submitted = true;

    logEvent('lead_form_submitted');

    // Show calculating screen
    showScreen('calculating');

    // Calculate score
    calculateScore();

    // Submit to Google Sheets (async, non-blocking)
    submitToGoogleSheets();

    // Dramatic pause then show results
    setTimeout(function () {
      showScreen('result');
      renderResults();
      logEvent('score_revealed');
    }, 2500);
  }


  // ============ GOOGLE SHEETS SUBMISSION ============
  function submitToGoogleSheets() {
    if (!CONFIG.GOOGLE_SHEET_URL) {
      console.log('[EVOLIX] Google Sheet URL not configured. Lead data:');
      console.log(buildLeadRecord());
      return;
    }

    var data = buildLeadRecord();

    fetch(CONFIG.GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function () {
      console.log('[EVOLIX] Lead submitted to Google Sheets');
    }).catch(function (err) {
      console.error('[EVOLIX] Sheet submission error:', err);
    });
  }

  function buildLeadRecord() {
    var areas = [];
    QUESTIONS.forEach(function (q) {
      var letter = state.answers[q.id] || 'N/A';
      var points = 0;
      q.options.forEach(function (opt) {
        if (opt.letter === letter) points = opt.points;
      });
      areas.push({ question: q.areaName, answer: letter, points: points });
    });

    return {
      timestamp: new Date().toISOString(),
      campaign_source: CONFIG.CAMPAIGN_SOURCE,
      name: state.lead.name,
      business_name: state.lead.business_name,
      whatsapp: state.lead.whatsapp,
      industry: state.lead.industry,
      website_or_instagram: state.lead.website_or_instagram,
      consent: state.lead.consent,
      consent_timestamp: state.lead.consent_timestamp,
      q1_answer: state.answers.q1 || '',
      q1_points: areas[0] ? areas[0].points : 0,
      q2_answer: state.answers.q2 || '',
      q2_points: areas[1] ? areas[1].points : 0,
      q3_answer: state.answers.q3 || '',
      q3_points: areas[2] ? areas[2].points : 0,
      q4_answer: state.answers.q4 || '',
      q4_points: areas[3] ? areas[3].points : 0,
      q5_answer: state.answers.q5 || '',
      q5_points: areas[4] ? areas[4].points : 0,
      q6_answer: state.answers.q6 || '',
      q6_points: areas[5] ? areas[5].points : 0,
      q7_answer: state.answers.q7 || '',
      q7_points: areas[6] ? areas[6].points : 0,
      evolix_score: state.score,
      score_band: state.band ? state.band.name : '',
      strongest_area: state.strongest ? state.strongest.name : '',
      weakest_area: state.weakest ? state.weakest.name : '',
      second_weakest_area: state.secondWeakest ? state.secondWeakest.name : '',
      recommendations: state.recommendations.map(function (r) { return r.title; }).join(' | '),
      roadmap_cta_clicked: 'No',
      whatsapp_cta_clicked: 'No'
    };
  }


  // ============ RESULT RENDERER ============
  function renderResults() {
    // Score number with count-up
    var scoreEl = document.getElementById('ev-score-value');
    if (scoreEl) {
      animateCountUp(scoreEl, 0, state.score, 1500);
    }

    // Score ring
    var ringFill = document.getElementById('ev-ring-fill');
    if (ringFill) {
      var circumference = 2 * Math.PI * 100; // r=100
      var offset = circumference - (state.score / 100) * circumference;
      setTimeout(function () {
        ringFill.style.strokeDashoffset = offset;
      }, 300);
    }

    // Band
    var bandEl = document.getElementById('ev-band-label');
    var bandCopyEl = document.getElementById('ev-band-copy');
    if (bandEl && state.band) {
      bandEl.textContent = state.band.name;
      bandEl.className = 'ev-score-band ' + state.band.class;
    }
    if (bandCopyEl && state.band) {
      bandCopyEl.textContent = state.band.copy;
    }

    // Band headline
    var bandHeadlineEl = document.getElementById('ev-band-headline');
    if (bandHeadlineEl && state.band) {
      bandHeadlineEl.textContent = state.band.headline;
    }

    // Insights
    renderInsight('ev-strongest', state.strongest ? state.strongest.name : '');
    renderInsight('ev-weakest', state.weakest ? state.weakest.name : '');
    renderInsight('ev-second', state.secondWeakest ? state.secondWeakest.name : '');

    // Recommendations
    var recsContainer = document.getElementById('ev-rec-cards');
    if (recsContainer) {
      var recsHtml = '';
      state.recommendations.forEach(function (rec, i) {
        recsHtml += '<div class="ev-rec-card" style="transition-delay: ' + (i * 0.15) + 's">';
        recsHtml += '<div class="ev-rec-watermark">0' + (i + 1) + '</div>';
        recsHtml += '<div class="ev-rec-content">';
        recsHtml += '<div class="ev-rec-title">' + rec.title + '</div>';
        recsHtml += '<div class="ev-rec-copy">' + rec.copy + '</div>';
        recsHtml += '</div></div>';
      });
      recsContainer.innerHTML = recsHtml;

      // Animate in
      setTimeout(function () {
        var cards = recsContainer.querySelectorAll('.ev-rec-card');
        cards.forEach(function (card, i) {
          setTimeout(function () {
            card.classList.add('ev-animate-in');
          }, i * 200);
        });
      }, 500);
    }

    // WhatsApp CTA link
    var waBtn = document.getElementById('ev-whatsapp-btn');
    if (waBtn) {
      var message = 'Hi EVOLIX, I completed the Business Evolution Audit and received an EVOLIX Score of *' + state.score + '/100*. My biggest opportunity was *' + (state.weakest ? state.weakest.name : '') + '*. I would like to understand my Evolution Roadmap.';
      waBtn.href = 'https://wa.me/' + CONFIG.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    }

    // Animate insight cards
    setTimeout(function () {
      var insightCards = document.querySelectorAll('.ev-insight-card');
      insightCards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add('ev-animate-in');
        }, i * 200);
      });
    }, 800);

    // Show score reveal with animation
    var revealEl = document.getElementById('ev-score-reveal');
    if (revealEl) {
      setTimeout(function () {
        revealEl.classList.add('ev-visible');
        spawnParticles();
      }, 200);
    }
  }

  function renderInsight(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function animateCountUp(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * (end - start) + start);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function spawnParticles() {
    var container = document.getElementById('ev-particles');
    if (!container) return;

    var colors = ['#cc3f48', '#d9962f', '#f2f1ec', '#6366f1', '#34d399'];

    for (var i = 0; i < 150; i++) {
      (function (index) {
        var p = document.createElement('div');
        p.className = 'ev-particle';
        p.style.left = '50%';
        p.style.top = '40%';
        p.style.background = colors[index % colors.length];
        p.style.width = (Math.random() * 6 + 3) + 'px';
        p.style.height = p.style.width;
        container.appendChild(p);

        var angle = (index / 150) * Math.PI * 2 + Math.random() * 0.5;
        var velocity = Math.random() * 400 + 150;
        var tx = Math.cos(angle) * velocity;
        var ty = Math.sin(angle) * velocity - (Math.random() * 200 + 100);

        p.animate([
          { opacity: 1, transform: 'translate(0, 0) scale(1)' },
          { opacity: 0, transform: 'translate(' + tx + 'px, ' + ty + 'px) scale(0)' }
        ], {
          duration: Math.random() * 2000 + 1500,
          easing: 'cubic-bezier(0, 0.9, 0.57, 1)',
          delay: Math.random() * 300
        });

        setTimeout(function () {
          if (p.parentNode) p.parentNode.removeChild(p);
        }, 4000);
      })(i);
    }
  }


  // ============ ANALYTICS STUBS ============
  function logEvent(name) {
    console.log('[EVOLIX Analytics]', name);
    // Future: gtag('event', name, { event_category: 'audit' });
  }


  // ============ SCROLL REVEAL ============
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('ev-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.ev-reveal').forEach(function (el) {
      observer.observe(el);
    });
  }


  // ============ INDUSTRY DROPDOWN ============
  function populateIndustries() {
    var sel = document.getElementById('ev-input-industry');
    if (!sel) return;

    INDUSTRIES.forEach(function (ind) {
      var opt = document.createElement('option');
      opt.value = ind;
      opt.textContent = ind;
      sel.appendChild(opt);
    });

    sel.addEventListener('change', function () {
      if (this.value) {
        this.classList.add('ev-has-value');
      } else {
        this.classList.remove('ev-has-value');
      }
    });
  }


  // ============ INITIALIZE ============
  function init() {
    // Start 3D scene
    initThreeScene();

    // Populate industry dropdown
    populateIndustries();

    // Log audit viewed
    logEvent('audit_viewed');

    // Scroll reveal
    initScrollReveal();

    // ---- Event Bindings ----

    // Start button
    var startBtn = document.getElementById('ev-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showScreen('quiz');
        renderQuestion(0, 'next');
        logEvent('audit_started');
      });
    }

    // Continue button
    var continueBtn = document.getElementById('ev-btn-continue');
    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        if (this.classList.contains('ev-enabled')) {
          nextQuestion();
        }
      });
    }

    // Back button
    var backBtn = document.getElementById('ev-btn-back');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        prevQuestion();
      });
    }

    // Submit form button
    var submitBtn = document.getElementById('ev-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function (e) {
        e.preventDefault();
        submitForm();
      });
    }

    // WhatsApp CTA tracking
    var waBtn = document.getElementById('ev-whatsapp-btn');
    if (waBtn) {
      waBtn.addEventListener('click', function () {
        logEvent('whatsapp_opened');
        logEvent('roadmap_cta_clicked');
      });
    }

    // Keyboard support
    document.addEventListener('keydown', function (e) {
      if (state.currentScreen === 'quiz') {
        if (e.key === 'Enter') {
          var continueBtn = document.getElementById('ev-btn-continue');
          if (continueBtn && continueBtn.classList.contains('ev-enabled')) {
            nextQuestion();
          }
        }
        if (e.key === 'Backspace' && document.activeElement.tagName !== 'INPUT') {
          prevQuestion();
        }
        // Quick select A/B/C/D
        var keyMap = { a: 'A', b: 'B', c: 'C', d: 'D' };
        if (keyMap[e.key.toLowerCase()] && document.activeElement.tagName !== 'INPUT') {
          var letter = keyMap[e.key.toLowerCase()];
          var opt = document.querySelector('.ev-option[data-letter="' + letter + '"]');
          if (opt) opt.click();
        }
      }
    });
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
