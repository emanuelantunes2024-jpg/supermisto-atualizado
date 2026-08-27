import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { RequireAuth, RequireAdmin } from './components/RequireAuth.jsx';
import Paywall from './pages/Paywall.jsx';
import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Categories from './pages/Categories.jsx';
import Search from './pages/Search.jsx';
import Favorites from './pages/Favorites.jsx';
import Collections from './pages/Collections.jsx';
import CollectionDetail from './pages/CollectionDetail.jsx';
import ShoppingList from './pages/ShoppingList.jsx';
import IncomeCenter from './pages/IncomeCenter.jsx';
import SellRecipes from './pages/SellRecipes.jsx';
import News from './pages/News.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';
import CalculatorsIndex from './pages/calculators/CalculatorsIndex.jsx';
import CostCalculator from './pages/calculators/CostCalculator.jsx';
import PriceCalculator from './pages/calculators/PriceCalculator.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import RecipesAdmin from './pages/admin/RecipesAdmin.jsx';
import RecipeForm from './pages/admin/RecipeForm.jsx';
import CategoriesAdmin from './pages/admin/CategoriesAdmin.jsx';
import AdminPlaceholder from './pages/admin/AdminPlaceholder.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Paywall />} />

      <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recetas" element={<Recipes />} />
        <Route path="/recetas/:slug" element={<RecipeDetail />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/categorias/:slug" element={<Recipes />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/colecciones" element={<Collections />} />
        <Route path="/colecciones/:id" element={<CollectionDetail />} />
        <Route path="/lista-compras" element={<ShoppingList />} />
        <Route path="/central-de-rendimiento" element={<IncomeCenter />} />
        <Route path="/vender" element={<SellRecipes />} />
        <Route path="/novedades" element={<News />} />
        <Route path="/calculadoras" element={<CalculatorsIndex />} />
        <Route path="/calculadoras/costos" element={<CostCalculator />} />
        <Route path="/calculadoras/precios" element={<PriceCalculator />} />
        <Route path="/mi-plan" element={<ComingSoon titulo="Mi Plan" />} />
        <Route path="/asistente-ia" element={<ComingSoon titulo="Asistente IA" asistente />} />
        <Route path="/configuracion" element={<Settings />} />
      </Route>
      </Route>

      <Route element={<RequireAdmin />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="recetas" element={<RecipesAdmin />} />
        <Route path="recetas/nueva" element={<RecipeForm />} />
        <Route path="recetas/:id/editar" element={<RecipeForm />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
        <Route path="etiquetas" element={<AdminPlaceholder titulo="Etiquetas" icon="tag" />} />
        <Route path="usuarios" element={<AdminPlaceholder titulo="Usuarios" icon="users" descripcion="La gestión de usuarios llegará junto con la autenticación y el control de suscripción." />} />
        <Route path="novedades" element={<AdminPlaceholder titulo="Novedades" icon="bell" descripcion="Podés marcar o desmarcar una receta como novedad desde la lista de Recetas." />} />
        <Route path="reportes" element={<AdminPlaceholder titulo="Reportes" icon="report" />} />
        <Route path="configuracion" element={<AdminPlaceholder titulo="Configuración" icon="settings" />} />
      </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
