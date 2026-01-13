// Clean Photos.js - Working Version
console.log("🚀 Clean photos.js loaded successfully!");

// Update status
const jsStatus = document.getElementById('js-status');
if (jsStatus) {
  jsStatus.textContent = 'Photos.js loaded! 📸';
  jsStatus.style.color = 'lightblue';
}

// Update debug info
const debugInfo = document.getElementById('debug-info');
if (debugInfo) {
  debugInfo.innerHTML = `
    <strong>Working Mode:</strong><br>
    JavaScript: ✅ Working<br>
    Photos.js: ✅ Loaded<br>
    Status: Ready for use<br>
    <button onclick="location.reload()">Reload</button>
  `;
}

// Hide loading indicator
const loadingIndicator = document.getElementById('loading-indicator');
if (loadingIndicator) {
  loadingIndicator.style.display = 'none';
  console.log("✅ Loading indicator hidden");
}

// Check authentication
const isAuthenticated = localStorage.getItem('committeeAuthenticated') === 'true';
const isPhotoUploader = localStorage.getItem('committeeUser') === 'ganesh';

console.log('Auth status:', { isAuthenticated, isPhotoUploader });

// Show appropriate content
const publicGallery = document.getElementById('public-gallery');
const uploadSection = document.getElementById('photo-upload-section');

if (publicGallery) {
  publicGallery.style.display = 'block';

  if (isAuthenticated) {
    // Show gallery for authenticated users
    publicGallery.innerHTML = `
      <h2 style="text-align: center; color: var(--festival-yellow); margin-bottom: 20px;">Festival Photo Gallery</h2>
      <div id="photos-grid" class="photos-grid">
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: rgba(255, 255, 255, 0.6);">
          <h3>Welcome back, ${localStorage.getItem('committeeUser') || 'Committee Member'}!</h3>
          <p>Photo gallery is ready. ${isPhotoUploader ? 'You can upload photos using the form above.' : 'You can view all photos.'}</p>
        </div>
      </div>
    `;

    // Show upload form for photo uploader
    if (isPhotoUploader && uploadSection) {
      uploadSection.style.display = 'block';
    } else if (uploadSection) {
      uploadSection.style.display = 'block';
      uploadSection.innerHTML = `
        <h2>Photo Access</h2>
        <div style="text-align: center; padding: 30px; background: rgba(255, 255, 255, 0.1); border-radius: 12px;">
          <h3 style="color: var(--festival-orange);">📷 View Only Access</h3>
          <p>You can view all festival photos, but only Ganesh can upload new photos.</p>
          <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6);">
            Logged in as: ${localStorage.getItem('committeeUser') || 'Committee Member'}
          </p>
        </div>
      `;
    }
  } else {
    // Show login prompt for non-authenticated users
    publicGallery.innerHTML = `
      <div style="text-align: center; padding: 50px; color: rgba(255, 255, 255, 0.8);">
        <h2 style="color: var(--festival-orange);">🔐 Committee Access Required</h2>
        <p style="font-size: 18px; margin: 20px 0;">To view and upload festival photos, you need to be logged in as a committee member.</p>
        <p>Please go to the <strong>Committee</strong> section and login with:</p>
        <p style="background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
          <strong>Username:</strong> ganesh<br>
          <strong>Password:</strong> harivirat
        </p>
        <button onclick="window.location.href='committee.html'" class="btn" style="margin-top: 20px;">Go to Committee Login</button>
      </div>
    `;

    if (uploadSection) {
      uploadSection.style.display = 'none';
    }
  }
}

console.log("🎉 Photos page initialization completed!");