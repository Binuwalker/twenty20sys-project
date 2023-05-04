import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Reconcilation from './components/Reconcilation';
import Comparision from './components/Comparision';
import Header from './components/layouts/Header';
import Login from './components/Login';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './actions/userAction';
import ProtectedRoute from './components/routes/ProtectedRoute';
function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser);
  }, [dispatch])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Reconcilation /></ProtectedRoute>} />
        <Route path="/comparisionpage" element={<ProtectedRoute><Comparision /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
