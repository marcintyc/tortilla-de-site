(function () {
  const LS_KEY = 'llb_posts_v1';

  function $(selector, root = document) { return root.querySelector(selector); }
  function $all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

  function loadPosts() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
  }
  function savePosts(posts) {
    localStorage.setItem(LS_KEY, JSON.stringify(posts));
  }

  function toExcerpt(text, max = 150) {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    if (trimmed.length <= max) return trimmed;
    return trimmed.slice(0, max).replace(/[,.;:!?'"\s]+$/,'') + '…';
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    const focusable = modal.querySelector('input, textarea, button, [href], select');
    if (focusable) focusable.focus();
    const onKey = (e) => { if (e.key === 'Escape') closeModal(modal); };
    modal.__escHandler = onKey; document.addEventListener('keydown', onKey);
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (modal.__escHandler) { document.removeEventListener('keydown', modal.__escHandler); modal.__escHandler = null; }
  }

  function renderPosts() {
    const container = $('#postsContainer');
    if (!container) return;
    const posts = loadPosts().sort((a,b) => b.createdAt - a.createdAt);
    container.innerHTML = '';
    if (!posts.length) {
      const empty = document.createElement('div');
      empty.className = 'card';
      empty.innerHTML = '<p>No posts yet. Create your first post!</p>';
      container.appendChild(empty);
      return;
    }
    for (const post of posts) {
      const card = document.createElement('article');
      card.className = 'card card--elevated';

      const imgWrap = document.createElement('div');
      imgWrap.className = 'card__img';
      if (post.imageDataUrl) {
        const img = document.createElement('img');
        img.src = post.imageDataUrl; img.alt = post.title || 'Blog image';
        imgWrap.appendChild(img);
      } else {
        imgWrap.textContent = 'No image';
      }

      const title = document.createElement('h3');
      title.className = 'card__title';
      title.textContent = post.title || 'Untitled';

      const excerpt = document.createElement('p');
      excerpt.className = 'card__excerpt';
      excerpt.textContent = toExcerpt(post.content || '');

      const full = document.createElement('p');
      full.style.display = 'none';
      full.textContent = post.content || '';

      const actions = document.createElement('div');
      actions.className = 'card__actions';
      const readMore = document.createElement('button');
      readMore.className = 'btn btn--link';
      readMore.type = 'button';
      readMore.textContent = 'Read More';
      readMore.addEventListener('click', () => {
        const isExpanded = full.style.display === 'block';
        full.style.display = isExpanded ? 'none' : 'block';
        readMore.textContent = isExpanded ? 'Read More' : 'Show Less';
      });
      actions.appendChild(readMore);

      card.appendChild(imgWrap);
      card.appendChild(title);
      card.appendChild(excerpt);
      card.appendChild(full);
      card.appendChild(actions);
      container.appendChild(card);
    }
  }

  function wireBlogPage() {
    const createBtn = $('#createPostBtn');
    const modal = $('#postModal');
    if (!createBtn || !modal) return;

    const closeBtn = $('#closeModalBtn');
    const cancelBtn = $('#cancelPostBtn');
    const form = $('#postForm');

    createBtn.addEventListener('click', () => openModal(modal));
    $('[data-close-modal]')?.addEventListener('click', () => closeModal(modal));
    closeBtn?.addEventListener('click', () => closeModal(modal));
    cancelBtn?.addEventListener('click', () => closeModal(modal));

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = $('#postTitle').value.trim();
      const content = $('#postContent').value.trim();
      const fileInput = $('#postImage');
      if (!title || !content) {
        alert('Please provide a title and content.');
        return;
      }
      let imageDataUrl = null;
      const file = fileInput?.files?.[0];
      if (file) {
        imageDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        }).catch(() => null);
      }
      const posts = loadPosts();
      posts.push({ id: Date.now(), title, content, imageDataUrl, createdAt: Date.now() });
      savePosts(posts);
      form.reset();
      closeModal(modal);
      renderPosts();
      alert('Post published!');
    });

    renderPosts();
  }

  function wireContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#name').value.trim();
      const email = $('#email').value.trim();
      const message = $('#message').value.trim();
      if (!name || !email || !message) { alert('Please fill in all fields.'); return; }
      console.log('Contact form submitted', { name, email, message });
      alert('Thanks! Your message has been sent.');
      form.reset();
    });
  }

  function wireNavToggle() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireNavToggle();
    wireBlogPage();
    wireContactForm();
  });
})();

