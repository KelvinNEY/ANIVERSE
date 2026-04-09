(function () {
  'use strict';

  var POLL_DATA_KEY = 'animehub_polls';
  var VOTE_KEY = 'animehub_poll_votes';
  var COMMENTS_KEY = 'animehub_comments';

  var polls = [
    {
      id: 'anime-2026',
      title: 'Best Anime of 2026 So Far?',
      options: [
        { id: 'demon-slayer', label: 'Demon Slayer S5', votes: 183 },
        { id: 'jjk', label: 'Jujutsu Kaisen S4', votes: 274 },
        { id: 'chainsaw', label: 'Chainsaw Man S3', votes: 123 },
        { id: 'blue-lock', label: 'Blue Lock S3', votes: 98 }
      ],
      votes: 678,
      active: true
    },
    {
      id: 'cosplay-category',
      title: 'Favourite Cosplay Category?',
      options: [
        { id: 'armour', label: 'Armour Builds', votes: 84 },
        { id: 'fantasy', label: 'Fantasy / Magic', votes: 102 },
        { id: 'mecha', label: 'Mecha Suits', votes: 65 },
        { id: 'casual', label: 'Casual / School', votes: 52 }
      ],
      votes: 303,
      active: true
    },
    {
      id: 'studio-2026',
      title: 'Best Anime Studio Right Now?',
      options: [
        { id: 'mappa', label: 'MAPPA', votes: 198 },
        { id: 'ufotable', label: 'Ufotable', votes: 168 },
        { id: 'wit', label: 'WIT Studio', votes: 81 },
        { id: 'cloverworks', label: 'CloverWorks', votes: 65 }
      ],
      votes: 512,
      active: true
    }
  ];

  function getPollStorage() {
    return loadJSON(localStorage, POLL_DATA_KEY, null) || null;
  }

  function savePollStorage(data) {
    saveJSON(localStorage, POLL_DATA_KEY, data);
  }

  function getVotes() {
    return loadJSON(localStorage, VOTE_KEY, {}) || {};
  }

  function setVote(pollId, optionId) {
    var votes = getVotes();
    votes[pollId] = optionId;
    saveJSON(localStorage, VOTE_KEY, votes);
  }

  function getVote(pollId) {
    var votes = getVotes();
    return votes[pollId] || '';
  }

  function getComments() {
    return loadJSON(localStorage, COMMENTS_KEY, []);
  }

  function saveComments(list) {
    saveJSON(localStorage, COMMENTS_KEY, list);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initializeStorage() {
    var stored = getPollStorage();
    if (!stored) {
      var payload = {};
      polls.forEach(function (poll) {
        payload[poll.id] = {
          options: poll.options.reduce(function (acc, option) {
            acc[option.id] = option.votes;
            return acc;
          }, {}),
          votes: poll.votes
        };
      });
      savePollStorage(payload);
      return payload;
    }
    return stored;
  }

  function renderPolls() {
    var container = document.getElementById('pollList');
    if (!container) return;
    var stored = initializeStorage();
    var votes = getVotes();
    container.innerHTML = '';

    polls.forEach(function (poll) {
      var pollData = stored[poll.id] || { options: {}, votes: 0 };
      var card = document.createElement('div');
      card.className = 'community-poll-card';
      var header =
        '<div class="d-flex justify-content-between align-items-start gap-3 mb-4">' +
        '<h3>' + escapeHtml(poll.title) + '</h3>' +
        '<span class="poll-status-badge">ACTIVE</span>' +
        '</div>';
      var optionsHtml = '';
      var total = Object.values(pollData.options).reduce(function (sum, value) {
        return sum + value;
      }, 0);
      poll.options.forEach(function (option) {
        var count = pollData.options[option.id] || 0;
        var pct = total ? Math.round((count / total) * 100) : 0;
        var optionId = poll.id + '-' + option.id;
        var hasVoted = Boolean(votes[poll.id]);
        optionsHtml +=
          '<div class="poll-option-row">' +
          '<button type="button" class="poll-option-button" data-poll="' +
          poll.id +
          '" data-option="' +
          option.id +
          '"' +
          (hasVoted ? ' disabled' : '') +
          '>' +
          '<div class="poll-option-top"><span>' +
          escapeHtml(option.label) +
          '</span><span class="poll-option-pct">' +
          pct +
          '%</span></div>' +
          '<div class="poll-bar-track" role="progressbar" aria-valuenow="' +
          pct +
          '" aria-valuemin="0" aria-valuemax="100"><div class="poll-bar-fill" style="width:' +
          pct +
          '%"></div></div>' +
          '</button></div>';
      });

      card.innerHTML =
        header +
        optionsHtml +
        '<div class="poll-card-footer"><span>' +
        (pollData.votes || 0) +
        ' votes</span><span class="poll-action">' +
        (votes[poll.id] ? 'Vote saved locally' : 'Click to vote') +
        '</span></div>';
      container.appendChild(card);
    });

    container.querySelectorAll('.poll-option-button').forEach(function (button) {
      button.addEventListener('click', function () {
        var pollId = button.getAttribute('data-poll');
        var optionId = button.getAttribute('data-option');
        if (!pollId || !optionId) return;
        var storedData = initializeStorage();
        var pollData = storedData[pollId];
        if (!pollData) return;
        if (getVote(pollId)) return;
        pollData.options[optionId] = (pollData.options[optionId] || 0) + 1;
        pollData.votes = Object.values(pollData.options).reduce(function (sum, value) {
          return sum + value;
        }, 0);
        storedData[pollId] = pollData;
        savePollStorage(storedData);
        setVote(pollId, optionId);
        renderPolls();
      });
    });
  }

  function renderComments() {
    var container = document.getElementById('commentList');
    if (!container) return;
    var comments = getComments().slice().reverse();
    container.innerHTML = '';
    if (!comments.length) {
      container.innerHTML = '<div class="comment-card text-muted">No comments yet on this device.</div>';
      return;
    }
    comments.forEach(function (comment) {
      var card = document.createElement('div');
      card.className = 'comment-card';
      card.innerHTML =
        '<div class="comment-meta"><span>' +
        escapeHtml(comment.name) +
        '</span><span>' +
        escapeHtml(comment.time) +
        '</span></div>' +
        '<div class="comment-text">' +
        escapeHtml(comment.text) +
        '</div>';
      container.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initializeStorage();
    renderPolls();

    var cform = document.getElementById('commentForm');
    if (cform) {
      cform.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!cform.checkValidity()) {
          cform.classList.add('was-validated');
          return;
        }
        var name = document.getElementById('commentName').value.trim();
        var text = document.getElementById('commentText').value.trim();
        var tag = document.getElementById('commentTag').value.trim();
        var list = getComments();
        list.push({
          name: name + (tag ? ' • ' + tag : ''),
          text: text,
          time: new Date().toLocaleString()
        });
        saveComments(list);
        cform.reset();
        cform.classList.remove('was-validated');
        renderComments();
      });
    }

    renderComments();
  });
})();
