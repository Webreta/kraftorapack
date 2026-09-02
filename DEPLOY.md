# Easypanel Yayın Notları

Proje Easypanel'de GitHub üzerinden dağıtılır. Sıfırdan kurulum adımları:

## 1. Veritabanı servisi

Projeye bir **Postgres** servisi ekle (örnek ad: `db`). Easypanel kullanıcı adı,
şifre ve veritabanı adını kendisi üretir; servisin "Credentials" bölümündeki
**Internal** bağlantı adresini not al (host kısmı `projeadi_db` gibidir).

## 2. Uygulama servisi

Projeye bir **App** servisi ekle (örnek ad: `web`):

- Kaynak: GitHub, bu repo ve `main` dalı seçilir.
- Derleme: **Nixpacks** (varsayılan). `npm run build` ve `npm start` otomatik çalışır.
- Start komutunu şu şekilde değiştir (her dağıtımda migration otomatik koşar):

  ```
  npm run db:migrate && npm start
  ```

## 3. Ortam değişkenleri (App > Environment)

```
DATABASE_URL=postgres://KULLANICI:SIFRE@projeadi_db:5432/VERITABANI
SEED_ADMIN_EMAIL=admin@kraftorapack.com
SEED_ADMIN_NAME=Admin
SEED_ADMIN_PASSWORD=guclu-bir-sifre
NEXT_PUBLIC_SITE_URL=https://kraftorapack.com
```

## 4. Kalıcı depolama (App > Mounts)

Panelden yüklenen tüm dosyalar `public/uploads/` altına yazılır; volume
bağlanmazsa her dağıtımda silinir. Tek bir **Volume Mount** yeterli:

| Volume adı | Mount yolu          |
| ---------- | ------------------- |
| uploads    | /app/public/uploads |

## 5. İlk açılış (tek seferlik)

İlk dağıtım bittikten sonra App servisinin **Console** sekmesinden sırayla:

```
npm run db:seed          # admin kullanıcısını oluşturur (env'deki bilgilerle)
npm run db:seed-content  # ürün, blog ve galeri başlangıç içeriği
```

Ardından `/admin/giris` üzerinden girip İletişim ve Teknik (SMTP, SEO) ayarlarını
panelden kontrol et. SMTP ayarlarının çalıştığını Teknik sayfasındaki "SMTP Testi"
alanından doğrulayabilirsin. Demo alan adında yayındayken Teknik > İndeksleme'yi
kapalı tut; gerçek alan adına geçince aç.

## 6. Alan adı

App servisinin **Domains** bölümünden alan adını ekle; Easypanel Let's Encrypt
sertifikasını kendisi alır. Alan adının DNS A kaydı sunucu IP'sine bakmalı.

Sonraki yayınlar: değişiklikleri `main` dalına pushla, Easypanel'de **Deploy**
butonuna bas (veya GitHub webhook'u ekleyerek otomatikleştir).
