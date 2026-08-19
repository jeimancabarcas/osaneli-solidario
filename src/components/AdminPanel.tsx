import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Search,
  MessageCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  Sliders,
  DollarSign,
  Package,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import {
  subscribeToOrders,
  updateOrderStatus,
  deleteOrder,
  verifyAdminAuth,
  subscribeToCampaign,
  updateCampaignStats
} from '../services/firebaseService';

interface AdminPanelProps {
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('osaneli_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState<string>('admin@osaneli.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Campaign counter state
  const [campaignStats, setCampaignStats] = useState<{ currentCount: number; totalCount: number }>({
    currentCount: 0,
    totalCount: 200,
  });
  const [isEditingCampaign, setIsEditingCampaign] = useState<boolean>(false);
  const [editCurrentCount, setEditCurrentCount] = useState<number>(0);
  const [editTotalCount, setEditTotalCount] = useState<number>(200);

  // Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubOrders = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders);
      setIsLoadingOrders(false);
    });

    const unsubCampaign = subscribeToCampaign((stats) => {
      setCampaignStats(stats);
      setEditCurrentCount(stats.currentCount);
      setEditTotalCount(stats.totalCount);
    });

    return () => {
      unsubOrders();
      unsubCampaign();
    };
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);

    try {
      const isValid = await verifyAdminAuth(emailInput, passwordInput);
      if (isValid) {
        setIsAuthenticated(true);
        localStorage.setItem('osaneli_admin_auth', 'true');
      } else {
        setAuthError('Credenciales incorrectas. Verifica el correo y contraseña.');
      }
    } catch (err) {
      setAuthError('Error al conectar con la base de datos.');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('osaneli_admin_auth');
    setPasswordInput('');
  };

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    setActionLoadingId(order.id);
    try {
      await updateOrderStatus(order, newStatus);
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (order: Order) => {
    const confirmed = window.confirm(`¿Estás seguro de eliminar el pedido de ${order.name}?`);
    if (!confirmed) return;

    setActionLoadingId(order.id);
    try {
      await deleteOrder(order.id, order.status === 'confirmed');
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveCampaignStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCampaignStats(Number(editCurrentCount), Number(editTotalCount));
      setIsEditingCampaign(false);
    } catch (err) {
      console.error('Error updating campaign stats:', err);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = selectedFilter === 'all' || o.status === selectedFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesFilter;

    const matchesSearch =
      o.name.toLowerCase().includes(q) ||
      o.docNumber.toLowerCase().includes(q) ||
      o.phoneNumber.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.address.toLowerCase().includes(q) ||
      o.itemSupported.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.status === 'confirmed').length;
  const rejectedCount = orders.filter((o) => o.status === 'rejected').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'confirmed')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // If not authenticated, render sleek Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d150f] text-[#dce5d9] flex flex-col items-center justify-center p-4 selection:bg-[#e9c349] selection:text-[#241a00]">
        <div className="w-full max-w-md bg-[#161d16] border border-[#46464d] p-8 shadow-2xl space-y-6 relative">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#1a221a] border border-[#e9c349] text-[#e9c349] mx-auto flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-[0.2em] font-bold block">
              Cartagena 2026 · Administración
            </span>
            <h2 className="font-anybody text-[26px] font-bold text-[#dce5d9] uppercase tracking-tight">
              Panel Administrativo
            </h2>
            <p className="text-[13px] text-[#c6c6ce]">
              Ingresa con tus credenciales de administrador para gestionar pedidos y confirmar donantes.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-[13px] font-mono-tag flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#c6c6ce] absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@osaneli.com"
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] pl-10 pr-3 py-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#c6c6ce] absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] pl-10 pr-3 py-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[13px] tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Ingresar al Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#46464d] text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="text-[#c6c6ce] hover:text-[#e9c349] font-mono-tag text-[12px] uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la Tienda Pública</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0d150f] text-[#dce5d9] flex flex-col selection:bg-[#e9c349] selection:text-[#241a00]">
      {/* Top Admin Navbar */}
      <header className="border-b border-[#46464d] bg-[#161d16] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#e9c349] text-[#241a00] flex items-center justify-center font-bold text-sm">
              OS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-anybody font-bold text-[16px] uppercase tracking-wider text-[#dce5d9]">
                  OSANELI ADMIN
                </span>
                <span className="bg-[#242c24] border border-[#e9c349]/40 text-[#e9c349] font-mono-tag text-[10px] px-2 py-0.5 uppercase font-bold">
                  Cartagena 2026
                </span>
              </div>
              <p className="text-[11px] font-mono-tag text-[#c6c6ce]">
                Gestión de Pedidos & Validación de Donantes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3 py-1.5 bg-[#1a221a] border border-[#46464d] text-[#c6c6ce] hover:text-[#dce5d9] hover:border-[#e9c349] font-mono-tag text-[11px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ver Tienda Pública</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/40 border border-red-800/80 text-red-300 hover:bg-red-900/60 font-mono-tag text-[11px] uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#161d16] border border-[#46464d] flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                Total Pedidos Registrados
              </span>
              <p className="font-anybody text-[28px] font-bold text-[#dce5d9]">
                {orders.length}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#1a221a] border border-[#46464d] flex items-center justify-center text-[#c6c6ce]">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-[#161d16] border border-amber-500/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono-tag text-[11px] text-amber-400 uppercase tracking-wider block font-bold">
                Pendientes por Confirmar
              </span>
              <p className="font-anybody text-[28px] font-bold text-amber-400">
                {pendingCount}
              </p>
            </div>
            <div className="w-11 h-11 bg-amber-950/40 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-[#161d16] border border-emerald-500/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono-tag text-[11px] text-emerald-400 uppercase tracking-wider block font-bold">
                Confirmados (En Vivo)
              </span>
              <p className="font-anybody text-[28px] font-bold text-emerald-400">
                {confirmedCount}
              </p>
            </div>
            <div className="w-11 h-11 bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-[#161d16] border border-[#e9c349]/50 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-wider block font-bold">
                Recaudado Confirmado
              </span>
              <p className="font-anybody text-[24px] font-bold text-[#e9c349]">
                COP ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-11 h-11 bg-[#1a221a] border border-[#e9c349]/50 flex items-center justify-center text-[#e9c349]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Campaign Live Counter Controller Box */}
        <div className="p-5 bg-[#161d16] border border-[#46464d] space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#46464d] pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#e9c349]" />
              <span className="font-mono-tag text-[12px] font-bold text-[#dce5d9] uppercase tracking-wider">
                Sincronización de Meta Pública · Cartagena 2026
              </span>
            </div>
            <button
              onClick={() => setIsEditingCampaign(!isEditingCampaign)}
              className="px-3 py-1 bg-[#1a221a] border border-[#46464d] hover:border-[#e9c349] text-[#e9c349] font-mono-tag text-[11px] uppercase tracking-wider cursor-pointer transition-colors"
            >
              {isEditingCampaign ? 'Cancelar Ajuste' : '⚙️ Calibrar Contador Manualmente'}
            </button>
          </div>

          {isEditingCampaign ? (
            <form onSubmit={handleSaveCampaignStats} className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Piezas Alcanzadas (Current)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={editCurrentCount}
                  onChange={(e) => setEditCurrentCount(Number(e.target.value))}
                  className="bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2 text-[14px] w-36 font-mono-tag focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Meta Total de Piezas
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={editTotalCount}
                  onChange={(e) => setEditTotalCount(Number(e.target.value))}
                  className="bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2 text-[14px] w-36 font-mono-tag focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#e9c349] text-[#241a00] font-mono-tag text-[12px] uppercase font-bold hover:bg-[#ffe088] cursor-pointer transition-colors"
              >
                Guardar en Firestore
              </button>
            </form>
          ) : (
            <div className="flex flex-wrap items-center gap-6 text-[13px] font-mono-tag">
              <p className="text-[#c6c6ce]">
                Contador en la Tienda:{' '}
                <strong className="text-[#e9c349] font-bold text-[16px]">
                  {campaignStats.currentCount}
                </strong>{' '}
                / {campaignStats.totalCount} piezas ({Math.round((campaignStats.currentCount / campaignStats.totalCount) * 100)}%)
              </p>
              <p className="text-[#c6c6ce] text-[12px]">
                💡 Al presionar <span className="text-emerald-400 font-bold">"Confirmar Pedido"</span> abajo, el sistema incrementa automáticamente este contador y publica el donante en el feed LIVE del sitio.
              </p>
            </div>
          )}
        </div>

        {/* Orders Table Section with Search and Filters */}
        <div className="bg-[#161d16] border border-[#46464d] p-6 space-y-6">
          {/* Header Controls: Search + Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 border-b border-[#46464d] pb-5">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-2 font-mono-tag text-[11px] uppercase font-bold border transition-colors cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'border-[#e9c349] bg-[#e9c349] text-[#241a00]'
                    : 'border-[#46464d] bg-[#1a221a] text-[#c6c6ce] hover:border-[#c6c6ce]'
                }`}
              >
                Todos ({orders.length})
              </button>

              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-3 py-2 font-mono-tag text-[11px] uppercase font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'pending'
                    ? 'border-amber-500 bg-amber-500 text-[#241a00]'
                    : 'border-[#46464d] bg-[#1a221a] text-amber-400 hover:border-amber-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pendientes ({pendingCount})</span>
              </button>

              <button
                onClick={() => setSelectedFilter('confirmed')}
                className={`px-3 py-2 font-mono-tag text-[11px] uppercase font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'confirmed'
                    ? 'border-emerald-500 bg-emerald-500 text-[#0d150f]'
                    : 'border-[#46464d] bg-[#1a221a] text-emerald-400 hover:border-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmados ({confirmedCount})</span>
              </button>

              <button
                onClick={() => setSelectedFilter('rejected')}
                className={`px-3 py-2 font-mono-tag text-[11px] uppercase font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedFilter === 'rejected'
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-[#46464d] bg-[#1a221a] text-red-400 hover:border-red-400'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Rechazados ({rejectedCount})</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-[#c6c6ce] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre, documento, celular, ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] pl-9 pr-3 py-2 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
              />
            </div>
          </div>

          {/* Orders List Content */}
          {isLoadingOrders ? (
            <div className="py-16 text-center space-y-3 font-mono-tag text-[#c6c6ce]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#e9c349]" />
              <p className="text-[13px]">Cargando pedidos en tiempo real...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-2 border border-dashed border-[#46464d] p-8">
              <Package className="w-8 h-8 text-[#46464d] mx-auto" />
              <p className="font-mono-tag text-[14px] text-[#c6c6ce]">
                No se encontraron pedidos con los filtros actuales.
              </p>
              <p className="text-[12px] text-[#c6c6ce]/70">
                Los nuevos pedidos realizados por los usuarios en la tienda aparecerán aquí al instante.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isLoadingThis = actionLoadingId === order.id;
                const cleanPhone = order.phoneNumber.replace(/\D/g, '');
                const clientWhatsAppUrl = `https://wa.me/57${cleanPhone.startsWith('57') ? cleanPhone.slice(2) : cleanPhone}`;

                return (
                  <div
                    key={order.id}
                    className={`p-5 bg-[#1a221a] border transition-all ${
                      order.status === 'confirmed'
                        ? 'border-emerald-700/60 bg-[#162218]'
                        : order.status === 'rejected'
                        ? 'border-red-800/40 bg-[#201515]'
                        : 'border-amber-600/50 bg-[#1d1e17]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#46464d]/60 pb-3.5">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-anybody font-bold text-[18px] text-[#dce5d9]">
                            {order.name}
                          </h4>
                          <span className="font-mono-tag text-[11px] bg-[#161d16] px-2 py-0.5 border border-[#46464d] text-[#c6c6ce]">
                            {order.docType}: {order.docNumber || 'No especificado'}
                          </span>
                          <span
                            className={`font-mono-tag text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                              order.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                                : order.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border border-red-500'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500'
                            }`}
                          >
                            ● {order.status === 'confirmed' ? 'Confirmado (En Vivo)' : order.status === 'rejected' ? 'Rechazado' : 'Pendiente de Pago'}
                          </span>
                        </div>
                        <p className="font-mono-tag text-[11px] text-[#c6c6ce]">
                          Registrado: {order.timeAgo || 'Recientemente'} ({new Date(order.timestamp).toLocaleString()})
                        </p>
                      </div>

                      {/* Right Total & WhatsApp Direct Action */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-mono-tag text-[10px] text-[#c6c6ce] uppercase block">
                            Total Pedido
                          </span>
                          <span className="font-mono-tag font-bold text-[18px] text-[#e9c349]">
                            COP ${order.totalAmount.toLocaleString()}
                          </span>
                        </div>

                        {order.phoneNumber && (
                          <a
                            href={clientWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 bg-[#25D366] text-[#0a1a0f] font-mono-tag text-[11px] font-bold uppercase tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center gap-1.5 shadow-sm"
                            title="Abrir chat de WhatsApp con el cliente"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>WhatsApp ({order.phoneNumber})</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3.5 text-[13px]">
                      {/* Delivery Info */}
                      <div className="space-y-1">
                        <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase font-bold block">
                          📍 Destino y Entrega
                        </span>
                        <p className="text-[#dce5d9] font-medium">
                          {order.city}
                        </p>
                        <p className="text-[#c6c6ce] text-[12px]">
                          {order.address || 'Sin dirección registrada'}
                        </p>
                      </div>

                      {/* Items Info */}
                      <div className="space-y-1 md:col-span-2">
                        <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase font-bold block">
                          👕 Piezas Solicitadas
                        </span>
                        <p className="text-[#dce5d9] font-mono-tag text-[12px] bg-[#161d16] p-2 border border-[#46464d]">
                          {order.itemSupported}
                        </p>
                        {order.message && (
                          <p className="text-[12px] text-[#c6c6ce] italic pt-1">
                            Mensaje del comprador: "{order.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#46464d]/60">
                      <div className="text-[11px] font-mono-tag text-[#c6c6ce]">
                        ID Pedido: <span className="text-[#dce5d9]">{order.id}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {order.status !== 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(order, 'confirmed')}
                            disabled={isLoadingThis}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tag text-[11px] uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmar (Sumar a la Meta)</span>
                          </button>
                        )}

                        {order.status !== 'pending' && (
                          <button
                            onClick={() => handleStatusChange(order, 'pending')}
                            disabled={isLoadingThis}
                            className="py-1.5 px-3 bg-amber-600/80 hover:bg-amber-600 text-white font-mono-tag text-[11px] uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Marcar como Pendiente</span>
                          </button>
                        )}

                        {order.status !== 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(order, 'rejected')}
                            disabled={isLoadingThis}
                            className="py-1.5 px-3 bg-[#242c24] border border-red-800/80 text-red-400 hover:bg-red-950/60 font-mono-tag text-[11px] uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rechazar</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(order)}
                          disabled={isLoadingThis}
                          className="py-1.5 px-2 text-[#c6c6ce] hover:text-red-400 hover:bg-red-950/30 p-1 border border-[#46464d] transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
