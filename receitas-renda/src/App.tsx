import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth/AuthContext';
import { AdminAuthProvider } from './lib/auth/AdminAuthContext';
import { AppLayout } from './components/app/AppLayout';
import { RequireAuth } from './components/app/RequireAuth';
import { AdminLayout } from './components/admin/AdminLayout';
import { RequireAdminAuth } from './components/admin/RequireAdminAuth';

import Login from './pages/app/Login';
import Register from './pages/app/Register';
import Home from './pages/app/Home';
import Recipes from './pages/app/Recipes';
import Categories from './pages/app/Categories';
import Search from './pages/app/Search';
import RecipeDetail from './pages/app/RecipeDetail';
import Calculators from './pages/app/Calculators';
import IncomeCenter, { GoalSimulator } from './pages/app/IncomeCenter';
import ShoppingList from './pages/app/ShoppingList';
import Favorites from './pages/app/Favorites';
import Collections from './pages/app/Collections';
import CollectionDetail from './pages/app/CollectionDetail';
import News from './pages/app/News';
import MyPlan from './pages/app/MyPlan';
import AIAssistant from './pages/app/AIAssistant';
import AppSettings from './pages/app/Settings';

import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminRecipes from './pages/admin/Recipes';
import AdminIngredients from './pages/admin/Ingredients';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminPlans from './pages/admin/Plans';
import AdminSubscriptions from './pages/admin/Subscriptions';
import AdminIncomeCenter from './pages/admin/IncomeCenterAdmin';
import AdminCalculators from './pages/admin/CalculatorsAdmin';
import AdminSimulator from './pages/admin/SimulatorAdmin';
import AdminShoppingList from './pages/admin/ShoppingListAdmin';
import AdminFavorites from './pages/admin/FavoritesAdmin';
import AdminNews from './pages/admin/News';
import AdminBanners from './pages/admin/Banners';
import AdminAIAssistant from './pages/admin/AIAssistantAdmin';
import AdminComments from './pages/admin/Comments';
import AdminNotifications from './pages/admin/Notifications';
import AdminReports from './pages/admin/Reports';
import AdminSupport from './pages/admin/Support';
import AdminAdministrators from './pages/admin/Admins';
import AdminPermissions from './pages/admin/Permissions';
import AdminLogs from './pages/admin/Logs';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />

      {/* ===== /app — aplicativo do assinante ===== */}
      <Route
        path="/app/*"
        element={
          <AuthProvider>
            <Routes>
              <Route path="entrar" element={<Login />} />
              <Route path="registro" element={<Register />} />
              <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                  <Route index element={<Home />} />
                  <Route path="receitas" element={<Recipes />} />
                  <Route path="receitas/:slug" element={<RecipeDetail />} />
                  <Route path="categorias" element={<Categories />} />
                  <Route path="buscar" element={<Search />} />
                  <Route path="calculadoras" element={<Calculators />} />
                  <Route path="central-de-renda" element={<IncomeCenter />} />
                  <Route path="simulador-de-objetivos" element={<GoalSimulator />} />
                  <Route path="lista-de-compras" element={<ShoppingList />} />
                  <Route path="favoritos" element={<Favorites />} />
                  <Route path="colecoes" element={<Collections />} />
                  <Route path="colecoes/:id" element={<CollectionDetail />} />
                  <Route path="novidades" element={<News />} />
                  <Route path="meu-plano" element={<MyPlan />} />
                  <Route path="assistente-ia" element={<AIAssistant />} />
                  <Route path="configuracoes" element={<AppSettings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </AuthProvider>
        }
      />

      {/* ===== /admin — painel administrativo ===== */}
      <Route
        path="/admin/*"
        element={
          <AdminAuthProvider>
            <Routes>
              <Route path="entrar" element={<AdminLogin />} />
              <Route element={<RequireAdminAuth />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="receitas" element={<AdminRecipes />} />
                  <Route path="ingredientes" element={<AdminIngredients />} />
                  <Route path="categorias" element={<AdminCategories />} />
                  <Route path="usuarios" element={<AdminUsers />} />
                  <Route path="planos" element={<AdminPlans />} />
                  <Route path="assinaturas" element={<AdminSubscriptions />} />
                  <Route path="central-de-renda" element={<AdminIncomeCenter />} />
                  <Route path="calculadoras" element={<AdminCalculators />} />
                  <Route path="simulador" element={<AdminSimulator />} />
                  <Route path="lista-de-compras" element={<AdminShoppingList />} />
                  <Route path="favoritos" element={<AdminFavorites />} />
                  <Route path="novidades" element={<AdminNews />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="assistente-ia" element={<AdminAIAssistant />} />
                  <Route path="comentarios" element={<AdminComments />} />
                  <Route path="notificacoes" element={<AdminNotifications />} />
                  <Route path="relatorios" element={<AdminReports />} />
                  <Route path="suporte" element={<AdminSupport />} />
                  <Route path="administradores" element={<AdminAdministrators />} />
                  <Route path="permissoes" element={<AdminPermissions />} />
                  <Route path="logs" element={<AdminLogs />} />
                  <Route path="configuracoes" element={<AdminSettings />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </AdminAuthProvider>
        }
      />

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
