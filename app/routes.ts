import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("todo-app/index.tsx"),
  route("thoitiet", "routes/weather.tsx"),
] satisfies RouteConfig;
