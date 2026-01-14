import { BadgeEuro, BadgeInfo, Check, ChevronRight, Cloud, Droplets, Eye, MapPin, Moon, Navigation, Search, Settings, Sun, Thermometer, User, Wind, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Dropdown } from "antd";
import { Link } from "react-router";
import ReactCountryFlag from "react-country-flag";

import rainyImg from "../images/rainy.jpg";
import stormImg from "../images/storm.jpg";
import sunImg from "../images/sun.jpg";

const translations = {
  en: {
    searchPlaceholder: "Search city...",
    currentLocation: "Current Location",
    feelsLike: "Feels Like",
    wind: "Wind",
    pressure: "Pressure",
    sunTime: "Sun & Time",
    sunrise: "Sunrise",
    sunset: "Sunset",
    humidity: "Humidity",
    visibility: "Visibility",
    cloudiness: "Cloudiness",
    forecast7Days: "7-Day Forecast",
    hourlyForecast: "Hourly Forecast",
    next24Hours: "Next 24 Hours",
    settings: "Settings",
    language: "Language",
    appearance: "Appearance",
    radar: "View Radar Map",
    seaLevel: "Sea Level",
    locale: "en-US",
    unitSpeed: "mph"
  },
  vi: {
    searchPlaceholder: "Tìm kiếm thành phố...",
    currentLocation: "Vị trí hiện tại",
    feelsLike: "Cảm giác như",
    wind: "Gió",
    pressure: "Áp suất",
    sunTime: "Mặt trời & Giờ",
    sunrise: "Bình minh",
    sunset: "Hoàng hôn",
    humidity: "Độ ẩm",
    visibility: "Tầm nhìn",
    cloudiness: "Độ phủ mây",
    forecast7Days: "Dự báo 7 ngày",
    hourlyForecast: "Dự báo theo giờ",
    next24Hours: "24 giờ tới",
    settings: "Cài đặt",
    language: "Ngôn ngữ",
    appearance: "Giao diện",
    radar: "Xem bản đồ Radar",
    seaLevel: "Mực nước biển",
    locale: "vi-VN",
    unitSpeed: "m/s"
  },
  fr: {
    searchPlaceholder: "Rechercher une ville...",
    currentLocation: "Position actuelle",
    feelsLike: "Ressenti",
    wind: "Vent",
    pressure: "Pression",
    sunTime: "Soleil & Heure",
    sunrise: "Lever",
    sunset: "Coucher",
    humidity: "Humidité",
    visibility: "Visibilité",
    cloudiness: "Nébulosité",
    forecast7Days: "Prévisions 7 jours",
    hourlyForecast: "Prévisions horaires",
    next24Hours: "Prochaines 24h",
    settings: "Paramètres",
    language: "Langue",
    appearance: "Apparence",
    radar: "Voir le radar",
    seaLevel: "Niveau mer",
    locale: "fr-FR",
    unitSpeed: "m/s"
  },
  es: {
    searchPlaceholder: "Buscar ciudad...",
    currentLocation: "Ubicación actual",
    feelsLike: "Sensación",
    wind: "Viento",
    pressure: "Presión",
    sunTime: "Sol y Hora",
    sunrise: "Amanecer",
    sunset: "Atardecer",
    humidity: "Humedad",
    visibility: "Visibilidad",
    cloudiness: "Nubosidad",
    forecast7Days: "Pronóstico 7 días",
    hourlyForecast: "Pronóstico por hora",
    next24Hours: "Próximas 24h",
    settings: "Ajustes",
    language: "Idioma",
    appearance: "Apariencia",
    radar: "Ver mapa de radar",
    seaLevel: "Nivel del mar",
    locale: "es-ES",
    unitSpeed: "m/s"
  }
};

