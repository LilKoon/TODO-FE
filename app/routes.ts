import { type RouteConfig, index, route } from "@react-router/dev/routes";

<<<<<<< HEAD
export default [index("todo-app/index.tsx")] satisfies RouteConfig;
=======
export default [
  index("todo-app/index.tsx"),
  route("thoitiet", "routes/weather.tsx"),
] satisfies RouteConfig;
>>>>>>> d7a73ba8fd1a6fb398ee487d7d5757c5eee9591b
