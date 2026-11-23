
// ======================================
// PESANAN MASUK ADMIN
// ======================================

document.addEventListener("DOMContentLoaded", function () {

    // Periksa apakah halaman Pesanan Masuk sedang dibuka
    const daftarPesanan = document.getElementById("daftarPesanan");
    const filterStatus = document.getElementById("filterStatus");

    // Jika bukan halaman Pesanan Masuk, hentikan kode
    if (!daftarPesanan || !filterStatus) {
        return;
    }

    // Periksa login admin
    if (localStorage.getItem("adminLogin") !== "aktif") {
        window.location.href = "login.html";
        return;
    }

    // Format harga menjadi Rupiah
    function rupiah(angka) {
        return "Rp" + Number(angka || 0).toLocaleString("id-ID");
    }

    // Menampilkan daftar pesanan
    function tampilkanPesanan() {

        const riwayat = JSON.parse(
            localStorage.getItem("riwayatPesanan") || "[]"
        );

        const pilihan = filterStatus.value;

        const pesananTampil = riwayat.filter(function (pesanan) {
            return pilihan === "semua" ||
                   pesanan.status === pilihan;
        });

        daftarPesanan.innerHTML = "";

        // Jika belum ada pesanan
        if (pesananTampil.length === 0) {

            daftarPesanan.innerHTML =
                '<div class="pesanan-kosong">Belum ada pesanan masuk.</div>';

            return;
        }

        // Pesanan terbaru ditampilkan terlebih dahulu
        pesananTampil.slice().reverse().forEach(function (pesanan) {

            const card = document.createElement("div");
            card.className = "pesanan-card";

            // Nomor pesanan
            const judul = document.createElement("h3");
            judul.textContent = "Pesanan " + (pesanan.nomor || "-");

            card.appendChild(judul);

            // Informasi pembeli
            const info = document.createElement("div");

            function tambahInfo(label, nilai) {

                const p = document.createElement("p");
                const strong = document.createElement("strong");

                strong.textContent = label + ": ";

                p.appendChild(strong);
                p.appendChild(
                    document.createTextNode(nilai ?? "-")
                );

                info.appendChild(p);
            }

            tambahInfo("Tanggal", pesanan.tanggal);
            tambahInfo("Nama Pembeli", pesanan.nama);
            tambahInfo("Email", pesanan.email);
            tambahInfo("Telepon", pesanan.telepon);
            tambahInfo("Alamat", pesanan.alamat);

            card.appendChild(info);

            // Produk yang dipesan
            const judulProduk = document.createElement("h4");
            judulProduk.textContent = "Produk yang Dipesan";

            card.appendChild(judulProduk);

            (pesanan.produk || []).forEach(function (produk) {

                const item = document.createElement("p");

                item.textContent =
                    produk.nama + " x " + produk.jumlah +
                    " = " +
                    rupiah(
                        Number(produk.harga) * Number(produk.jumlah)
                    );

                card.appendChild(item);
            });

            // Total pembayaran
            const total = document.createElement("p");

            total.textContent =
                "Total Pembayaran: " + rupiah(pesanan.total);

            card.appendChild(total);

            // Pilihan status pesanan
            const labelStatus = document.createElement("label");

            labelStatus.textContent = "Ubah Status Pesanan: ";

            const selectStatus = document.createElement("select");

            const daftarStatus = [
                "Menunggu Diproses",
                "Diproses",
                "Dikirim",
                "Selesai"
            ];

            daftarStatus.forEach(function (status) {

                const option = document.createElement("option");

                option.value = status;
                option.textContent = status;

                if (pesanan.status === status) {
                    option.selected = true;
                }

                selectStatus.appendChild(option);
            });

            // Menyimpan perubahan status
            selectStatus.addEventListener("change", function () {

                const dataTerbaru = JSON.parse(
                    localStorage.getItem("riwayatPesanan") || "[]"
                );

                const index = dataTerbaru.findIndex(function (item) {
                    return item.nomor === pesanan.nomor;
                });

                if (index !== -1) {

                    dataTerbaru[index].status = selectStatus.value;

                    localStorage.setItem(
                        "riwayatPesanan",
                        JSON.stringify(dataTerbaru)
                    );

                    alert("Status pesanan berhasil diperbarui!");

                    tampilkanPesanan();
                }

            });

            card.appendChild(labelStatus);
            card.appendChild(selectStatus);

            daftarPesanan.appendChild(card);

        });

    }

    // Filter berdasarkan status
    filterStatus.addEventListener("change", tampilkanPesanan);

    // Tampilkan pesanan saat halaman dibuka
    tampilkanPesanan();

});
