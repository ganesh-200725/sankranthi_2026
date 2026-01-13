document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.getElementById("rangoli-gallery");
  const controls = document.getElementById("rangoli-controls");
  const isCommittee = localStorage.getItem('committeeAuthenticated') === 'true';

  function fetchGallery() {
    fetch("http://localhost:3200/rangoli/gallery")
      .then(res => res.json())
      .then(data => {
        console.log('Rangoli gallery data:', data);
        displayGallery(data.files);
      })
      .catch(() => gallery.innerHTML = '<p>Could not load gallery.</p>');
  }

  // Expecting data.files to be array of { filename, name, id }
  function displayGallery(files) {
    gallery.innerHTML = "";
    if (!files || !files.length) {
      gallery.innerHTML = '<p>No Rangoli images yet.</p>';
      return;
    }
    files.forEach(file => {
      let filename = file.filename || file;
      let name = file.name !== undefined ? file.name : '';
      let id = file.id !== undefined ? file.id : '';
      const card = document.createElement("div");
      card.className = "gallery-card";
      card.innerHTML = `
        <img src="http://localhost:3200/uploads/rangoli/${filename}" alt="Rangoli" class="gallery-img">
        <div class="gallery-info">
          <div style="color:yellow;font-size:1.2em;">TEST VISIBLE</div>
          <div>Participant: <b>${name}</b></div>
          <div>ID: <b>${id}</b></div>
        </div>
        ${isCommittee ? `<button class="delete-btn" data-file="${filename}">Delete</button>` : ''}
      `;
      gallery.appendChild(card);
    });
    if (isCommittee) {
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = function() { deleteImage(this.dataset.file); };
      });
    }
  }

  function deleteImage(filename) {
    if (!confirm('Delete this image?')) return;
    fetch(`http://localhost:3200/rangoli/delete/${filename}`, {
      method: 'DELETE',
      headers: { 'x-committee-auth': 'true' }
    })
      .then(res => res.json())
      .then(() => fetchGallery());
  }

  function setupUpload() {
    if (!isCommittee) return;
    controls.innerHTML = `
      <form id="upload-form">
        <input type="file" name="images" accept="image/*" required>
        <input type="text" name="name" placeholder="Participant Name" required style="margin-left:10px;">
        <input type="text" name="id" placeholder="Participant ID" required style="margin-left:10px;">
        <button type="submit">Upload</button>
      </form>
      <div style="color:#ff6b35;font-size:0.95em;margin-top:4px;">Upload one image at a time for correct name/id display.</div>
    `;
    document.getElementById('upload-form').onsubmit = function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      fetch('http://localhost:3200/rangoli/upload', {
        method: 'POST',
        headers: { 'x-committee-auth': 'true' },
        body: formData
      })
        .then(res => res.json())
        .then(() => fetchGallery());
    };
  }

  setupUpload();
  fetchGallery();
});
