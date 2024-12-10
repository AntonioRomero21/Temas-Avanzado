import Home from "../src/home";
import { useRoutes } from "react-router-dom";
import './App.css';


function App() {

const routerArray=[
  {
    path:'/',
    element:<Home/>
  },
  {
    path: '/home',
    element: <Home />,
  },
];
let routesElement = useRoutes(routerArray);

  return (
    <div className="w-full h-screen flex flex-col">{routesElement}</div>
  );
}

export default App;
