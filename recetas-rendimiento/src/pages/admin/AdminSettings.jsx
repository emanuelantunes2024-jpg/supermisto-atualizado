import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext.jsx';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';

const ITEMS_ESTADO = [
  { clave: 'sessionSecret', label: 'Sesiones firmadas (SESSION_SECRET)' },
  { clave: 'adminPasswordHash', label: 'Contraseña inicial del panel (ADMIN_PASSWORD_HASH)' },
  { clave: 'redisConectado', label: 'Almacenamiento persistente (Redis)' },
  { clave: 'hotmartHottok', label: 'Webhook de Hotmart (HOTMART_HOTTOK)' },
];

function EstadoSistema() {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    let activo = true;
    fetch('/api/admin/status', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => activo && setEstado(d))
      .catch(() => activo && setEstado(false));
    return () => {
      activo = false;
    };
  }, []);

  if (estado === null) return null;

  return (
    <div className="card p-5">
      <p className="text-[13px] font-bold text-ink">Estado del sistema</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
        Qué está configurado en el servidor ahora mismo (sin mostrar ningún valor secreto).
      </p>
      <ul className="mt-3 space-y-2">
        {ITEMS_ESTADO.map(({ clave, label }) => {
          const ok = estado ? Boolean(estado[clave]) : false;
          return (
            <li key={clave} className="flex items-center gap-2.5 text-[12.5px]">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <Icon name={ok ? 'check' : 'x'} className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className={ok ? 'text-ink/70' : 'font-semibold text-amber-800'}>{label}</span>
            </li>
          );
        })}
      </ul>
      {estado && estado.redisEnvPresente && !estado.redisConectado && (
        <p className="mt-3 text-[12px] font-semibold text-amber-800">
          Redis tiene variables configuradas pero no respondió — revisá la integración en Vercel.
        </p>
      )}
      {estado && !estado.redisEnvPresente && (
        <p className="mt-3 text-[12px] font-semibold text-amber-800">
          Falta conectar: Vercel → tu proyecto → Storage → Marketplace → Redis.
        </p>
      )}
    </div>
  );
}

const BANNERS = [
  { campo: 'bannerBibliotecaImagen', label: 'Banner grande de la home ("Biblioteca en expansión")' },
  { campo: 'bannerNovedadesImagen', label: 'Banner chico de novedades' },
];

