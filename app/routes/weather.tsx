import { useState, useEffect } from "react";
import type { Route } from "./+types/weather";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Weather - React Router App" },
    { name: "description", content: "Check the current weather conditions" },
  ];
}

export default function Weather() {
  const [city, setCity] = useState("Hanoi");
  const [language, setLanguage] = useState("vi");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng API key từ environment variable hoặc demo key
  // Lưu ý: Bạn cần đăng ký API key miễn phí tại https://openweathermap.org/api
  const API_KEY = import.meta.env.VITE_API_KEY;
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  // https://api.openweathermap.org/data/2.5/weather?q=Hanoi&appid=d693cc8553d6f6aaf2d636b34bc175ea&units=metric&lang=vi


  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    setError(null);
    const query = `?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`;
    
    if(!API_KEY) {
      setError("API key is not set");
      return;
    }
    fetch(API_URL+query, {
      method: "GET",
      mode: "cors",
    })
    .then(response => response.json())
    .then(data => {
      setWeatherData(data);
    })
    .catch(error => setError(error.message))
  };

  useEffect(() => {
    console.log("City thay đổi là: ", city);
    if(city)
      fetchWeather(city);
  }, [city, language]);

  //

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <>
    <select className="w-full p-2 border border-gray-300 rounded-md" onChange={(e) => setCity(e.target.value)}>
      <option value="">Chọn thành phố</option>
      <option value="Danang">Đà Nẵng</option>
      <option value="Hanoi">Hà Nội</option>
      <option value="Haiphong">Hải Phòng</option>
    </select>
    <select>
      <option>Chọn ngôn ngữ</option>
      <option value="vi">Tiếng Việt</option>
      <option value="en">Tiếng Anh</option>
    </select>
    <div>
      {JSON.stringify(weatherData)}
    </div>
    {!city && <div className="text-red-500">Vui lòng chọn thành phố</div>}
    {error && <div className="text-red-500">{error}</div>}
    </>
    // <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 py-8 px-4">
    //   <div className="max-w-4xl mx-auto">
    //     <div className="bg-white rounded-2xl shadow-2xl p-8">
    //       <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
    //         🌤️ Thông Tin Thời Tiết
    //       </h1>

    //       {/* Search Form */}
    //       <form onSubmit={handleSearch} className="mb-8">
    //         <div className="flex gap-4">
    //           <input
    //             type="text"
    //             value={city}
    //             onChange={(e) => setCity(e.target.value)}
    //             placeholder="Nhập tên thành phố..."
    //             className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
    //           />
    //           <button
    //             type="submit"
    //             disabled={loading}
    //             className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
    //           >
    //             {loading ? "Đang tải..." : "Tìm kiếm"}
    //           </button>
    //         </div>
    //       </form>

    //       {/* Error Message */}
    //       {error && (
    //         <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
    //           <p className="font-semibold">⚠️ Lỗi:</p>
    //           <p>{error}</p>
    //           {API_KEY === "demo_key" && (
    //             <p className="mt-2 text-sm">
    //               💡 Để sử dụng API thật, vui lòng thêm biến môi trường VITE_WEATHER_API_KEY.
    //               Đăng ký miễn phí tại{" "}
    //               <a
    //                 href="https://openweathermap.org/api"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="text-blue-600 underline"
    //               >
    //                 OpenWeatherMap
    //               </a>
    //             </p>
    //           )}
    //         </div>
    //       )}

    //       {/* Weather Data */}
    //       {weatherData && !loading && (
    //         <div className="space-y-6">
    //           {/* Main Weather Card */}
    //           <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-8 text-white">
    //             <div className="flex items-center justify-between mb-4">
    //               <div>
    //                 <h2 className="text-3xl font-bold mb-2">{weatherData.name}</h2>
    //                 <p className="text-blue-100">
    //                   {new Date().toLocaleDateString("vi-VN", {
    //                     weekday: "long",
    //                     year: "numeric",
    //                     month: "long",
    //                     day: "numeric",
    //                   })}
    //                 </p>
    //               </div>
    //               {weatherData.weather[0]?.icon && (
    //                 <img
    //                   src={getWeatherIcon(weatherData.weather[0].icon)}
    //                   alt={weatherData.weather[0].description}
    //                   className="w-24 h-24"
    //                 />
    //               )}
    //             </div>
    //             <div className="mt-6">
    //               <div className="text-6xl font-bold mb-2">
    //                 {Math.round(weatherData.main.temp)}°C
    //               </div>
    //               <p className="text-xl text-blue-100 capitalize">
    //                 {weatherData.weather[0]?.description}
    //               </p>
    //               <p className="text-blue-200 mt-2">
    //                 Cảm giác như {Math.round(weatherData.main.feels_like)}°C
    //               </p>
    //             </div>
    //           </div>

    //           {/* Weather Details Grid */}
    //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    //             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
    //               <div className="flex items-center gap-3 mb-2">
    //                 <span className="text-2xl">💧</span>
    //                 <h3 className="font-semibold text-gray-700">Độ ẩm</h3>
    //               </div>
    //               <p className="text-3xl font-bold text-gray-900">
    //                 {weatherData.main.humidity}%
    //               </p>
    //             </div>

    //             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
    //               <div className="flex items-center gap-3 mb-2">
    //                 <span className="text-2xl">🌡️</span>
    //                 <h3 className="font-semibold text-gray-700">Áp suất</h3>
    //               </div>
    //               <p className="text-3xl font-bold text-gray-900">
    //                 {weatherData.main.pressure} hPa
    //               </p>
    //             </div>

    //             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
    //               <div className="flex items-center gap-3 mb-2">
    //                 <span className="text-2xl">💨</span>
    //                 <h3 className="font-semibold text-gray-700">Tốc độ gió</h3>
    //               </div>
    //               <p className="text-3xl font-bold text-gray-900">
    //                 {weatherData.wind.speed} m/s
    //               </p>
    //             </div>

    //             <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
    //               <div className="flex items-center gap-3 mb-2">
    //                 <span className="text-2xl">📍</span>
    //                 <h3 className="font-semibold text-gray-700">Tọa độ</h3>
    //               </div>
    //               <p className="text-sm font-bold text-gray-900">
    //                 {weatherData.coord.lat.toFixed(2)}, {weatherData.coord.lon.toFixed(2)}
    //               </p>
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       {/* Loading State */}
    //       {loading && (
    //         <div className="text-center py-12">
    //           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    //           <p className="mt-4 text-gray-600">Đang tải dữ liệu thời tiết...</p>
    //         </div>
    //       )}

    //       {/* Info about API Key */}
    //       {API_KEY === "demo_key" && !weatherData && !loading && (
    //         <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded">
    //           <p className="font-semibold text-yellow-800 mb-2">ℹ️ Thông tin:</p>
    //           <p className="text-yellow-700 text-sm">
    //             Hiện tại đang sử dụng dữ liệu demo. Để sử dụng API thật:
    //           </p>
    //           <ol className="list-decimal list-inside text-yellow-700 text-sm mt-2 space-y-1">
    //             <li>Đăng ký tài khoản miễn phí tại{" "}
    //               <a
    //                 href="https://openweathermap.org/api"
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="text-blue-600 underline"
    //               >
    //                 OpenWeatherMap
    //               </a>
    //             </li>
    //             <li>Tạo file <code className="bg-yellow-100 px-1 rounded">.env</code> trong thư mục Frontend</li>
    //             <li>Thêm dòng: <code className="bg-yellow-100 px-1 rounded">VITE_WEATHER_API_KEY=your_api_key_here</code></li>
    //             <li>Khởi động lại server dev</li>
    //           </ol>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}

