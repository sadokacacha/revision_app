## 🚀 Installation
### 1️⃣ Clone the repository


### for the back 
cd server
composer install
php artisan key:generate
php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret


php artisan migrate
php artisan migrate:fresh --seed

php artisan serve


### for the front
cd client
npm install
npm run dev
