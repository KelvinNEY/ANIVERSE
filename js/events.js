(function () {
  'use strict';

  var STORAGE_KEY = 'animehub_rsvp_session';
  var FILTERS = ['All', 'Convention', 'Competition', 'Screening', 'Workshop'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var currentMonth = 3; // April (0-based)
  var currentYear = 2026;

  var events = [
    {
      id: 'comic-fiesta',
      title: 'Comic Fiesta 2026',
      month: 'APR',
      day: '12',
      dateLine: '12 Apr 2026',
      place: 'Kuala Lumpur Convention Centre, KL',
      blurb:
        "Malaysia's biggest anime and cosplay convention returns for its 2026 edition. Featuring international guests, exclusive merchandise, cosplay competitions, gaming zones, and live performances.",
      details:
        'Experience the full convention atmosphere with multiple stages, cosplay challenges, merch booths, and a dedicated artist alley. The event hall will be decorated with themed lighting and interactive photo spots.',
      image: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80',
      categories: ['Convention', 'Cosplay'],
      featured: true,
      capacity: 200,
      reserved: 82,
      date: new Date(2026, 3, 12),
      time: '9:00 AM - 7:00 PM'
    },
    {
      id: 'cosplay-showdown',
      title: 'AniVerse Cosplay Showdown',
      month: 'APR',
      day: '15',
      dateLine: '15 Apr 2026',
      place: 'Sunway Pyramid, Selangor',
      blurb: 'Cosplay tournament, judging panels, and spotlight performances for the most daring builds.',
      details:
        'Contestants will showcase themed costumes under stage lights with live commentary. Audience members can preview finalist entries and enjoy a cosplay runway with props and special effects.',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
      categories: ['Competition'],
      capacity: 120,
      reserved: 28,
      date: new Date(2026, 3, 15),
      time: '2:00 PM - 8:00 PM'
    },
    {
      id: 'anime-matsuri',
      title: 'Anime Matsuri — Spring Edition',
      month: 'APR',
      day: '19',
      dateLine: '19 Apr 2026',
      place: 'Mid Valley Exhibition Centre, KL',
      blurb: 'A vibrant spring festival with livestream stages, guest panels, and fan meetups.',
      details:
        'The spring edition includes themed cafes, exclusive merch drops, and open panels where creators answer fan questions. Enjoy photo zones, live DJs, and scheduled meet & greets.',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      categories: ['Convention'],
      capacity: 180,
      reserved: 92,
      date: new Date(2026, 3, 19),
      time: '10:00 AM - 6:00 PM'
    },
    {
      id: 'demon-slayer',
      title: 'Demon Slayer Infinity Castle — Premiere Night',
      month: 'APR',
      day: '23',
      dateLine: '23 Apr 2026',
      place: 'GSC Mid Valley, KL',
      blurb: 'Exclusive first screening with guest commentary and cosplay prizes.',
      details:
        'This premium screening features a themed lobby, photo wall, and a post-screening cosplay contest. Seats are limited and include a commemorative event badge.',
      image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80',
      categories: ['Screening'],
      capacity: 140,
      reserved: 104,
      date: new Date(2026, 3, 23),
      time: '7:00 PM - 10:00 PM'
    },
    {
      id: 'worbla-workshop',
      title: 'Worbla & Foam Armour Workshop',
      month: 'APR',
      day: '26',
      dateLine: '26 Apr 2026',
      place: 'The Maker Space, Petaling Jaya',
      blurb: 'Hands-on cosplay armour crafting with expert builders.',
      details:
        'Participants will learn how to shape Worbla, add detailing to foam armour, and finish pieces with paint and weathering. Materials and tools are provided at the workshop tables.',
      image: 'https://images.unsplash.com/photo-1496483648148-47c686dc86a8?auto=format&fit=crop&w=1200&q=80',
      categories: ['Workshop'],
      capacity: 60,
      reserved: 35,
      date: new Date(2026, 3, 26),
      time: '1:00 PM - 5:00 PM'
    },
    {
      id: 'open-championship',
      title: 'Malaysia Cosplay Open Championship',
      month: 'MAY',
      day: '03',
      dateLine: '03 May 2026',
      place: 'Sunway Convention Centre, Selangor',
      blurb: 'National cosplay championship with regional finalists and live judging.',
      details:
        'The championship will feature elaborate performance rounds, guest judges, and a finale on the main stage. Fans can explore sponsor booths and vote for the crowd favorite.',
      image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?auto=format&fit=crop&w=1200&q=80',
      categories: ['Convention', 'Competition'],
      capacity: 220,
      reserved: 56,
      date: new Date(2026, 4, 3),
      time: '11:00 AM - 9:00 PM'
    },
    {
      id: 'ghibli-screening',
      title: 'Studio Ghibli 40th Anniversary Screening',
      month: 'MAY',
      day: '10',
      dateLine: '10 May 2026',
      place: 'TGV KLCC, KL',
      blurb: 'A special anniversary screening celebrating Japan’s most beloved animation studio.',
      details:
        'Celebrate Studio Ghibli with an exclusive film lineup, themed decor, and limited-edition souvenirs. The screening room is set with classic artwork and ambient mood lighting.',
      image: 'https://images.unsplash.com/photo-1517632298123-cedf6cf8f58c?auto=format&fit=crop&w=1200&q=80',
      categories: ['Screening'],
      capacity: 100,
      reserved: 72,
      date: new Date(2026, 4, 10),
      time: '6:00 PM - 9:00 PM'
    },
    {
      id: 'japan-expo',
      title: 'Japan Expo Southeast Asia 2026',
      month: 'MAY',
      day: '11',
      dateLine: '11 May 2026',
      place: 'Marina Bay Sands, Singapore',
      blurb: 'A Southeast Asia anime convention with exhibitions, games, and live stages.',
      details:
        'This regional expo brings together pop culture exhibitors, live music, and cultural showcases across multiple halls. Expect interactive displays and a cosplay marketplace.',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
      categories: ['Convention'],
      capacity: 240,
      reserved: 118,
      date: new Date(2026, 4, 11),
      time: '9:00 AM - 7:00 PM'
    },
    {
      id: 'wig-masterclass',
      title: 'Wig Styling Masterclass',
      month: 'MAY',
      day: '24',
      dateLine: '24 May 2026',
      place: 'AniVerse Studio, KL',
      blurb: 'Learn wig styling and maintenance from cosplay professionals.',
      details:
        'This hands-on masterclass covers wig cutting, styling techniques, and heat-safe adjustments. Students leave with a styled wig and practical care tips.',
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
      categories: ['Workshop'],
      capacity: 50,
      reserved: 18,
      date: new Date(2026, 4, 24),
      time: '10:00 AM - 4:00 PM'
    }
  ];

  function loadJSON(store, key, fallback) {
    try {
      var raw = store.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function saveJSON(store, key, value) {
    store.setItem(key, JSON.stringify(value));
  }

  function getRsvps() {
    return loadJSON(sessionStorage, STORAGE_KEY, []);
  }

  function addRsvp(entry) {
    var list = getRsvps();
    list.push(entry);
    saveJSON(sessionStorage, STORAGE_KEY, list);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatDateLabel(date) {
    var opts = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', opts);
  }

  function getSelectedFilter() {
    var selected = document.querySelector('.filter-aniverse .btn-check:checked');
    return selected ? selected.value : 'All';
  }

  function updateRsvpCount() {
    var count = getRsvps().length;
    var counter = document.getElementById('rsvpCount');
    if (counter) {
      counter.textContent = String(count);
    }
  }

  function renderFilters() {
    var container = document.getElementById('filterButtons');
    if (!container) return;
    container.innerHTML = '';
    FILTERS.forEach(function (type, index) {
      var id = 'filter-' + type.toLowerCase();
      var input = document.createElement('input');
      input.type = 'radio';
      input.className = 'btn-check';
      input.name = 'eventFilter';
      input.id = id;
      input.value = type;
      input.checked = type === 'All';
      input.autocomplete = 'off';
      var label = document.createElement('label');
      label.className = 'btn btn-outline-secondary btn-filter-' + type.toLowerCase();
      label.htmlFor = id;
      label.textContent = type;
      container.appendChild(input);
      container.appendChild(label);
      input.addEventListener('change', renderAllEvents);
    });
  }

  function getEventTagClass(category) {
    return 'event-tag event-tag-' + category.toLowerCase();
  }

  function renderFeaturedEvent() {
    var featured = events.find(function (event) {
      return event.featured;
    });
    var target = document.getElementById('featuredEvent');
    if (!featured || !target) return;
    var fillWidth = Math.min(100, Math.round((featured.reserved / featured.capacity) * 100));
    target.innerHTML =
      '<div class="event-featured-label">Featured</div>' +
      '<div class="event-featured-header">' +
      '<div class="event-featured-date" aria-hidden="true">' +
      '<p class="month">' + escapeHtml(featured.month) + '</p>' +
      '<p class="day">' + escapeHtml(featured.day) + '</p>' +
      '</div>' +
      '<div>' +
      '<h2 class="event-featured-title">' + escapeHtml(featured.title) + '</h2>' +
      '<p class="event-featured-meta"><span><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>' + escapeHtml(featured.place) + '</span><span>' + escapeHtml(featured.dateLine) + '</span></p>' +
      '<div class="event-card-tags">' +
      featured.categories.map(function (cat) {
        return '<span class="event-tag ' + getEventTagClass(cat).split(' ').slice(1).join(' ') + '">' + escapeHtml(cat) + '</span>';
      }).join('') +
      '</div>' +
      '<p class="event-featured-description">' + escapeHtml(featured.blurb) + '</p>' +
      '<div class="event-featured-actions">' +
      '<button type="button" class="btn btn-accent btn-rsvp-bracket rsvp-open" data-event-id="' + featured.id + '" data-event-title="' + escapeHtml(featured.title) + '">RSVP</button>' +
      '<button type="button" class="btn btn-outline-secondary details-open" data-event-id="' + featured.id + '">View Details →</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="event-capacity-wrap">' +
      '<div class="event-capacity-text"><span>Capacity</span><span>' + escapeHtml(String(featured.reserved)) + ' / ' + escapeHtml(String(featured.capacity)) + ' spots</span></div>' +
      '<div class="event-capacity-bar"><div class="event-capacity-fill" style="width:' + fillWidth + '%"></div></div>' +
      '</div>';
    target.querySelectorAll('.rsvp-open').forEach(function (btn) {
      btn.addEventListener('click', openRsvpModal);
    });
    target.querySelectorAll('.details-open').forEach(function (btn) {
      btn.addEventListener('click', openDetailsModal);
    });
  }

  function renderAllEvents() {
    var listEl = document.getElementById('eventsList');
    if (!listEl) return;
    var selectedFilter = getSelectedFilter();
    var filteredEvents = events.filter(function (ev) {
      return selectedFilter === 'All' || ev.categories.indexOf(selectedFilter) > -1;
    });
    listEl.innerHTML = filteredEvents
      .map(function (ev) {
        var tags = ev.categories
          .map(function (cat) {
            return '<span class="' + getEventTagClass(cat) + '">' + escapeHtml(cat) + '</span>';
          })
          .join('');
        return (
          '<article class="event-card">' +
          '<div class="event-card-left">' +
          '<div class="event-date-box" aria-hidden="true">' +
          '<div class="month">' + escapeHtml(ev.month) + '</div>' +
          '<div class="day">' + escapeHtml(ev.day) + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="event-card-right">' +
          '<h3 class="event-card-title">' + escapeHtml(ev.title) + '</h3>' +
          '<p class="event-card-subtext"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>' + escapeHtml(ev.place) + ' · ' + escapeHtml(ev.dateLine) + '</p>' +
          '<div class="event-card-tags">' + tags + '</div>' +
          '<div class="event-card-actions d-flex flex-wrap gap-3 align-items-center">' +
          '<button type="button" class="btn btn-rsvp-bracket rsvp-open" data-event-id="' + ev.id + '" data-event-title="' + escapeHtml(ev.title) + '">RSVP</button>' +
          '</div>' +
          '</div>' +
          '</article>'
        );
      })
      .join('');
    listEl.querySelectorAll('.rsvp-open').forEach(function (btn) {
      btn.addEventListener('click', openRsvpModal);
    });
    listEl.querySelectorAll('.details-open').forEach(function (btn) {
      btn.addEventListener('click', openDetailsModal);
    });
  }

  function renderCalendar() {
    var container = document.getElementById('eventCalendar');
    if (!container) return;
    container.innerHTML = '';
    var year = currentYear;
    var month = currentMonth;
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(function (wd) {
      var wdEl = document.createElement('div');
      wdEl.className = 'weekday';
      wdEl.textContent = wd;
      container.appendChild(wdEl);
    });
    for (var i = 0; i < firstDay; i++) {
      var emptyEl = document.createElement('div');
      emptyEl.className = 'day inactive';
      container.appendChild(emptyEl);
    }
    for (var day = 1; day <= daysInMonth; day++) {
      var dayEl = document.createElement('div');
      dayEl.className = 'day';
      dayEl.textContent = String(day);
      if (events.some(function (ev) {
        return ev.date.getDate() === day && ev.date.getMonth() === month && ev.date.getFullYear() === year;
      })) {
        dayEl.classList.add('has-events');
      }
      dayEl.addEventListener('click', function (event) {
        showDayEvents(event.target, parseInt(event.target.textContent));
      });
      container.appendChild(dayEl);
    }
  }

  function showDayEvents(el, day) {
    var selectedDateEl = document.getElementById('selectedDate');
    var dayEventsListEl = document.getElementById('dayEventsList');
    var selectedDayEventsEl = document.getElementById('selectedDayEvents');
    selectedDateEl.textContent = monthNames[currentMonth] + ' ' + day + ', ' + currentYear;
    dayEventsListEl.innerHTML = '';
    var dayEvents = events.filter(function (ev) {
      return ev.date.getDate() === day && ev.date.getMonth() === currentMonth && ev.date.getFullYear() === currentYear;
    });
    if (dayEvents.length === 0) {
      var li = document.createElement('li');
      li.textContent = 'No events on this day.';
      li.className = 'text-muted small';
      dayEventsListEl.appendChild(li);
    } else {
      dayEvents.forEach(function (ev) {
        var li = document.createElement('li');
        li.innerHTML = '<strong>' + escapeHtml(ev.title) + '</strong><br><small>' + escapeHtml(ev.time) + ' at ' + escapeHtml(ev.place) + '</small>';
        dayEventsListEl.appendChild(li);
      });
    }
    selectedDayEventsEl.classList.remove('d-none');
    document.querySelectorAll('.event-calendar .day').forEach(function (d) {
      d.classList.remove('selected');
    });
    el.classList.add('selected');
  }

  function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    } else if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    updateCalendarTitle();
    renderCalendar();
    // Hide selected day events when changing month
    var selectedDayEventsEl = document.getElementById('selectedDayEvents');
    selectedDayEventsEl.classList.add('d-none');
  }

  function updateCalendarTitle() {
    var titleEl = document.getElementById('calendarTitle');
    if (titleEl) {
      titleEl.textContent = '// ' + monthNames[currentMonth] + ' ' + currentYear;
    }
  }

  function renderNearbyEvents() {
    var list = document.getElementById('nearbyEvents');
    if (!list) return;
    var nearby = events
      .filter(function (ev) {
        return ev.date.getMonth() === 3;
      })
      .sort(function (a, b) {
        return a.date - b.date;
      })
      .slice(0, 4);
    list.innerHTML = nearby
      .map(function (ev) {
        return (
          '<li>' +
          '<div class="event-summary-date">' + escapeHtml(ev.dateLine) + '</div>' +
          '<p class="event-summary-title">' + escapeHtml(ev.title) + '</p>' +
          '</li>'
        );
      })
      .join('');
  }

  function renderYourRsvps() {
    var list = document.getElementById('yourRsvps');
    if (!list) return;
    var rsvps = getRsvps();
    if (!rsvps.length) {
      list.innerHTML = '<li class="text-muted">No RSVPs yet. Pick an event to save your spot.</li>';
      return;
    }
    var items = rsvps
      .slice(-4)
      .reverse()
      .map(function (entry) {
        var ev = events.find(function (item) {
          return item.id === entry.eventId;
        });
        if (!ev) return '';
        return (
          '<li>' +
          '<div class="event-summary-date">' + escapeHtml(ev.dateLine) + '</div>' +
          '<p class="event-summary-title">' + escapeHtml(ev.title) + '</p>' +
          '</li>'
        );
      })
      .join('');
    list.innerHTML = items;
  }

  function openRsvpModal(event) {
    var button = event.currentTarget;
    var eventId = button.getAttribute('data-event-id');
    var eventTitle = button.getAttribute('data-event-title');
    var eventData = events.find(function (item) {
      return item.id === eventId;
    });
    var detailsModalEl = document.getElementById('eventDetailsModal');
    if (detailsModalEl) {
      var detailsModal = bootstrap.Modal.getInstance(detailsModalEl);
      if (detailsModal) {
        detailsModal.hide();
      }
    }
    var modalEl = document.getElementById('rsvpModal');
    var titleEl = document.getElementById('rsvpModalHeading');
    var locationEl = document.getElementById('rsvpModalLocation');
    var idInput = document.getElementById('rsvpEventId');
    var formView = document.getElementById('rsvpFormView');
    var successView = document.getElementById('rsvpSuccessView');
    if (titleEl) titleEl.textContent = eventTitle || 'RSVP';
    if (locationEl && eventData) locationEl.textContent = eventData.place + ' · ' + eventData.dateLine;
    if (idInput) idInput.value = eventId || '';
    if (formView) formView.classList.remove('d-none');
    if (successView) successView.classList.add('d-none');
    var modal = modalEl ? new bootstrap.Modal(modalEl) : null;
    if (modal) modal.show();
  }

  function openDetailsModal(event) {
    var button = event.currentTarget;
    var eventId = button.getAttribute('data-event-id');
    var eventData = events.find(function (item) {
      return item.id === eventId;
    });
    if (!eventData) return;
    var imageEl = document.getElementById('detailImage');
    var heading = document.getElementById('detailHeading');
    var venue = document.getElementById('detailVenue');
    var date = document.getElementById('detailDate');
    var tags = document.getElementById('detailTags');
    var description = document.getElementById('detailDescription');
    if (imageEl) {
      imageEl.src = eventData.image || '';
      imageEl.alt = eventData.title + ' reference image';
    }
    if (heading) heading.textContent = eventData.title;
    if (venue) venue.textContent = eventData.place + ' · ' + eventData.dateLine;
    if (date) date.textContent = eventData.categories.join(' • ');
    if (tags) {
      tags.innerHTML = eventData.categories
        .map(function (cat) {
          return '<span class="' + getEventTagClass(cat) + '">' + escapeHtml(cat) + '</span>';
        })
        .join('');
    }
    if (description) description.textContent = eventData.details || eventData.blurb;
    var rsvpButton = document.querySelector('#eventDetailsModal .rsvp-open');
    if (rsvpButton) {
      rsvpButton.setAttribute('data-event-id', eventData.id);
      rsvpButton.setAttribute('data-event-title', eventData.title);
    }
    var modalEl = document.getElementById('eventDetailsModal');
    var modal = modalEl ? new bootstrap.Modal(modalEl) : null;
    if (modal) modal.show();
  }

  function showSuccessView(eventData) {
    var formView = document.getElementById('rsvpFormView');
    var successView = document.getElementById('rsvpSuccessView');
    var successEvent = document.getElementById('rsvpSuccessEvent');
    var successDate = document.getElementById('rsvpSuccessDate');
    if (formView) formView.classList.add('d-none');
    if (successView) successView.classList.remove('d-none');
    if (successEvent) successEvent.textContent = eventData.title;
    if (successDate) successDate.textContent = eventData.dateLine;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderFilters();
    renderFeaturedEvent();
    renderAllEvents();
    renderCalendar();
    updateCalendarTitle();
    renderNearbyEvents();
    updateRsvpCount();
    renderYourRsvps();

    var prevBtn = document.getElementById('prevMonth');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        changeMonth(-1);
      });
    }
    var nextBtn = document.getElementById('nextMonth');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        changeMonth(1);
      });
    }

    var form = document.getElementById('rsvpForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }
        var name = document.getElementById('rsvpName').value.trim();
        var email = document.getElementById('rsvpEmail').value.trim();
        var tickets = document.getElementById('rsvpTickets').value;
        var eventId = document.getElementById('rsvpEventId').value;
        var eventData = events.find(function (item) {
          return item.id === eventId;
        });
        addRsvp({
          eventId: eventId,
          name: name,
          email: email,
          tickets: tickets,
          at: new Date().toISOString()
        });
        form.reset();
        form.classList.remove('was-validated');
        updateRsvpCount();
        renderYourRsvps();
        if (eventData) {
          showSuccessView(eventData);
        }
      });
    }

  });
})();
