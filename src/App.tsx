import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Login from './page/Login'
import Chatroom from './page/Chatroom'
import { Fragment } from 'react/jsx-runtime'

export default function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chatroom />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Fragment>
  )
}
