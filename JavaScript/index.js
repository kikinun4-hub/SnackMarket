
// ==================================
// DATA KERANJANG
// ==================================

let keranjang = [];


// ==================================
// MENJALANKAN SETELAH HTML DIMUAT
// ==================================

document.addEventListener("DOMContentLoaded", function () {

    // Mengambil data keranjang
    try {
        keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    } catch (error) {
        keranjang = [];
    }

    // Menjalankan pencarian saat mengetik
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", cariProduk);
    }

    // Menjalankan filter kategori
    const filterKategori = document.getElementById("filterKategori");

    if (filterKategori) {
        filterKategori.addEventListener("change", cariProduk);
    }

    // Menjalankan pengurutan harga
    const urutHarga = document.getElementById("urutHarga");

    if (urutHarga) {
        urutHarga.addEventListener("change", urutkanProduk);
    }

    // Menghubungkan semua tombol keranjang
    document.addEventListener("click", function (event) {

        const tombol = event.target.closest(".tambah-keranjang");

        if (!tombol) return;

        tambahKeranjang(
            tombol.dataset.id,
            tombol.dataset.nama,
            tombol.dataset.harga,
            tombol.dataset.gambar
        );

    });

    // Menghubungkan kartu kategori
    document.querySelectorAll(".kategori-card").forEach(function (kartu) {

        kartu.addEventListener("click", function () {

            const kategori = this.dataset.kategori;
            const pilihanKategori = document.getElementById("filterKategori");

            if (!pilihanKategori || !kategori) return;

            pilihanKategori.value = kategori;
            cariProduk();

        });

    });

    perbaruiJumlahKeranjang();
    cariProduk();

});


// ==================================
// PENCARIAN DAN FILTER PRODUK
// ==================================

function cariProduk() {

    const input = document.getElementById("searchInput");
    const pilihanKategori = document.getElementById("filterKategori");

    const kataKunci = input ? input.value.toLowerCase().trim() : "";
    const kategori = pilihanKategori ? pilihanKategori.value : "semua";

    const daftarProduk = document.querySelectorAll(".produk-card");

    let jumlahDitemukan = 0;

    daftarProduk.forEach(function (produk) {

        const nama = (produk.dataset.nama || "").toLowerCase();
        const kategoriProduk = produk.dataset.kategori || "";

        const cocokNama = nama.includes(kataKunci);

        const cocokKategori =
            kategori === "semua" || kategoriProduk === kategori;

        if (cocokNama && cocokKategori) {
            produk.style.display = "";
            jumlahDitemukan++;
        } else {
            produk.style.display = "none";
        }

    });

    const pesanKosong = document.getElementById("pesanKosong");

    if (pesanKosong) {
        pesanKosong.style.display =
            jumlahDitemukan === 0 ? "block" : "none";
    }

}


// ==================================
// MENGURUTKAN HARGA PRODUK
// ==================================

function urutkanProduk() {

    const daftar = document.getElementById("produkList");
    const pilihan = document.getElementById("urutHarga");

    if (!daftar || !pilihan) return;

    const produk = Array.from(
        daftar.querySelectorAll(".produk-card")
    );

    produk.sort(function (a, b) {

        const hargaA = Number(a.dataset.harga);
        const hargaB = Number(b.dataset.harga);

        if (pilihan.value === "termurah") {
            return hargaA - hargaB;
        }

        if (pilihan.value === "termahal") {
            return hargaB - hargaA;
        }

        return a.dataset.id.localeCompare(b.dataset.id);

    });

    produk.forEach(function (item) {
        daftar.appendChild(item);
    });

    cariProduk();

}


// ==================================
// TAMBAH PRODUK KE KERANJANG
// ==================================

