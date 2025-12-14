// Responsive mobile menu toggle with accessibility and outside-click close
(function() {
    // Twin Times mobile menu (mamoona pages)
    const btn = document.querySelector('.mobile-menu-toggle');
    const menu = document.getElementById('mainMenu');

    function toggleMobileMenu() {
        if (!menu) return;
        const isActive = menu.classList.toggle('active');
        if (btn) btn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    }

    if (btn) btn.addEventListener('click', toggleMobileMenu);
    window.toggleMobileMenu = toggleMobileMenu; // compatibility

    // Close mamoona menu on outside click / ESC
    document.addEventListener('click', function(e) {
        if (!menu || !btn) return;
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
                btn.setAttribute('aria-expanded', 'false');
            }
        }
    });
    document.addEventListener('keydown', function(e) {
        if (!menu) return;
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    // Generic nav toggle for other pages (e.g., index.html)
    const menuBtn = document.getElementById('menu-btn') || document.querySelector('.menu-btn');
    const genericNav = document.getElementById('nav') || document.querySelector('.nav');

    function toggleNav() {
        if (!genericNav) return;
        genericNav.classList.toggle('active');
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleNav);
    window.toggleNav = toggleNav;
})();

document.addEventListener('DOMContentLoaded', () => {
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalTitle = document.getElementById('placeModalLabel');
    const modalWeather = document.getElementById('modalWeather');
    const weatherIcon = document.getElementById('weatherIcon');
    const dayNightSticker = document.getElementById('dayNightSticker');
    const weatherText = document.getElementById('weatherText');
    const dayNightText = document.getElementById('dayNightText');
    const weatherConditionText = document.getElementById('weatherConditionText');

    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', async () => {
            const image = button.getAttribute('data-image');
            const description = button.getAttribute('data-description');
            const title = button.closest('.text').querySelector('h2').textContent;
            const latitude = button.getAttribute('data-latitude');
            const longitude = button.getAttribute('data-longitude');

            modalImage.src = image;
            modalDescription.textContent = description;
            modalTitle.textContent = title;

            // Fetch and display weather data
            weatherText.textContent = 'Loading weather...';
            const weatherData = await fetchWeather(latitude, longitude);

            if (weatherData) {
                weatherIcon.textContent = weatherData.sticker;
                dayNightSticker.textContent = weatherData.dayNightSticker;
                dayNightText.textContent = weatherData.isDay ? "Day" : "Night";
                weatherConditionText.textContent = weatherData.description;
                weatherText.textContent = `🌡️ Temperature: ${weatherData.temperature}°C`;
            } else {
                weatherText.textContent = 'Weather data not available';
                weatherIcon.textContent = "❓";
                dayNightSticker.textContent = "🌗";
                dayNightText.textContent = "Unknown";
                weatherConditionText.textContent = "Unknown";
            }
        });
    });
});

async function fetchWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    try {
        console.log(`Fetching weather data for lat: ${latitude}, lon: ${longitude}`); // Debugging log
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Weather API Response:', data); // Debugging log

        const weather = data.current_weather;

        // Map weather codes to human-readable descriptions and emojis
        const weatherEmojis = {
            0: { description: "Clear sky", sticker: "☀️" },
            1: { description: "Mainly clear", sticker: "🌤️" },
            2: { description: "Partly cloudy", sticker: "⛅" },
            3: { description: "Overcast", sticker: "☁️" },
            45: { description: "Fog", sticker: "🌫️" },
            48: { description: "Depositing rime fog", sticker: "🌁" },
            51: { description: "Drizzle: Light", sticker: "🌦️" },
            53: { description: "Drizzle: Moderate", sticker: "🌧️" },
            55: { description: "Drizzle: Dense intensity", sticker: "🌧️" },
            61: { description: "Rain: Slight", sticker: "🌦️" },
            63: { description: "Rain: Moderate", sticker: "🌧️" },
            65: { description: "Rain: Heavy intensity", sticker: "🌧️" },
            71: { description: "Snow fall: Slight", sticker: "🌨️" },
            73: { description: "Snow fall: Moderate", sticker: "❄️" },
            75: { description: "Snow fall: Heavy intensity", sticker: "❄️" },
            80: { description: "Rain showers: Slight", sticker: "🌦️" },
            81: { description: "Rain showers: Moderate", sticker: "🌧️" },
            82: { description: "Rain showers: Violent", sticker: "⛈️" },
            95: { description: "Thunderstorm: Slight or moderate", sticker: "⛈️" },
            96: { description: "Thunderstorm with slight hail", sticker: "🌩️" },
            99: { description: "Thunderstorm with heavy hail", sticker: "🌩️" }
        };

        const weatherCode = weather.weathercode;
        const weatherInfo = weatherEmojis[weatherCode] || { description: "Unknown weather condition", sticker: "❓" };
        const isDay = weather.is_day === 1;
        const dayNightSticker = isDay ? "🌞" : "🌙"; // Use sun for day and moon for night

        return {
            temperature: weather.temperature,
            description: weatherInfo.description,
            sticker: weatherInfo.sticker,
            dayNightSticker: dayNightSticker,
            isDay: isDay
        };
    } catch (error) {
        console.error('Error fetching weather:', error); // Log the error for debugging
        return null;
    }
}
