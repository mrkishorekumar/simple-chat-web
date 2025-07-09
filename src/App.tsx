import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './page/Login'
import Chatroom from './page/Chatroom'

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/chat" element={<Chatroom />} />
    </Routes>
    </BrowserRouter>
  )
}