function tambahKeranjang(id, nama, harga, gambar) {

    if (!id || !nama || !harga) {
        alert("Data produk belum lengkap!");
        return;
    }

    const produkAda = keranjang.find(function (produk) {
        return produk.id === id;
    });

    if (produkAda) {

        produkAda.jumlah++;

    } else {

        keranjang.push({
            id: id,
            nama: nama,
            harga: Number(harga),
            gambar: gambar,
            jumlah: 1
        });

    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    perbaruiJumlahKeranjang();

    alert(nama + " berhasil ditambahkan ke keranjang!");

}


// ==================================
// MEMPERBARUI JUMLAH KERANJANG
// ==================================

function perbaruiJumlahKeranjang() {

    const jumlah = keranjang.reduce(function (total, produk) {
        return total + Number(produk.jumlah || 0);
    }, 0);

    const tampilanJumlah = document.getElementById("jumlahKeranjang");

    if (tampilanJumlah) {
        tampilanJumlah.textContent = jumlah;
    }

}


// ==================================
// MEMBUAT FUNGSI BISA DIAKSES HTML
// ==================================

window.cariProduk = cariProduk;
window.urutkanProduk = urutkanProduk;
window.tambahKeranjang = tambahKeranjang;



/* =====================================
   HALAMAN KERANJANG SNACKMARKET
===================================== */

// Mengambil data keranjang
function ambilDataKeranjang() {
    return JSON.parse(localStorage.getItem("keranjang")) || [];
}


// Format harga Rupiah
function formatRupiah(nilai) {
    return "Rp" + Number(nilai).toLocaleString("id-ID");
}


// Menampilkan isi keranjang
function tampilkanKeranjang() {

    const daftar = document.getElementById("daftarKeranjang");

    if (!daftar) return;

    const keranjang = ambilDataKeranjang();

    daftar.innerHTML = "";

    let subtotal = 0;
    let totalItem = 0;

    if (keranjang.length === 0) {

        daftar.innerHTML = `
            <div class="keranjang-kosong">
                <h3>Keranjang Kamu Masih Kosong</h3>
                <p>Silakan pilih produk favorit kamu terlebih dahulu.</p>
                <a href="../index.html" class="btn-kosong">
                    Mulai Belanja
                </a>
            </div>
        `;

    } else {

        keranjang.forEach((produk, index) => {

            const harga = Number(produk.harga) || 0;
            const jumlah = Number(produk.jumlah || produk.qty) || 1;
            const totalProduk = harga * jumlah;

            subtotal += totalProduk;
            totalItem += jumlah;

        let gambar = produk.gambar || "../image/produk.png";

        // Pastikan alamat gambar mengarah ke folder image utama
        if (gambar.startsWith("../")) {
            gambar = gambar;
        } else {
            gambar = "../" + gambar;
        }

            daftar.innerHTML += `
                <div class="item-keranjang">

                    <img src="${gambar}"
                         alt="${produk.nama || "Produk SnackMarket"}"
                         onerror="this.onerror=null; this.src='../image/produk.png'"

                    <div class="info-produk">
                        <h3>${produk.nama || "Produk SnackMarket"}</h3>

                        <p class="harga-produk">
                            ${formatRupiah(harga)}
                        </p>

                        <div class="kontrol-produk">

                            <button onclick="ubahJumlah('${produk.id}', -1)">
                                -
                            </button>

                            <span>${jumlah}</span>

                            <button onclick="ubahJumlah('${produk.id}', 1)">
                                +
                            </button>

                        </div>
                    </div>

                    <div class="aksi-produk">

                        <span class="subtotal-produk">
                            ${formatRupiah(totalProduk)}
                        </span>

                        <button class="btn-hapus"
                                onclick="hapusProduk('${produk.id}')">
                            Hapus
                        </button>

                    </div>

                </div>
            `;
        });

    }

    // Ongkos kirim sementara
    const ongkir = keranjang.length > 0 ? 10000 : 0;

    const total = subtotal + ongkir;

    document.getElementById("totalItem").textContent =
        totalItem + " item";

    document.getElementById("subtotal").textContent =
        formatRupiah(subtotal);

    document.getElementById("ongkir").textContent =
        formatRupiah(ongkir);

    document.getElementById("totalPembayaran").textContent =
        formatRupiah(total);

    // Memperbarui jumlah pada header
    const jumlahKeranjang =
        document.getElementById("jumlahKeranjang");

    if (jumlahKeranjang) {
        jumlahKeranjang.textContent = totalItem;
    }
}


// Menambah atau mengurangi jumlah produk
function ubahJumlah(id, perubahan) {

    let keranjang = ambilDataKeranjang();

    const index = keranjang.findIndex(
        produk => String(produk.id) === String(id)
    );

    if (index === -1) return;

    let jumlah = Number(
        keranjang[index].jumlah || keranjang[index].qty
    ) || 1;

    jumlah += perubahan;

    if (jumlah <= 0) {
        keranjang.splice(index, 1);
    } else {
        keranjang[index].jumlah = jumlah;
        delete keranjang[index].qty;
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    tampilkanKeranjang();
}


// Menghapus produk
function hapusProduk(id) {

    let keranjang = ambilDataKeranjang();

    keranjang = keranjang.filter(
        produk => String(produk.id) !== String(id)
    );

    localStorage.setItem("keranjang", JSON.stringify(keranjang));

    tampilkanKeranjang();
}


// Tombol checkout sementara
function prosesCheckout() {

    const keranjang = ambilDataKeranjang();

    if (keranjang.length === 0) {
        alert("Keranjang kamu masih kosong!");
        return;
    }

    alert("Keranjang berhasil diperiksa. Selanjutnya kita akan membuat halaman pemesanan.");
}


// Menjalankan halaman keranjang
document.addEventListener("DOMContentLoaded", function () {

    tampilkanKeranjang();

    const tombolCheckout = document.getElementById("btnCheckout");

    if (tombolCheckout) {
        tombolCheckout.addEventListener("click", prosesCheckout);
    }

});



/* ==========================================
   CHECKOUT SNACKMARKET
========================================== */








document.addEventListener("DOMContentLoaded", function () {

    const daftarPesanan = document.getElementById("ringkasanPesanan");

    // Memastikan halaman yang dibuka adalah checkout
    if (!daftarPesanan) {
        return;
    }

    // Mengambil data keranjang
    let dataKeranjang = [];

    try {
        dataKeranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
    } catch (error) {
        dataKeranjang = [];
    }

    const subtotalElement = document.getElementById("subtotal");
    const ongkirElement = document.getElementById("ongkir");
    const totalElement = document.getElementById("totalPembayaran");

    const ongkir = 10000;

    // Format Rupiah
    function rupiahCheckout(angka) {
        return "Rp" + Number(angka).toLocaleString("id-ID");
    }

    // Jika keranjang kosong
    if (dataKeranjang.length === 0) {

        daftarPesanan.innerHTML = `
            <p>Belum ada produk yang dipesan.</p>
        `;

        subtotalElement.textContent = "Rp0";
        ongkirElement.textContent = "Rp0";
        totalElement.textContent = "Rp0";

        return;
    }

    // Menampilkan produk
    let subtotal = 0;

    daftarPesanan.innerHTML = dataKeranjang.map(function (produk) {

        const harga = Number(produk.harga) || 0;
        const jumlah = Number(produk.jumlah || produk.qty) || 1;

        subtotal += harga * jumlah;

        let gambar = produk.gambar || "../image/produk.png";

        if (!gambar.startsWith("../")) {
            gambar = "../" + gambar.replace(/^\.?\//, "");
        }

        return `
            <div class="item-checkout"
                 style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">

                <img src="${gambar}"
                     alt="${produk.nama}"
                     style="width:70px; height:70px; object-fit:cover; border-radius:8px;"
                     onerror="this.onerror=null; this.src='../image/produk.png'">

                <div>
                    <p><strong>${produk.nama}</strong></p>
                    <p>${jumlah} x ${rupiahCheckout(harga)}</p>
                    <p>${rupiahCheckout(harga * jumlah)}</p>
                </div>

            </div>
        `;

    }).join("");

    // Menghitung pembayaran
    const total = subtotal + ongkir;

    subtotalElement.textContent = rupiahCheckout(subtotal);
    ongkirElement.textContent = rupiahCheckout(ongkir);
    totalElement.textContent = rupiahCheckout(total);

});


/* ==========================================
   CEK LOGIN SEBELUM CHECKOUT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const tombolCheckout = document.getElementById("btnCheckout");

    if (!tombolCheckout) {
        return;
    }

    tombolCheckout.addEventListener("click", function () {

        let dataKeranjang = [];

        try {
            dataKeranjang = JSON.parse(
                localStorage.getItem("keranjang")
            ) || [];
        } catch (error) {
            dataKeranjang = [];
        }

        if (dataKeranjang.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        const akunLogin = localStorage.getItem("akunLogin");

        if (akunLogin) {

            window.location.href = "checkout.html";

        } else {

            alert("Silakan login atau daftar akun terlebih dahulu!");

            localStorage.setItem("lanjutCheckout", "true");

            window.location.href = "login.html";

        }

    });

});



/* ==========================================
   LOGIN PEMBELI SNACKMARKET
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const formLogin = document.getElementById("formLogin");

    if (!formLogin) {
        return;
    }

    formLogin.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const pesanLogin = document.getElementById("pesanLogin");

        // Mengambil akun yang sudah didaftarkan
        let daftarAkun = [];

        try {
            daftarAkun = JSON.parse(
                localStorage.getItem("daftarAkun")
            ) || [];
        } catch (error) {
            daftarAkun = [];
        }

        // Memeriksa akun
        const akun = daftarAkun.find(function (data) {
            return data.email === email &&
                   data.password === password;
        });

        if (!akun) {
            pesanLogin.textContent =
                "Email atau password salah!";
            return;
        }

        // Menyimpan status login
        const dataLogin = {
            nama: akun.nama,
            email: akun.email
        };

        localStorage.setItem(
            "akunLogin",
            JSON.stringify(dataLogin)
        );

        alert("Login berhasil! Selamat berbelanja.");

        // Memeriksa apakah pembeli sebelumnya ingin checkout
        const lanjutCheckout =
            localStorage.getItem("lanjutCheckout");

        if (lanjutCheckout === "true") {

            localStorage.removeItem("lanjutCheckout");

            window.location.href = "../Produk/checkout.html";

        } else {

            window.location.href = "../index.html";
            // Menuju halaman daftar
        window.location.href = "daftar.html";


        }

    });

});



/* ==========================================
   PENDAFTARAN AKUN SNACKMARKET
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const formRegister = document.getElementById("formRegister");

    if (!formRegister) {
        return;
    }

    formRegister.addEventListener("submit", function (event) {

        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();

        const email = document.getElementById("emailRegister").value.trim();

        const telepon = document.getElementById("teleponRegister").value.trim();

        const password = document.getElementById("passwordRegister").value;

        const konfirmasi = document.getElementById("konfirmasiPassword").value;

        const pesan = document.getElementById("pesanRegister");

        // Memeriksa kesamaan password
        if (password !== konfirmasi) {
            pesan.textContent = "Konfirmasi password tidak sama!";
            return;
        }

        // Membaca akun yang sudah terdaftar
        let daftarAkun = [];

        try {
            daftarAkun = JSON.parse(
                localStorage.getItem("daftarAkun")
            ) || [];
        } catch (error) {
            daftarAkun = [];
        }

        // Memeriksa email yang sudah digunakan
        const emailTerdaftar = daftarAkun.some(function (akun) {
            return akun.email.toLowerCase() === email.toLowerCase();
        });

        if (emailTerdaftar) {
            pesan.textContent = "Email sudah terdaftar!";
            return;
        }

        // Membuat akun baru
        const akunBaru = {
            nama: nama,
            email: email,
            telepon: telepon,
            password: password
        };

        daftarAkun.push(akunBaru);

        // Menyimpan akun
        localStorage.setItem(
            "daftarAkun",
            JSON.stringify(daftarAkun)
        );

        alert("Pendaftaran berhasil! Silakan login.");

        // Menuju halaman login
        window.location.href = "login.html";

    });

});
/* ==========================================
   MENAMPILKAN DATA PEMBELI DI CHECKOUT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const namaPembeli = document.getElementById("namaPembeli");
    const emailPembeli = document.getElementById("emailPembeli");

    if (!namaPembeli || !emailPembeli) return;

    const akunLogin = JSON.parse(
        localStorage.getItem("akunLogin")
    );

    if (!akunLogin) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "../pembeli/login.html";
        return;
    }

    namaPembeli.textContent = "Nama: " + akunLogin.nama;
    emailPembeli.textContent = "Email: " + akunLogin.email;

});



/* ==========================================
   KONFIRMASI PESANAN SNACKMARKET
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const tombolKonfirmasi = document.getElementById("konfirmasiPesanan");

    if (!tombolKonfirmasi) return;

    tombolKonfirmasi.addEventListener("click", function () {

        const alamat = document.getElementById("alamat").value.trim();
        const telepon = document.getElementById("telepon").value.trim();

        if (alamat === "" || telepon === "") {
            alert("Silakan lengkapi alamat dan nomor telepon!");
            return;
        }

        const akunLogin = JSON.parse(localStorage.getItem("akunLogin") || "null");

        if (!akunLogin) {
            alert("Silakan login terlebih dahulu!");
            window.location.href = "login.html";
            return;
        }

        const keranjang = JSON.parse(localStorage.getItem("keranjang") || "[]");

        if (keranjang.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }

        // Menghitung subtotal
        let subtotal = 0;

        keranjang.forEach(function (produk) {
            subtotal += Number(produk.harga) * Number(produk.jumlah);
        });

        const ongkir = 10000;
        const total = subtotal + ongkir;

        // Membuat data pesanan
        const pesanan = {
            nomor: "SNK-" + Date.now(),
            tanggal: new Date().toLocaleString("id-ID"),
            nama: akunLogin.nama,
            email: akunLogin.email,
            telepon: telepon,
            alamat: alamat,
            produk: keranjang,
            subtotal: subtotal,
            ongkir: ongkir,
            total: total,
            status: "Menunggu Diproses"
        };

        // Menyimpan pesanan saat ini
        localStorage.setItem(
            "pesananTerakhir",
            JSON.stringify(pesanan)
        );

        // Menyimpan riwayat pesanan
        let riwayat = JSON.parse(
            localStorage.getItem("riwayatPesanan") || "[]"
        );

        riwayat.push(pesanan);

        localStorage.setItem(
            "riwayatPesanan",
            JSON.stringify(riwayat)
        );

        // Mengosongkan keranjang setelah pesanan disimpan
        localStorage.removeItem("keranjang");

        alert("Pesanan berhasil dibuat!");

        window.location.href = "pesanan.html";

    });

});


/* ==========================================
   MENAMPILKAN PESANAN BERHASIL
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const daftarProduk = document.getElementById("daftarProduk");

    if (!daftarProduk) return;

    const pesanan = JSON.parse(
        localStorage.getItem("pesananTerakhir") || "null"
    );

    if (!pesanan) {
        alert("Data pesanan tidak ditemukan!");
        window.location.href = "../index.html";
        return;
    }

    // Format Rupiah
    function rupiah(angka) {
        return "Rp" + Number(angka).toLocaleString("id-ID");
    }

    // Menampilkan informasi pembeli
    document.getElementById("nomorPesanan").textContent = pesanan.nomor;
    document.getElementById("tanggalPesanan").textContent = pesanan.tanggal;
    document.getElementById("namaPembeli").textContent = pesanan.nama;
    document.getElementById("emailPembeli").textContent = pesanan.email;
    document.getElementById("teleponPembeli").textContent = pesanan.telepon;
    document.getElementById("alamatPengiriman").textContent = pesanan.alamat;
    document.getElementById("totalPembayaran").textContent = rupiah(pesanan.total);

    // Menampilkan daftar produk
    daftarProduk.innerHTML = "";

    pesanan.produk.forEach(function (produk) {

        const item = document.createElement("div");

        item.className = "produk-item";

        const nama = document.createElement("span");
        nama.textContent = produk.nama + " x " + produk.jumlah;

        const harga = document.createElement("strong");
        harga.textContent = rupiah(
            Number(produk.harga) * Number(produk.jumlah)
        );

        item.appendChild(nama);
        item.appendChild(harga);

        daftarProduk.appendChild(item);

    });

});





/* ==========================================
   MENAMPILKAN RIWAYAT PESANAN
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const daftarRiwayat = document.getElementById("daftarRiwayat");

    if (!daftarRiwayat) return;

    const akunLogin = JSON.parse(
        localStorage.getItem("akunLogin") || "null"
    );

    if (!akunLogin) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    function rupiah(angka) {
        return "Rp" + Number(angka || 0).toLocaleString("id-ID");
    }

    function tampilkanRiwayat() {

        daftarRiwayat.innerHTML = "";

        const riwayat = JSON.parse(
            localStorage.getItem("riwayatPesanan") || "[]"
        );

        // Mengambil pesanan milik pembeli yang sedang login
        const pesananPembeli = riwayat.filter(function (pesanan) {
            return pesanan.email === akunLogin.email;
        });

        if (pesananPembeli.length === 0) {
            daftarRiwayat.innerHTML =
                '<div class="kosong">' +
                '<h3>Belum Ada Pesanan</h3>' +
                '<p>Kamu belum memiliki riwayat pesanan.</p>' +
                '</div>';
            return;
        }

        // Pesanan terbaru ditampilkan terlebih dahulu
        pesananPembeli.slice().reverse().forEach(function (pesanan) {

            const card = document.createElement("div");
            card.className = "riwayat-card";

            const header = document.createElement("div");
            header.className = "riwayat-header";

            const nomor = document.createElement("h3");
            nomor.textContent = pesanan.nomor;

            const status = document.createElement("span");
            status.className = "status";
            status.textContent = pesanan.status || "Menunggu Diproses";

            header.appendChild(nomor);
            header.appendChild(status);

            const info = document.createElement("div");
            info.className = "info-pesanan";

            const tanggal = document.createElement("p");
            tanggal.textContent = "Tanggal: " + pesanan.tanggal;

            const alamat = document.createElement("p");
            alamat.textContent = "Alamat: " + pesanan.alamat;

            const telepon = document.createElement("p");
            telepon.textContent = "Nomor Telepon: " + pesanan.telepon;

            info.appendChild(tanggal);
            info.appendChild(alamat);
            info.appendChild(telepon);

            const produkBox = document.createElement("div");
            produkBox.className = "produk-riwayat";

            const judulProduk = document.createElement("h4");
            judulProduk.textContent = "Produk yang Dipesan";

            produkBox.appendChild(judulProduk);

            (pesanan.produk || []).forEach(function (produk) {

                const item = document.createElement("p");

                item.textContent =
                    produk.nama + " x " + produk.jumlah +
                    " = " +
                    rupiah(Number(produk.harga) * Number(produk.jumlah));

                produkBox.appendChild(item);

            });

            const total = document.createElement("div");
            total.className = "total-riwayat";
            total.textContent = "Total: " + rupiah(pesanan.total);

            card.appendChild(header);
            card.appendChild(info);
            card.appendChild(produkBox);
            card.appendChild(total);

            daftarRiwayat.appendChild(card);

        });
    }

    // Tampilkan riwayat pertama kali
    tampilkanRiwayat();

    // Perbarui tampilan jika Admin mengubah status pesanan
    window.addEventListener("storage", function (event) {
        if (event.key === "riwayatPesanan") {
            tampilkanRiwayat();
        }
    });

});