const WeatherApp = () => {
  const API_KEY = "e5cebb3a317b36e332e07e209d7b630c";

  const [weatherData, setWeatherData] = useState<any>(null);
  const [city, setCity] = useState("Hanoi");
  const [unit, setUnit] = useState("imperial");

  const [language, setLanguage] = useState("en");
  const t = translations[language];

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const suggestedCities = [
    { name: "Hanoi", country: "Vietnam" },
    { name: "Ho Chi Minh City", country: "Vietnam" },
    { name: "Haiphong", country: "Vietnam" },
    { name: "Da Nang", country: "Vietnam" },
    { name: "London", country: "UK" },
    { name: "New York", country: "US" },
    { name: "Tokyo", country: "Japan" },
    { name: "Paris", country: "France" },
  ];

  const languagesList = [
    { code: "en", name: "English", country: "US" },
    { code: "vi", name: "Tiếng Việt", country: "VN" },
    { code: "fr", name: "Français", country: "FR" },
    { code: "es", name: "Español", country: "ES" },
  ];

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&lang=${language}&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setShowSuggestions(false);
      } else {
        alert("Không tìm thấy thành phố này! Vui lòng kiểm tra lại tên.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [unit, language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter") fetchWeather(city);
  };

  const handleSelectCity = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString(t.locale, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hourlyData = [
    // --- BUỔI CHIỀU (Day) ---
    { time: "Now", temp: 72, icon: "01d", active: true },
    { time: "1 PM", temp: 74, icon: "01d", active: false },
    { time: "2 PM", temp: 75, icon: "02d", active: false },
    { time: "3 PM", temp: 76, icon: "02d", active: false },
    { time: "4 PM", temp: 75, icon: "02d", active: false },
    { time: "5 PM", temp: 73, icon: "03d", active: false },
    { time: "6 PM", temp: 70, icon: "03d", active: false },

    // --- BUỔI TỐI & ĐÊM (Night) ---
    { time: "7 PM", temp: 68, icon: "04n", active: false },
    { time: "8 PM", temp: 66, icon: "04n", active: false },
    { time: "9 PM", temp: 65, icon: "04n", active: false },
    { time: "10 PM", temp: 64, icon: "03n", active: false },
    { time: "11 PM", temp: 63, icon: "03n", active: false },
    { time: "12 AM", temp: 62, icon: "02n", active: false },
    { time: "1 AM", temp: 61, icon: "02n", active: false },
    { time: "2 AM", temp: 60, icon: "01n", active: false },
    { time: "3 AM", temp: 60, icon: "01n", active: false },
    { time: "4 AM", temp: 59, icon: "01n", active: false },
    { time: "5 AM", temp: 59, icon: "02n", active: false },

    // --- BUỔI SÁNG HÔM SAU (Day) ---
    { time: "6 AM", temp: 60, icon: "02d", active: false },
    { time: "7 AM", temp: 62, icon: "01d", active: false },
    { time: "8 AM", temp: 65, icon: "01d", active: false },
    { time: "9 AM", temp: 68, icon: "01d", active: false },
    { time: "10 AM", temp: 70, icon: "02d", active: false },
    { time: "11 AM", temp: 71, icon: "02d", active: false },
  ];

  const getWeatherImage = (weatherMain) => {
    if (!weatherMain) return sunImg;
    const main = weatherMain.toLowerCase();

    if (main.includes("rain") || main.includes("drizzle")) return rainyImg;
    if (main.includes("storm") || main.includes("thunder")) return stormImg;
    return sunImg;
  };

  const renderSettingsMenu = () => (
    <div className="bg-[#1e293b] w-64 p-4 rounded-xl text-white shadow-2xl border border-gray-700 font-sans">
      <div className="mb-4">
        <h3 className="text-lg font-bold">{t.settings}</h3>
      </div>

      <div className="mb-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
          {t.language}
        </p>
        <div className="flex flex-col gap-1">
          {languagesList.map((lang) => (
            <div
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${language === lang.code
                ? "bg-gray-700/50 hover:bg-gray-700"
                : "hover:bg-gray-700"
                }`}
            >
              <div className="flex items-center gap-3">
                <ReactCountryFlag
                  countryCode={lang.country}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                  title={lang.country}
                />
                <span className={`text-sm font-medium ${language === lang.code ? "text-white" : "text-gray-300"}`}>
                  {lang.name}
                </span>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-blue-400" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
          <Moon className="w-5 h-5 text-gray-300" />
          <span className="text-sm font-medium text-gray-300">{t.appearance}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col font-sans">
      <header className="flex justify-between items-center bg-[#101A23] px-8 h-20 border-b border-gray-800 relative z-50">
        <div className="flex items-center gap-3 text-white min-w-max">
          <Cloud className="text-blue-500 w-8 h-8 fill-current" />
          <p className="text-xl font-bold tracking-wide">WeatherDash</p>
        </div>

        <div className="flex-1 flex justify-center px-8 relative" ref={searchContainerRef}>
          <div className="w-full max-w-lg relative">
            <div className="relative w-full z-20">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                className={`bg-[#202B3B] text-white pl-12 pr-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 font-medium transition-all ${showSuggestions ? "rounded-b-none ring-2 ring-blue-500" : ""
                  }`}
                type="text"
                placeholder={t.searchPlaceholder}
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearch}
              />
            </div>

            {showSuggestions && (
              <div className="absolute top-full left-0 w-full bg-[#1e293b] rounded-b-xl shadow-2xl border-t border-gray-700 overflow-hidden z-10">
                <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestedCities
                  .filter(c => c.name.toLowerCase().includes(city.toLowerCase()))
                  .map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectCity(item.name)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#2B394B] cursor-pointer transition-colors border-l-2 border-transparent hover:border-blue-500"
                    >
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-white text-sm font-medium leading-none mb-1">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs leading-none">
                          {item.country}
                        </p>
                      </div>
                    </div>
                  ))}
                {suggestedCities.filter(c => c.name.toLowerCase().includes(city.toLowerCase())).length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-sm">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-max">
          <div className="flex items-center bg-[#202B3B] rounded-lg p-1 gap-1">
            <button
              onClick={() => setUnit("imperial")}
              className={`cursor-pointer rounded-md h-8 w-10 text-sm font-bold transition-all ${unit === "imperial"
                ? "bg-[#308DED] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
                }`}
            >
              °F
            </button>
            <button
              onClick={() => setUnit("metric")}
              className={`cursor-pointer rounded-md h-8 w-10 text-sm font-bold transition-all ${unit === "metric"
                ? "bg-[#308DED] text-white shadow-lg"
                : "text-gray-400 hover:text-white"
                }`}
            >
              °C
            </button>
          </div>

          <Dropdown
            trigger={["click"]}
            placement="bottomRight"
            dropdownRender={renderSettingsMenu}
          >
            <button className="bg-[#308DED] hover:bg-blue-600 text-white p-2.5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-blue-500/20">
              <Settings className="w-5 h-5" />
            </button>
          </Dropdown>

          <button className="bg-[#202B3B] hover:bg-gray-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer border border-gray-700/50">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 p-4 gap-4 overflow-hidden bg-[#101A23] border-b border-gray-800">
        <div className="w-[70%] overflow-auto flex flex-col gap-4 h-full">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-white text-2xl font-bold">
                {weatherData?.name || "Loading..."}
              </p>
              <p className="text-gray-400 text-sm font-medium">
                {new Date().toLocaleDateString(t.locale, {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={() => fetchWeather("Hanoi")}
              className="flex items-center gap-1 bg-[#17314C] hover:bg-[#203C5C] text-blue-400 px-3 py-1.5 rounded-lg font-bold text-xs "
            >
              <Navigation className="w-3 h-3" /> {t.currentLocation}
            </button>
          </div>

          <div className="text-white bg-gradient-to-br from-[#1E293B] to-[#111827] p-6 rounded-2xl flex justify-between items-center relative shadow-lg h-48">
            <div className="z-10 pl-2">
              <div className="text-6xl font-bold mb-1">
                {weatherData ? Math.round(weatherData.main.temp) : "--"}
                <span className="text-blue-500 text-3xl align-top">°</span>
              </div>
              <div className="text-lg font-medium text-blue-100 capitalize mb-4">
                {weatherData?.weather[0]?.description}
              </div>
              <div className="text-sm text-gray-400">
                {t.feelsLike}:{" "}
                <span className="text-white font-bold">
                  {weatherData ? Math.round(weatherData.main.feels_like) : "--"}
                  °
                </span>
              </div>
            </div>

            <div className="mr-4 relative">
              <div className="w-40 h-40 rounded-full border-[6px] border-[#202B3B] overflow-hidden shadow-2xl bg-blue-900">
                {weatherData && (
                  <img
                    src={getWeatherImage(weatherData.weather[0].main)}
                    alt="weather icon"
                    className="w-full h-full object-cover opacity-90"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <p className="text-md font-bold text-gray-300 mb-3">
              Current Details
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 h-full text-white">
              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Wind className="w-4 h-4" /> {t.wind}
                </div>
                <div className="text-xl font-bold">
                  {weatherData?.wind?.speed}{" "}
                  <span className="text-xs text-gray-400">
                    {unit === "metric" ? "m/s" : "mph"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Deg: {weatherData?.wind?.deg}°
                </div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Thermometer className="w-4 h-4" /> {t.pressure}
                </div>
                <div className="text-xl font-bold">
                  {weatherData?.main?.pressure}{" "}
                  <span className="text-xs text-gray-400">hPa</span>
                </div>
                <div className="text-[10px] text-gray-400">{t.seaLevel}</div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Sun className="w-4 h-4" /> {t.sunTime}
                </div>
                <div className="text-[10px] text-gray-300 flex justify-between w-full border-b border-gray-700 pb-1">
                  <span>{t.sunrise}</span>{" "}
                  <span>
                    {weatherData ? formatTime(weatherData.sys.sunrise) : "--"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-300 flex justify-between w-full pt-1">
                  <span>{t.sunset}</span>{" "}
                  <span>
                    {weatherData ? formatTime(weatherData.sys.sunset) : "--"}
                  </span>
                </div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Droplets className="w-4 h-4" /> {t.humidity}
                </div>
                <div className="text-xl font-bold">
                  {weatherData?.main?.humidity}{" "}
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="text-[10px] text-gray-400">Dew point: N/A</div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Eye className="w-4 h-4" /> {t.visibility}
                </div>
                <div className="text-xl font-bold">
                  {weatherData
                    ? (weatherData.visibility / 1000).toFixed(1)
                    : "--"}{" "}
                  <span className="text-xs text-gray-400">km</span>
                </div>
                <div className="text-[10px] text-gray-400">Clear view</div>
              </div>

              <div className="bg-[#1E293B] p-3 rounded-xl flex flex-col justify-between h-28">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <Cloud className="w-4 h-4" /> {t.cloudiness}
                </div>
                <div className="text-xl font-bold">
                  {weatherData?.clouds?.all}{" "}
                  <span className="text-xs text-gray-400">%</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${weatherData?.clouds?.all}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[30%] bg-[#1E293B] rounded-2xl p-5 h-full">
          <p className="text-white text-2xl font-bold mb-4">{t.forecast7Days}</p>
          <div className="flex flex-col gap-1 h-full overflow-y-auto pr-1">
            {[0, 1, 2, 3, 4, 5, 6].map((day, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0 hover:bg-[#2b384b] px-2 rounded transition-colors text-xs"
              >
                <span className="text-gray-400 w-10">
                  {new Date(Date.now() + day * 86400000).toLocaleDateString(
                    t.locale,
                    { weekday: "short" }
                  )}
                </span>
                <div className="flex items-center gap-1">
                  <img
                    src={`http://openweathermap.org/img/wn/${i % 2 === 0 ? "01d" : "02d"}.png`}
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <span className="text-white font-bold">
                    {i % 2 === 0 ? "Sunny" : "Rain"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <span className="text-white font-bold">32°</span>
                  <span className="text-gray-500">24°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="h-48 shrink-0 flex px-4 pb-4 gap-4 bg-[#0B131E]">
        <div className="w-[70%] flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2 px-1">
            <p className="text-sm font-bold text-gray-300">{t.hourlyForecast}</p>
            <span className="text-xs text-blue-400 cursor-pointer hover:underline">
              {t.next24Hours}
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide text-white">
            {hourlyData.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-center min-w-[80px] h-28 rounded-2xl border border-[#202B3B] transition-colors cursor-pointer ${item.active ? "bg-[#308DED] text-white" : "bg-[#1E293B] hover:bg-[#253246]"}`}
              >
                <span
                  className={`text-xs font-bold mb-1 ${!item.active && "text-gray-400"}`}
                >
                  {item.time}
                </span>
                <img
                  src={`http://openweathermap.org/img/wn/${item.icon}.png`}
                  className="w-10 h-10"
                  alt="icon"
                />
                <span className="text-sm font-bold">{item.temp}°</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[30%] h-full pt-6">
          <div className="h-full bg-[#2C333D] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-gray-500 transition-all">
            <p className="text-xs font-bold text-gray-400 group-hover:text-white">
              {t.radar}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeatherApp;