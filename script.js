(function() {
  const routes = ["offer", "blog", "about", "contact"];

  document.addEventListener("DOMContentLoaded", () => {
    setCurrentYear();
    setupNav();
    setupRouting();
    setupBlog();
    setupContact();
  });

  function setCurrentYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function setupNav() {
    const nav = document.getElementById("primary-nav");
    const toggle = document.querySelector(".nav-toggle");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        nav.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-route]").forEach(link => {
      if (link.tagName === "A") {
        link.addEventListener("click", () => {
          if (nav) nav.classList.remove("open");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  function setupRouting() {
    function showRoute(route) {
      const target = routes.includes(route) ? route : "offer";
      document.querySelectorAll("section[data-route]").forEach(sec => {
        const shouldShow = sec.getAttribute("data-route") === target;
        if (shouldShow) {
          sec.removeAttribute("hidden");
        } else {
          sec.setAttribute("hidden", "true");
        }
      });
      document.querySelectorAll(".nav-link").forEach(a => {
        const isActive = a.getAttribute("data-route") === target;
        a.classList.toggle("active", isActive);
      });
      if (location.hash !== `#${target}`) {
        history.replaceState(null, "", `#${target}`);
      }
      const titles = {
        offer: "Oferta",
        blog: "Blog",
        about: "O mnie",
        contact: "Kontakt"
      };
      document.title = `${titles[target]} — Lekcje hiszpańskiego`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function getRouteFromHash() {
      const hash = location.hash.replace("#", "");
      return routes.includes(hash) ? hash : "offer";
    }

    window.addEventListener("hashchange", () => showRoute(getRouteFromHash()));
    showRoute(getRouteFromHash());
  }

  function setupBlog() {
    const form = document.getElementById("postForm");
    const titleInput = document.getElementById("postTitle");
    const contentInput = document.getElementById("postContent");
    const idInput = document.getElementById("postId");
    const editHint = document.getElementById("editHint");
    const postsList = document.getElementById("postsList");
    const searchInput = document.getElementById("searchInput");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const resetFormBtn = document.getElementById("resetFormBtn");

    if (!form || !titleInput || !contentInput || !postsList) return;

    function getPosts() {
      try {
        const raw = localStorage.getItem("blogPosts");
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }

    function savePosts(posts) {
      localStorage.setItem("blogPosts", JSON.stringify(posts));
    }

    function generateId() {
      return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    function resetForm(keepSearch = true) {
      form.reset();
      idInput.value = "";
      if (editHint) editHint.hidden = true;
      titleInput.focus();
      if (!keepSearch && searchInput) searchInput.value = "";
    }

    function renderPosts() {
      const posts = getPosts();
      const query = (searchInput && searchInput.value.trim().toLowerCase()) || "";
      const filtered = query
        ? posts.filter(p => p.title.toLowerCase().includes(query))
        : posts;

      if (filtered.length === 0) {
        postsList.innerHTML = `<div class="card"><p>Brak wpisów. Dodaj pierwszy wpis powyżej.</p></div>`;
        return;
      }

      const html = filtered
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(p => {
          const date = new Date(p.createdAt).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
          const preview = (p.content || "").trim().slice(0, 220);
          return `
            <article class="post" data-id="${p.id}">
              <h3 class="post-title">${escapeHtml(p.title)}</h3>
              <div class="post-meta">${date}</div>
              <p>${escapeHtml(preview)}${p.content.length > 220 ? "…" : ""}</p>
              <div class="post-actions">
                <button class="btn secondary" data-action="edit">Edytuj</button>
                <button class="btn danger" data-action="delete">Usuń</button>
              </div>
            </article>`;
        })
        .join("");
      postsList.innerHTML = html;
    }

    function escapeHtml(str) {
      return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title || !content) return;

      const posts = getPosts();
      const editingId = idInput.value.trim();
      if (editingId) {
        const idx = posts.findIndex(p => p.id === editingId);
        if (idx !== -1) {
          posts[idx] = { ...posts[idx], title, content };
          savePosts(posts);
        }
      } else {
        posts.push({ id: generateId(), title, content, createdAt: Date.now() });
        savePosts(posts);
      }

      resetForm();
      renderPosts();
    });

    postsList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const article = target.closest(".post");
      if (!article) return;
      const id = article.getAttribute("data-id");
      if (!id) return;

      const action = target.getAttribute("data-action");
      if (action === "edit") {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (!post) return;
        idInput.value = post.id;
        titleInput.value = post.title;
        contentInput.value = post.content;
        if (editHint) editHint.hidden = false;
        titleInput.focus();
      }
      if (action === "delete") {
        const posts = getPosts();
        const updated = posts.filter(p => p.id !== id);
        savePosts(updated);
        renderPosts();
      }
    });

    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        const posts = getPosts();
        if (posts.length === 0) return;
        const sure = confirm("Na pewno usunąć wszystkie wpisy?");
        if (!sure) return;
        savePosts([]);
        renderPosts();
      });
    }

    if (resetFormBtn) {
      resetFormBtn.addEventListener("click", () => resetForm(false));
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => renderPosts());
    }

    renderPosts();
  }

  function setupContact() {
    const form = document.getElementById("contactForm");
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const messageInput = document.getElementById("contactMessage");
    const emailLink = document.getElementById("contactEmailLink");
    const copyEmailBtn = document.getElementById("copyEmailBtn");

    if (form && nameInput && emailInput && messageInput && emailLink) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const to = (emailLink.textContent || "").trim();
        const subject = `Zapytanie ze strony — ${nameInput.value.trim() || "(bez imienia)"}`;
        const body = [
          `Imię: ${nameInput.value.trim()}`,
          `E-mail: ${emailInput.value.trim()}`,
          "",
          messageInput.value.trim()
        ].join("\n");
        const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = href;
      });
    }

    if (copyEmailBtn && emailLink) {
      copyEmailBtn.addEventListener("click", async () => {
        const to = (emailLink.textContent || "").trim();
        try {
          await navigator.clipboard.writeText(to);
          const original = copyEmailBtn.textContent;
          copyEmailBtn.textContent = "Skopiowano!";
          setTimeout(() => (copyEmailBtn.textContent = original), 1200);
        } catch (_) {}
      });
    }
  }
})();