
// LOGIN ADMIN //


document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formLoginAdmin");
    const pesan = document.getElementById("pesanLogin");

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin123") {

            localStorage.setItem("adminLogin", "aktif");

            window.location.href = "dashbor.html";

        } else {
            pesan.textContent = "Username atau password salah!";
        }

    });

});




// DASHBOAR //


// DASHBOARD //

document.addEventListener("DOMContentLoaded", function () {

    // Jalankan hanya jika halaman Dashboard sedang dibuka
    const elemenDashboard = document.getElementById("totalPesanan");

    if (!elemenDashboard) return;

    if (localStorage.getItem("adminLogin") !== "aktif") {
        window.location.href = "login.html";
        return;
    }

    const tombolKeluar = document.getElementById("tombolKeluar");

    if (tombolKeluar) {
        tombolKeluar.addEventListener("click", function () {
            localStorage.removeItem("adminLogin");
            window.location.href = "login.html";
        });
    }

    const pesanan = JSON.parse(
        localStorage.getItem("riwayatPesanan") || "[]"
    );

    document.getElementById("totalPesanan").textContent =
        pesanan.length;

    document.getElementById("pesananMenunggu").textContent =
        pesanan.filter(p => p.status === "Menunggu Diproses").length;

    document.getElementById("pesananDiproses").textContent =
    pesanan.filter(p => p.status === "Diproses").length;

    document.getElementById("pesananSelesai").textContent =
        pesanan.filter(p => p.status === "Selesai").length;

});

/* ==========================================
   PESANAN MASUK ADMIN
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const daftarPesanan = document.getElementById("daftarPesanan");
    const filterStatus = document.getElementById("filterStatus");

    // Jalankan hanya pada halaman Pesanan Masuk
    if (!daftarPesanan || !filterStatus) return;

    // Periksa login Admin
    if (localStorage.getItem("adminLogin") !== "aktif") {
        window.location.href = "login.html";
        return;
    }

    function rupiah(angka) {
        return "Rp" + Number(angka || 0).toLocaleString("id-ID");
    }

    function tampilkanPesanan() {

        daftarPesanan.innerHTML = "";

        const riwayat = JSON.parse(
            localStorage.getItem("riwayatPesanan") || "[]"
        );

        // Filter berdasarkan status
        const statusDipilih = filterStatus.value;

        const pesananTampil = riwayat.filter(function (pesanan) {

            if (statusDipilih === "semua") {
                return true;
            }

            return (pesanan.status || "Menunggu Diproses") === statusDipilih;

        });

        // Jika tidak ada pesanan
        if (pesananTampil.length === 0) {

            daftarPesanan.innerHTML =
                '<div class="pesanan-kosong">' +
                'Belum ada pesanan masuk.' +
                '</div>';

            return;
        }

        pesananTampil.forEach(function (pesanan) {

            const card = document.createElement("div");
            card.className = "pesanan-card";

            // Nomor pesanan
            const nomor = document.createElement("h3");
            nomor.textContent = "Pesanan: " + (pesanan.nomor || "-");

            // Informasi pembeli
            const info = document.createElement("div");
            info.className = "info-pesanan";

            info.innerHTML = "";

            const nama = document.createElement("p");
            nama.textContent = "Nama Pembeli: " + (pesanan.nama || "-");

            const email = document.createElement("p");
            email.textContent = "Email: " + (pesanan.email || "-");

            const telepon = document.createElement("p");
            telepon.textContent = "Nomor Telepon: " + (pesanan.telepon || "-");

            const alamat = document.createElement("p");
            alamat.textContent = "Alamat: " + (pesanan.alamat || "-");

            const tanggal = document.createElement("p");
            tanggal.textContent = "Tanggal: " + (pesanan.tanggal || "-");

            info.appendChild(nama);
            info.appendChild(email);
            info.appendChild(telepon);
            info.appendChild(alamat);
            info.appendChild(tanggal);

            // Daftar produk
            const produkBox = document.createElement("div");
            produkBox.className = "produk-pesanan";

            const judulProduk = document.createElement("h4");
            judulProduk.textContent = "Produk yang Dipesan";

            produkBox.appendChild(judulProduk);

            (pesanan.produk || []).forEach(function (produk) {

                const item = document.createElement("p");

                item.textContent =
                    produk.nama + " x " + produk.jumlah +
                    " = " +
                    rupiah(Number(roduk.harga) * Number(produk.jumlah));

                produkBox.appendChild(item);

            });

            // Total pembayaran
            const total = document.createElement("h3");
            total.textContent = "Total: " + rupiah(pesanan.total);

            // Pilihan status
            const labelStatus = document.createElement("label");
            labelStatus.textContent = "Ubah Status Pesanan: ";

            const pilihStatus = document.createElement("select");
            pilihStatus.className = "ubah-status";

            const daftarStatus = [
                "Menunggu Diproses",
                "Diproses",
                "Dikirim",
                "Selesai"
            ];

            const statusSekarang =
                pesanan.status || "Menunggu Diproses";


            daftarStatus.forEach(function (status) {

                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;

                if (status === statusSekarang) {
                    option.selected = true;
                }

                pilihStatus.appendChild(option);

            });

            // Simpan perubahan status
            pilihStatus.addEventListener("change", function () {

                const semuaPesanan = JSON.parse(
                    localStorage.getItem("riwayatPesanan") || "[]"
                );

                const index = semuaPesanan.findIndex(function (item) {
                    return item.nomor === pesanan.nomor;
                });

                if (index !== -1) {

                    semuaPesanan[index].status = pilihStatus.value;

                    localStorage.setItem(
                        "riwayatPesanan",
                        JSON.stringify(semuaPesanan)
                    );

                    alert("Status pesanan berhasil diperbarui!");

                    tampilkanPesanan();

                }

            });

            labelStatus.appendChild(pilihStatus);

            // Gabungkan semua elemen
            card.appendChild(nomor);
            card.appendChild(info);
            card.appendChild(produkBox);
            card.appendChild(total);
            card.appendChild(labelStatus);

            daftarPesanan.appendChild(card);

        });

    }

    // Jalankan pertama kali
    tampilkanPesanan();

    // Filter status
    filterStatus.addEventListener("change", tampilkanPesanan);

});
