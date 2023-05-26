
import { Route, Routes } from "react-router-dom";
import FlashCardContext from "./context/FlashCardContext";
import Home from "./pages/Home";
import List from "./pages/List";
import Detail from "./pages/Detail";
import Create from "./pages/Create";
import Navbar from "./components/Navbar";
import Edit from "./pages/Edit";
import AddFlashCard from "./pages/AddFlashcard";
import { AuthContext } from "./context/authContext";
import Login from "./pages/Login";
import { useContext } from "react";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  const {state} = useContext(AuthContext)
  return (
    <>
    <header>
      <Navbar />
    </header>
   <main>
      <FlashCardContext>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/decks" element={state.isLoggedIn ? <List /> : <Login />} />
          <Route path="/decks/:id" element={state.isLoggedIn ? <Detail /> : <Login />} />
          <Route path="/decks/:id/edit" element={state.isLoggedIn ? <Edit /> : <Login />} />
          <Route path="/create" element={state.isLoggedIn ? <Create /> : <Login />} />
          <Route path="/:id/create-flashcard" element={state.isLoggedIn ? <AddFlashCard /> : <Login />} />
          <Route path="/login" element={state.isLoggedIn ? <List /> : <Login />} />
          <Route path="/register" element={state.isLoggedIn ? <List /> : <Register />} />
          <Route path="/profile" element={state.isLoggedIn ? <Profile /> : <Login />} />
        </Routes>
     </FlashCardContext>
   </main>
    </>
  );
}

export default App;
