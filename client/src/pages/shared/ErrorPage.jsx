import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  console.log("Router Error:", error);
  return (
    <div>
      <h1>Error Page</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  );
};