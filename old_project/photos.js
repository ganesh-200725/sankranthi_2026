document.addEventListener("DOMContentLoaded", function () {
  const photosGrid = document.getElementById("photos-grid");
  const publicGallery = document.getElementById('public-gallery');
  const uploadSection = document.getElementById('photo-upload-section');
  const isCommitteeAuthenticated = localStorage.getItem('committeeAuthenticated') === 'true';
  const PHOTO_UPLOADER = 'ganesh';
  const currentUser = localStorage.getItem('committeeUser');
  const isPhotoUploader = currentUser === PHOTO_UPLOADER;
  const API_URL = 'http://localhost:3001/api/photos';

  async function fetchPhotos() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch photos');
      const urls = await res.json();
      return urls;
    } catch (e) {
      photosGrid.innerHTML = `<div style='color:red;text-align:center;'>Failed to load photos from server.</div>`;
      return [];
    }
  }

  async function displayPhotos() {
    photosGrid.innerHTML = '';
    const urls = await fetchPhotos();
    if (urls.length === 0) {
      photosGrid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: rgba(255,255,255,0.6);"><h3>No photos shared yet</h3></div>`;
      return;
    }
    urls.reverse().forEach((url) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      let downloadBtn = '';
      let deleteBtn = '';
      if (isCommitteeAuthenticated) {
        downloadBtn = `<button class=\"btn\" style=\"margin-top:8px;width:100%;\" onclick=\"window.open('http://localhost:3001${url}','_blank')\">Download</button>`;
        if (currentUser === 'ganesh') {
          const filename = url.split('/').pop();
          deleteBtn = `<button class=\"btn\" style=\"margin-top:8px;width:100%;background:#d9534f;\" onclick=\"deletePhoto('${filename}')\">Delete</button>`;
        }
      }
      card.innerHTML = `
        <div style=\"width:100%;aspect-ratio:1/1;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#222;border-radius:8px;position:relative;\">
          <img src=\"http://localhost:3001${url}\" alt=\"Photo\" style=\"width:100%;height:100%;object-fit:cover;object-position:center;display:block;\">
        </div>
        ${downloadBtn}
        ${deleteBtn}
      `;
      photosGrid.appendChild(card);
    });
}

// Add deletePhoto function to window (outside displayPhotos)
window.deletePhoto = async function(filename) {
  if (!confirm('Are you sure you want to delete this photo?')) return;
  try {
    const res = await fetch(`http://localhost:3001/api/photos/${filename}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      alert('Photo deleted successfully.');
      displayPhotos();
    } else if (res.status === 404) {
      alert('Photo not found or already deleted.');
      displayPhotos();
    } else {
      alert('Failed to delete photo: ' + (data.error || 'Unknown error'));
    }
  } catch (e) {
    alert('Failed to delete photo.');
  }
};

  window.uploadPhotos = async function() {
    if (!isCommitteeAuthenticated) {
      alert('You need to be logged in as a committee member to upload photos.');
      return;
    }
    if (!isPhotoUploader) {
      alert('Only the uploader can upload photos.');
      return;
    }
    const files = document.getElementById('photo-upload').files;
    if (files.length === 0) {
      alert('Please select at least one photo.');
      return;
    }
    let successCount = 0;
    let failCount = 0;
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max 20MB.`);
        continue;
      }
      const formData = new FormData();
      formData.append('photo', file);
      try {
        const res = await fetch(API_URL, { method: 'POST', body: formData });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          failCount++;
          alert('Failed to upload photo: ' + file.name + (data.error ? (' (' + data.error + ')') : ''));
        } else {
          successCount++;
        }
      } catch (e) {
        failCount++;
        alert('Failed to upload photo: ' + file.name);
      }
    }
    if (successCount > 0) {
      alert(`Successfully uploaded ${successCount} photo(s).`);
    }
    if (failCount > 0) {
      alert(`Failed to upload ${failCount} photo(s).`);
    }
    displayPhotos();
  };

  // Restrict gallery to committee members only
  if (isCommitteeAuthenticated) {
    publicGallery.style.display = 'block';
    displayPhotos();
    uploadSection.style.display = isPhotoUploader ? 'block' : 'none';
  } else {
    publicGallery.style.display = 'block';
    publicGallery.innerHTML = `<div style="text-align:center;padding:50px;color:rgba(255,255,255,0.8);"><h2 style="color:var(--festival-orange);">🔐 Committee Access Required</h2><p style="font-size:18px;margin:20px 0;">Only committee members can view the photo gallery.</p><p>Please go to the <strong>Committee</strong> section and login with your credentials.</p><button onclick=\"window.location.href='committee.html'\" class=\"btn\" style=\"margin-top:20px;\">Go to Committee Login</button></div>`;
    uploadSection.style.display = 'none';
  }
});