function ImagenesPortada() {
  const { configSitio, guardarConfigSitio } = useStore();
  const [subiendo, setSubiendo] = useState(null);
  const [error, setError] = useState(null);
  const [guardado, setGuardado] = useState(null);

  function onArchivo(campo, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setGuardado(null);
    setSubiendo(campo);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await guardarConfigSitio({ [campo]: reader.result });
        setGuardado(campo);
        setTimeout(() => setGuardado(null), 2500);
      } catch {
        setError('No se pudo guardar la imagen. Revisá que el almacenamiento (Redis) esté conectado.');
      } finally {
        setSubiendo(null);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="card p-5">
      <p className="text-[13px] font-bold text-ink">Imágenes de portada (home)</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
        Reemplazá las imágenes de los banners de la página de inicio. Se actualizan para todos los
        visitantes en cuanto se guardan.
      </p>

      <div className="mt-4 space-y-3">
        {BANNERS.map(({ campo, label }) => (
          <div key={campo} className="flex items-center gap-3 rounded-xl border border-ink/10 p-3">
            <img src={configSitio[campo]} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-ink">{label}</p>
              {guardado === campo && <p className="text-[11.5px] font-semibold text-emerald-600">Imagen actualizada ✓</p>}
            </div>
            <label className="btn-secondary shrink-0 cursor-pointer !py-1.5 !text-[11.5px]">
              <Icon name="upload" className="w-3.5 h-3.5" /> {subiendo === campo ? 'Subiendo…' : 'Cambiar'}
              <input type="file" accept="image/*" onChange={(e) => onArchivo(campo, e)} className="hidden" disabled={Boolean(subiendo)} />
            </label>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}
    </div>
  );
}

function MarcaAdmin() {
  const { configSitio, guardarConfigSitio } = useStore();
  const [form, setForm] = useState({
    marcaPrefijo: configSitio.marcaPrefijo,
    marcaNombreA: configSitio.marcaNombreA,
    marcaNombreB: configSitio.marcaNombreB,
    marcaEmpresa: configSitio.marcaEmpresa,
  });
  const [subiendoLogo, setSubiendoLogo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState(null);

  // La config real llega de forma asíncrona (fetch al backend) después del
  // primer render — cuando llega, el formulario se actualiza para mostrar
  // el nombre que el admin ya haya guardado antes (si lo hizo).
  useEffect(() => {
    setForm({
      marcaPrefijo: configSitio.marcaPrefijo,
      marcaNombreA: configSitio.marcaNombreA,
      marcaNombreB: configSitio.marcaNombreB,
      marcaEmpresa: configSitio.marcaEmpresa,
    });
  }, [configSitio.marcaPrefijo, configSitio.marcaNombreA, configSitio.marcaNombreB, configSitio.marcaEmpresa]);

  function onLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSubiendoLogo(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await guardarConfigSitio({ marcaLogo: reader.result });
      } catch {
        setError('No se pudo guardar el logo. Revisá que el almacenamiento (Redis) esté conectado.');
      } finally {
        setSubiendoLogo(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await guardarConfigSitio(form);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch {
      setError('No se pudo guardar. Revisá que el almacenamiento (Redis) esté conectado.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card p-5">
      <p className="text-[13px] font-bold text-ink">Marca (perfil del sitio)</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
        El nombre y el logo que aparecen arriba de todo, en el menú y en la pantalla de entrada.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink/10 p-3">
        <img
          src={configSitio.marcaLogo || '/icons/icon-192.png'}
          alt=""
          className="h-14 w-14 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold text-ink">Logo</p>
          <p className="text-[11.5px] text-ink/50">Si no subís uno propio, se usa el gorro de chef del diseño original.</p>
        </div>
        <label className="btn-secondary shrink-0 cursor-pointer !py-1.5 !text-[11.5px]">
          <Icon name="upload" className="w-3.5 h-3.5" /> {subiendoLogo ? 'Subiendo…' : 'Cambiar'}
          <input type="file" accept="image/*" onChange={onLogo} className="hidden" disabled={subiendoLogo} />
        </label>
      </div>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Texto arriba del nombre</label>
            <input
              value={form.marcaPrefijo}
              onChange={(e) => setForm((f) => ({ ...f, marcaPrefijo: e.target.value }))}
              className="input mt-1.5"
            />
          </div>
          <div>
            <label className="label">Nombre de la empresa</label>
            <input
              value={form.marcaEmpresa}
              onChange={(e) => setForm((f) => ({ ...f, marcaEmpresa: e.target.value }))}
              className="input mt-1.5"
            />
          </div>
          <div>
            <label className="label">Nombre (línea 1, resaltada)</label>
            <input
              value={form.marcaNombreA}
              onChange={(e) => setForm((f) => ({ ...f, marcaNombreA: e.target.value }))}
              className="input mt-1.5"
            />
          </div>
          <div>
            <label className="label">Nombre (línea 2)</label>
            <input
              value={form.marcaNombreB}
              onChange={(e) => setForm((f) => ({ ...f, marcaNombreB: e.target.value }))}
              className="input mt-1.5"
            />
          </div>
        </div>
        <button type="submit" disabled={guardando} className="btn-primary !py-2 !text-[12.5px]">
          {guardando ? 'Guardando…' : guardado ? 'Guardado ✓' : 'Guardar nombre'}
        </button>
      </form>

      {error && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}
    </div>
  );
}

const MENSAJES_ERROR = {
  falta_password_actual: 'Ingresá tu contraseña actual para confirmar el cambio.',
  nada_para_cambiar: 'Completá un email nuevo y/o una contraseña nueva.',
  email_invalido: 'Ese email no parece válido.',
  password_muy_corta: 'La contraseña nueva debe tener al menos 8 caracteres.',
  password_actual_incorrecta: 'La contraseña actual no es correcta.',
  no_autorizado: 'Tu sesión venció. Volvé a entrar e intentá de nuevo.',
  falta_admin_password_hash: 'El panel todavía no tiene una contraseña configurada en el servidor.',
  error_redis: 'No se pudo guardar: el almacenamiento del panel no está disponible en este momento.',
  redis_no_configurado:
    'Todavía falta conectar el almacenamiento en Vercel (Storage → Marketplace → Redis). Sin eso, el panel no puede guardar la contraseña nueva de forma permanente.',
  error_al_guardar: 'No se pudo guardar el cambio. Intentá de nuevo.',
  error_desconocido: 'No se pudo guardar el cambio. Intentá de nuevo.',
};

function CampoPassword({ label, value, onChange, autoComplete, placeholder }) {
  const [ver, setVer] = useState(false);
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative mt-1.5">
        <input
          type={ver ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="input pr-10"
        />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
          aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <Icon name={ver ? 'eyeOff' : 'eye'} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { email, alterarCredencialesAdmin } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);

    const emailNuevo = newEmail.trim();
    const passwordNueva = newPassword.trim();

    if (!emailNuevo && !passwordNueva) {
      setError('nada_para_cambiar');
      return;
    }
    if (passwordNueva && passwordNueva !== confirmPassword.trim()) {
      setError('password_no_coincide');
      return;
    }

    setGuardando(true);
    const r = await alterarCredencialesAdmin({
      currentPassword,
      newEmail: emailNuevo || undefined,
      newPassword: passwordNueva || undefined,
    });
    setGuardando(false);

    if (!r.ok) {
      setError(r.error || 'error_desconocido');
      return;
    }

    navigate('/admin/entrar', {
      replace: true,
      state: { mensaje: `Credencial actualizada. Iniciá sesión de nuevo con ${r.email}.` },
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Configuración del administrador</h1>
        <p className="mt-1 text-sm text-ink/50">
          Sesión actual: <span className="font-semibold text-ink/70">{email}</span>
        </p>
      </div>

      <EstadoSistema />

      <MarcaAdmin />

      <ImagenesPortada />

      <div className="card p-5">
        <p className="text-[13px] font-bold text-ink">Cambiar email y/o contraseña</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink/50">
          Dejá en blanco lo que no quieras cambiar. La contraseña se guarda siempre como hash, nunca en
          texto plano. Al guardar, se cierra esta sesión y hay que volver a entrar con la credencial nueva.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <CampoPassword
            label="Contraseña actual (obligatoria para confirmar)"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="border-t border-line pt-3">
            <label className="label">Email nuevo (opcional)</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={email || 'nuevo-admin@tuemail.com'}
              autoComplete="username"
              className="input mt-1.5"
            />
          </div>

          <CampoPassword
            label="Contraseña nueva (opcional, mínimo 8 caracteres)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />
          {newPassword && (
            <CampoPassword
              label="Confirmar contraseña nueva"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}

          <button type="submit" disabled={guardando} className="btn-primary w-full justify-center !py-2.5">
            {guardando ? 'Guardando…' : 'Guardar y cerrar sesión'}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
            <p className="text-[12.5px] font-semibold text-amber-800">
              {error === 'password_no_coincide'
                ? 'La confirmación no coincide con la contraseña nueva.'
                : MENSAJES_ERROR[error] || MENSAJES_ERROR.error_desconocido}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
