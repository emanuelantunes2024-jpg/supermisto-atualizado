import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext.jsx';
import { AdminAuthProvider } from './lib/AdminAuthContext.jsx';
import RequireMember from './components/RequireMember.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';
import MemberLayout from './components/MemberLayout.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Search from './pages/Search.jsx';
import Favorites from './pages/Favorites.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminRecipeList from './pages/admin/AdminRecipeList.jsx';
import AdminRecipeForm from './pages/admin/AdminRecipeForm.jsx';

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/entrar" element={<Login />} />

          <Route
            path="/app"
            element={
              <RequireMember>
                <MemberLayout />
              </RequireMember>
            }
          >
            <Route index element={<Home />} />
            <Route path="categoria/:slug" element={<Category />} />
            <Route path="receta/:slug" element={<RecipeDetail />} />
            <Route path="buscar" element={<Search />} />
            <Route path="favoritos" element={<Favorites />} />
            <Route path="perfil" element={<Profile />} />
          </Route>

          <Route path="/admin/entrar" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="recetas" element={<AdminRecipeList />} />
            <Route path="recetas/:id" element={<AdminRecipeForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
