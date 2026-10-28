
// =========================================================
// INTERLUDE AU — SCRIPT.JS
// FUNGSI: Menghidupkan jam, unlock, passcode, dan navigasi app.
// UBAH: Passcode serta isi aplikasi bisa diatur di sini.
// JANGAN HAPUS: ID dan class harus cocok dengan index.html.
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Interlude AU is ready!");

  // ---------- 1. PENGATURAN DASAR ----------

  // UBAH: Ganti kode ini sesuai keinginanmu.
  const CORRECT_PASSCODE = "2603";

  const phone = document.getElementById("phone");
  const statusTime = document.getElementById("status-time");
  const lockDate = document.getElementById("lock-date");
  const lockTime = document.getElementById("lock-time");
  const homeDate = document.getElementById("home-date");

  const lockScreen = document.getElementById("lock-screen");
  const passcodeScreen = document.getElementById("passcode-screen");
  const homeScreen = document.getElementById("home-screen");
  const appScreen = document.getElementById("app-screen");

  const unlockButton = document.getElementById("unlock-button");
  const passcodeDots = document.getElementById("passcode-dots");
  const passcodeError = document.getElementById("passcode-error");
  const passcodeKeypad = document.getElementById("passcode-keypad");
  const passcodeDelete = document.getElementById("passcode-delete");
  const passcodeCancel = document.getElementById("passcode-cancel");

  const appBackButton = document.getElementById("app-back-button");
  const appTitle = document.getElementById("app-title");
  const appContent = document.getElementById("app-content");
  const appMenuButton = document.getElementById("app-menu-button");

  const flashlightButton = document.getElementById("flashlight-button");
  const cameraButton = document.getElementById("camera-button");

  // Berhenti jika struktur HTML utama belum lengkap.
  if (
    !phone ||
    !statusTime ||
    !lockScreen ||
    !passcodeScreen ||
    !homeScreen ||
    !appScreen
  ) {
    console.error(
      "Ada elemen HTML yang belum ditemukan. Periksa index.html."
    );
    return;
  }

  // ---------- 2. JAM DAN TANGGAL ----------

  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const timeFormatter = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  function updateClock() {
    const now = new Date();
    const time = timeFormatter.format(now);

    statusTime.textContent = time;

    if (lockTime) {
      lockTime.textContent = time;
    }

    if (lockDate) {
      lockDate.textContent = dateFormatter.format(now);
    }

    if (homeDate) {
      homeDate.textContent = dateFormatter.format(now);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ---------- 3. PINDAH LAYAR ----------

  const screens = [
    lockScreen,
    passcodeScreen,
    homeScreen,
    appScreen
  ];

  function showScreen(targetScreen) {
    screens.forEach((screen) => {
      screen.hidden = screen !== targetScreen;
    });
  }

  // Saat halaman dimuat, mulai dari lock screen.
  showScreen(lockScreen);

  // ---------- 4. UNLOCK DAN PASSCODE ----------

  let enteredPasscode = "";
  const PASSCODE_LENGTH = 4;

  function updatePasscodeDots() {
    if (!passcodeDots) return;

    const dots = passcodeDots.querySelectorAll(".passcode-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle(
        "filled",
        index < enteredPasscode.length
      );
    });
  }

  function resetPasscode() {
    enteredPasscode = "";
    updatePasscodeDots();

    if (passcodeError) {
      passcodeError.textContent = "";
    }
  }

  function unlockPhone() {
    resetPasscode();
    showScreen(homeScreen);
  }

  if (unlockButton) {
    unlockButton.addEventListener("click", () => {
      resetPasscode();
      showScreen(passcodeScreen);
    });
  }

  if (passcodeKeypad) {
    passcodeKeypad.addEventListener("click", (event) => {
      const key = event.target.closest("[data-digit]");

      if (!key || enteredPasscode.length >= PASSCODE_LENGTH) {
        return;
      }

      const digit = key.dataset.digit;

      if (!/^\d$/.test(digit)) {
        return;
      }

      enteredPasscode += digit;
      updatePasscodeDots();

      if (enteredPasscode.length === PASSCODE_LENGTH) {
        if (enteredPasscode === CORRECT_PASSCODE) {
          if (passcodeError) {
            passcodeError.textContent = "";
          }

          setTimeout(unlockPhone, 180);
        } else {
          if (passcodeError) {
            passcodeError.textContent =
              "Kode salah. Coba lagi.";
          }

          setTimeout(resetPasscode, 650);
        }
      }
    });
  }

  if (passcodeDelete) {
    passcodeDelete.addEventListener("click", () => {
      enteredPasscode = enteredPasscode.slice(0, -1);
      updatePasscodeDots();

      if (passcodeError) {
        passcodeError.textContent = "";
      }
    });
  }

  if (passcodeCancel) {
    passcodeCancel.addEventListener("click", () => {
      resetPasscode();
      showScreen(lockScreen);
    });
  }

  // ---------- 5. DAFTAR APLIKASI ----------

  // UBAH: Nama dan isi awal aplikasi bisa diedit di sini.
  // Konten ini masih placeholder; nanti kita sambungkan
  // dengan cerita AU dan file JSON mingguan.

  const apps = {
    messages: {
      title: "Messages",
      description: "Pesan Shaqil dan Panji akan muncul di sini."
    },
    instagram: {
      title: "Instagram",
      description: "Feed, story, dan profil akan dibuat di sini."
    },
    photos: {
      title: "Photos",
      description: "Album foto dan gambar karakter akan muncul di sini."
    },
    notes: {
      title: "Notes",
      description: "Catatan pribadi Shaqil akan muncul di sini."
    },
    safari: {
      title: "Safari",
      description: "Browser fiksi untuk kebutuhan cerita AU."
    },
    phone: {
      title: "Phone",
      description: "Riwayat panggilan dan keypad telepon."
    },
    contacts: {
      title: "Contacts",
      description: "Daftar kontak karakter AU."
    },
    calendar: {
      title: "Calendar",
      description: "Jadwal dan tanggal penting cerita AU."
    },
    files: {
      title: "Files",
      description: "Dokumen dan file milik karakter."
    },
    settings: {
      title: "Settings",
      description: "Pengaturan simulator Interlude AU."
    }
  };

  let currentApp = null;

  function openApp(appName) {
    const app = apps[appName];

    if (!app) {
      console.warn("Aplikasi tidak ditemukan:", appName);
      return;
    }

    currentApp = appName;

    if (appTitle) {
      appTitle.textContent = app.title;
    }

    if (appContent) {
      appContent.replaceChildren();

      const message = document.createElement("p");
      message.className = "app-placeholder";
      message.textContent = app.description;

      appContent.appendChild(message);
    }

    showScreen(appScreen);
  }

  // Semua ikon aplikasi pada home screen.
  document.querySelectorAll("[data-app]").forEach((button) => {
    button.addEventListener("click", () => {
      openApp(button.dataset.app);
    });
  });

  // ---------- 6. TOMBOL KEMBALI ----------

  function goHome() {
    currentApp = null;
    showScreen(homeScreen);
  }

  if (appBackButton) {
    appBackButton.addEventListener("click", goHome);
  }

  // ---------- 7. TOMBOL MENU ----------

  if (appMenuButton) {
    appMenuButton.addEventListener("click", () => {
      if (!currentApp) return;

      // Placeholder sementara; menu tiap aplikasi
      // akan ditambahkan saat fungsi aplikasinya dibuat.
      console.log("Menu aplikasi:", currentApp);
    });
  }

  // ---------- 8. TOMBOL LOCK SCREEN ----------

  if (flashlightButton) {
    flashlightButton.addEventListener("click", () => {
      // Browser tidak dapat menyalakan lampu flash HP
      // secara bebas. Ini hanya respons visual sementara.
      flashlightButton.textContent =
        flashlightButton.textContent === "🔦" ? "✦" : "🔦";
    });
  }

  if (cameraButton) {
    cameraButton.addEventListener("click", () => {
      // Kamera asli belum diaktifkan.
      // Nanti bisa dibuat sebagai aplikasi kamera simulasi.
      resetPasscode();
      showScreen(passcodeScreen);
    });
  }

  // ---------- 9. TOMBOL ESCAPE UNTUK PENGUJIAN ----------

  // FUNGSI: Memudahkan pengujian memakai keyboard.
  // Di HP, navigasi utama tetap menggunakan tombol layar.

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!appScreen.hidden) {
        goHome();
      } else if (!passcodeScreen.hidden) {
        resetPasscode();
        showScreen(lockScreen);
      }
    }
  });

  console.log("Semua fungsi dasar Interlude AU siap.");
});

