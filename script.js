(function() {
  "use strict";

  // Użyteczne odwołania
  const doc = document;

  // Ustawienia globalne
  const STORAGE_KEYS = {
    posts: "blogPosts",
    profilePhoto: "profilePhotoDataUrl"
  };

  // Header / nav
  const header = doc.querySelector(".site-header");
  const navToggle = doc.querySelector(".nav-toggle");
  const nav = doc.querySelector(".site-nav");
  if (navToggle && header && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement && header.classList.contains("open")) {
        header.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth scroll dla linków nawigacji
  doc.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (!href) return;
      const target = doc.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.pushState(null, "", href);
      }
    });
  });

  // Rok w stopce
  const yearEl = doc.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Sekcja O mnie – zdjęcie
  const addPhotoBtn = doc.getElementById("addPhotoBtn");
  const removePhotoBtn = doc.getElementById("removePhotoBtn");
  const photoInput = doc.getElementById("photoInput");
  const profilePhoto = doc.getElementById("profilePhoto");

  function restoreProfilePhoto() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.profilePhoto);
      if (saved && profilePhoto instanceof HTMLImageElement) {
        profilePhoto.src = saved;
      }
    } catch (_) {}
  }

  if (addPhotoBtn && photoInput && profilePhoto) {
    addPhotoBtn.addEventListener("click", () => photoInput.click());
    photoInput.addEventListener("change", (e) => {
      const input = e.currentTarget;
      if (!(input instanceof HTMLInputElement) || !input.files || input.files.length === 0) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        if (typeof dataUrl === "string" && profilePhoto instanceof HTMLImageElement) {
          profilePhoto.src = dataUrl;
          try { localStorage.setItem(STORAGE_KEYS.profilePhoto, dataUrl); } catch (_) {}
        }
      };
      reader.readAsDataURL(file);
    });
  }
  if (removePhotoBtn && profilePhoto) {
    removePhotoBtn.addEventListener("click", () => {
      if (profilePhoto instanceof HTMLImageElement) {
        profilePhoto.removeAttribute("src");
        try { localStorage.removeItem(STORAGE_KEYS.profilePhoto); } catch (_) {}
      }
    });
  }
  restoreProfilePhoto();

  // Blog – storage utils
  function loadPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.posts);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (_) {
      return [];
    }
  }

  function savePosts(posts) {
    try {
      localStorage.setItem(STORAGE_KEYS.posts, JSON.stringify(posts));
    } catch (_) {}
  }

  function formatDate(ts) {
    try {
      return new Date(ts).toLocaleString("pl-PL", {
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (_) {
      return "";
    }
  }

  // Blog – UI
  const postForm = doc.getElementById("postForm");
  const postIdEl = doc.getElementById("postId");
  const postTitleEl = doc.getElementById("postTitle");
  const postContentEl = doc.getElementById("postContent");
  const cancelEditBtn = doc.getElementById("cancelEditBtn");
  const postsList = doc.getElementById("postsList");

  function clearForm() {
    if (postIdEl instanceof HTMLInputElement) postIdEl.value = "";
    if (postTitleEl instanceof HTMLInputElement) postTitleEl.value = "";
    if (postContentEl instanceof HTMLTextAreaElement) postContentEl.value = "";
    if (cancelEditBtn instanceof HTMLButtonElement) cancelEditBtn.hidden = true;
    const saveBtn = doc.getElementById("savePostBtn");
    if (saveBtn) saveBtn.textContent = "Zapisz wpis";
  }

  function renderPosts() {
    if (!(postsList instanceof HTMLUListElement)) return;
    const posts = loadPosts().sort((a, b) => b.createdAt - a.createdAt);
    postsList.innerHTML = "";
    posts.forEach((post) => {
      const li = doc.createElement("li");
      li.className = "post-item";

      const head = doc.createElement("div");
      head.className = "post-head";

      const title = doc.createElement("h3");
      title.className = "post-title";
      title.textContent = String(post.title || "Bez tytułu");

      const date = doc.createElement("div");
      date.className = "post-date";
      date.textContent = formatDate(post.createdAt);

      head.appendChild(title);
      head.appendChild(date);

      const content = doc.createElement("div");
      content.className = "post-content";
      content.textContent = String(post.content || "");

      const actions = doc.createElement("div");
      actions.className = "post-actions";
      const editBtn = doc.createElement("button");
      editBtn.className = "btn btn-secondary";
      editBtn.type = "button";
      editBtn.textContent = "Edytuj";
      editBtn.addEventListener("click", () => editPost(post.id));

      const delBtn = doc.createElement("button");
      delBtn.className = "btn btn-ghost";
      delBtn.type = "button";
      delBtn.textContent = "Usuń";
      delBtn.addEventListener("click", () => deletePost(post.id));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      li.appendChild(head);
      li.appendChild(content);
      li.appendChild(actions);

      postsList.appendChild(li);
    });
  }

  function editPost(id) {
    const posts = loadPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (postIdEl instanceof HTMLInputElement) postIdEl.value = String(post.id);
    if (postTitleEl instanceof HTMLInputElement) postTitleEl.value = String(post.title || "");
    if (postContentEl instanceof HTMLTextAreaElement) postContentEl.value = String(post.content || "");
    if (cancelEditBtn instanceof HTMLButtonElement) cancelEditBtn.hidden = false;
    const saveBtn = doc.getElementById("savePostBtn");
    if (saveBtn) saveBtn.textContent = "Zaktualizuj wpis";
    postTitleEl?.focus();
  }

  function deletePost(id) {
    if (!confirm("Usunąć ten wpis?")) return;
    const posts = loadPosts().filter((p) => p.id !== id);
    savePosts(posts);
    renderPosts();
  }

  function upsertPost(e) {
    e.preventDefault();
    const title = postTitleEl instanceof HTMLInputElement ? postTitleEl.value.trim() : "";
    const content = postContentEl instanceof HTMLTextAreaElement ? postContentEl.value.trim() : "";
    if (!title || !content) return;

    const posts = loadPosts();
    const id = postIdEl instanceof HTMLInputElement ? postIdEl.value : "";
    if (id) {
      const idx = posts.findIndex((p) => String(p.id) === String(id));
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], title, content };
      }
    } else {
      posts.push({ id: Date.now(), title, content, createdAt: Date.now() });
    }
    savePosts(posts);
    clearForm();
    renderPosts();
  }

  if (postForm) postForm.addEventListener("submit", upsertPost);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", clearForm);

  // Seed przykładowych wpisów przy pierwszym uruchomieniu
  (function seedIfEmpty() {
    const existing = loadPosts();
    if (existing.length > 0) return;
    const seed = [
      {
        id: Date.now() - 2,
        title: "Witaj na blogu!",
        content: "Tu będę dzielić się wskazówkami do nauki hiszpańskiego. Zapisuj swoje notatki i wracaj do nich kiedy chcesz.",
        createdAt: Date.now() - 2
      },
      {
        id: Date.now() - 1,
        title: "Jak zacząć?",
        content: "Ustal cel (np. podróże), 15–20 min dziennie, krótkie dialogi i powtórki. ¡Vamos!",
        createdAt: Date.now() - 1
      }
    ];
    savePosts(seed);
  })();

  renderPosts();

  // Formularz kontaktowy – mailto
  const contactForm = doc.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (doc.getElementById("name")).value || "";
      const from = (doc.getElementById("email")).value || "";
      const message = (doc.getElementById("message")).value || "";
      const toAnchor = doc.getElementById("contactEmail");
      const to = toAnchor instanceof HTMLAnchorElement && toAnchor.href.startsWith("mailto:") ? toAnchor.href.replace("mailto:", "") : "twoj.email@przyklad.pl";

      const subject = encodeURIComponent(`Zapytanie ze strony – ${name}`);
      const body = encodeURIComponent(`Imię: ${name}\nE-mail: ${from}\n\n${message}`);
      const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;

      // Spróbuj otworzyć klienta poczty
      window.location.href = mailtoUrl;
    });
  }
})();

