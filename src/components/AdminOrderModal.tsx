import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Clock, XCircle, Save, Package } from 'lucide-react';
import { Order, OrderStatus, OrderItem } from '../types';
import { COLLECTION_PIECES } from '../data/mockData';
import { createAdminOrder, saveEditedOrder } from '../services/firebaseService';

interface AdminOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit: Order | null; // If null, mode is create
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  isOpen,
  onClose,
  orderToEdit,
}) => {
  const isEditing = Boolean(orderToEdit);

  // Form states
  const [name, setName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Cartagena');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<OrderStatus>('pending');

  // Items in order
  const [items, setItems] = useState<OrderItem[]>([
    {
      pieceId: COLLECTION_PIECES[0].id,
      name: COLLECTION_PIECES[0].name,
      size: 'L',
      quantity: 1,
      priceCOP: COLLECTION_PIECES[0].priceCOP,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (orderToEdit) {
      setName(orderToEdit.name || '');
      setDocType(orderToEdit.docType || 'CC');
      setDocNumber(orderToEdit.docNumber || '');
      setPhoneNumber(orderToEdit.phoneNumber || '');
      setCity(orderToEdit.city || 'Cartagena');
      setAddress(orderToEdit.address || '');
      setMessage(orderToEdit.message || '');
      setStatus(orderToEdit.status || 'pending');

      if (orderToEdit.items && orderToEdit.items.length > 0) {
        setItems(orderToEdit.items);
      } else {
        // Fallback item from itemSupported
        setItems([
          {
            pieceId: COLLECTION_PIECES[0].id,
            name: orderToEdit.itemSupported || COLLECTION_PIECES[0].name,
            size: 'L',
            quantity: 1,
            priceCOP: orderToEdit.totalAmount || COLLECTION_PIECES[0].priceCOP,
          },
        ]);
      }
    } else {
      // Reset for creation
      setName('');
      setDocType('CC');
      setDocNumber('');
      setPhoneNumber('');
      setCity('Cartagena');
      setAddress('');
      setMessage('');
      setStatus('pending');
      setItems([
        {
          pieceId: COLLECTION_PIECES[0].id,
          name: COLLECTION_PIECES[0].name,
          size: 'L',
          quantity: 1,
          priceCOP: COLLECTION_PIECES[0].priceCOP,
        },
      ]);
    }
    setErrorMessage('');
  }, [orderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (pieceId: string) => {
    const piece = COLLECTION_PIECES.find((p) => p.id === pieceId) || COLLECTION_PIECES[0];
    setItems((prev) => [
      ...prev,
      {
        pieceId: piece.id,
        name: piece.name,
        size: 'L',
        quantity: 1,
        priceCOP: piece.priceCOP,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item;
        if (field === 'pieceId') {
          const piece = COLLECTION_PIECES.find((p) => p.id === value);
          return {
            ...item,
            pieceId: value,
            name: piece ? piece.name : item.name,
            priceCOP: piece ? piece.priceCOP : item.priceCOP,
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const calculatedTotalCOP = items.reduce((sum, item) => sum + item.priceCOP * item.quantity, 0);

  const summaryItemSupported =
    items.length > 0
      ? items.map((i) => `${i.name} (Talla ${i.size}) x${i.quantity}`).join(', ')
      : 'Pieza solidaria Cartagena 2026';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor ingresa el nombre del comprador.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Debes agregar al menos una prenda al pedido.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isEditing && orderToEdit) {
        await saveEditedOrder(
          orderToEdit.id,
          {
            name: name.trim(),
            docType,
            docNumber: docNumber.trim(),
            phoneNumber: phoneNumber.trim(),
            city: city.trim(),
            address: address.trim(),
            message: message.trim(),
            itemSupported: summaryItemSupported,
            items,
            totalAmount: calculatedTotalCOP,
            status,
          },
          orderToEdit.status
        );
      } else {
        await createAdminOrder({
          name: name.trim(),
          docType,
          docNumber: docNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          city: city.trim(),
          address: address.trim(),
          message: message.trim(),
          itemSupported: summaryItemSupported,
          items,
          totalAmount: calculatedTotalCOP,
          status,
          timestamp: Date.now(),
        });
      }
      onClose();
    } catch (err: any) {
      console.error('Error saving admin order:', err);
      setErrorMessage('Error al guardar en la base de datos: ' + (err.message || 'Inténtalo de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161d16] border border-[#46464d] w-full max-w-2xl text-[#dce5d9] p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#c6c6ce] hover:text-[#dce5d9] p-2 hover:bg-[#242c24] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#46464d] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#e9c349]" />
            <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase font-bold tracking-wider">
              {isEditing ? 'Edición de Pedido' : 'Nuevo Pedido Manual'}
            </span>
          </div>
          <h3 className="font-anybody text-[22px] font-bold text-[#dce5d9] uppercase tracking-tight mt-1">
            {isEditing ? `Editar Pedido: ${orderToEdit?.name}` : 'Crear Pedido en Base de Datos'}
          </h3>
          <p className="text-[13px] text-[#c6c6ce] mt-0.5">
            {isEditing
              ? 'Modifica los datos del cliente, prendas asignadas o estado de confirmación.'
              : 'Registra un pedido manual recibido por WhatsApp, llamada o canal externo.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 bg-red-950/50 border border-red-800 text-red-200 text-[13px] font-mono-tag">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Buyer Info */}
          <div className="space-y-4">
            <h4 className="font-mono-tag text-[12px] uppercase text-[#e9c349] font-bold border-b border-[#46464d]/60 pb-1">
              1. Datos del Comprador
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Gómez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Tipo de Documento
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="PAS">Pasaporte (PAS)</option>
                  <option value="NIT">NIT / Empresa</option>
                  <option value="TI">Tarjeta de Identidad (TI)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Número de Documento
                </label>
                <input
                  type="text"
                  placeholder="Ej. 1047489230"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 3001234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Destination */}
          <div className="space-y-4">
            <h4 className="font-mono-tag text-[12px] uppercase text-[#e9c349] font-bold border-b border-[#46464d]/60 pb-1">
              2. Ubicación y Entrega
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Ciudad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cartagena"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cra 3 #8-15, Bocagrande, Apto 402"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[14px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Items in Order */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#46464d]/60 pb-1">
              <h4 className="font-mono-tag text-[12px] uppercase text-[#e9c349] font-bold">
                3. Piezas Seleccionadas
              </h4>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem(COLLECTION_PIECES[0].id)}
                  className="text-[11px] font-mono-tag text-[#e9c349] hover:bg-[#242c24] px-2 py-0.5 border border-[#e9c349]/40 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Camiseta
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem(COLLECTION_PIECES[1].id)}
                  className="text-[11px] font-mono-tag text-[#e9c349] hover:bg-[#242c24] px-2 py-0.5 border border-[#e9c349]/40 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Short
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#1a221a] border border-[#46464d] flex flex-wrap items-center gap-3"
                >
                  {/* Piece selector */}
                  <div className="flex-1 min-w-[180px]">
                    <select
                      value={item.pieceId}
                      onChange={(e) => handleItemChange(idx, 'pieceId', e.target.value)}
                      className="w-full bg-[#161d16] border border-[#46464d] text-[#dce5d9] p-2 text-[12px] focus:border-[#e9c349] focus:outline-none"
                    >
                      {COLLECTION_PIECES.map((piece) => (
                        <option key={piece.id} value={piece.id}>
                          {piece.name} (COP ${piece.priceCOP.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div className="w-20">
                    <select
                      value={item.size}
                      onChange={(e) => handleItemChange(idx, 'size', e.target.value)}
                      className="w-full bg-[#161d16] border border-[#46464d] text-[#dce5d9] p-2 text-[12px] font-mono-tag focus:border-[#e9c349] focus:outline-none"
                    >
                      <option value="S">Talla S</option>
                      <option value="M">Talla M</option>
                      <option value="L">Talla L</option>
                      <option value="XL">Talla XL</option>
                      <option value="XXL">Talla XXL</option>
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))}
                      className="w-full bg-[#161d16] border border-[#46464d] text-[#dce5d9] p-2 text-[12px] font-mono-tag focus:border-[#e9c349] focus:outline-none"
                      title="Cantidad"
                    />
                  </div>

                  {/* Price */}
                  <div className="w-28 text-right font-mono-tag text-[13px] text-[#e9c349] font-bold">
                    COP ${(item.priceCOP * item.quantity).toLocaleString()}
                  </div>

                  {/* Delete Item */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="text-[#c6c6ce] hover:text-red-400 p-1.5 disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total Display */}
            <div className="flex justify-between items-center p-3 bg-[#242c24] border border-[#46464d]">
              <span className="font-mono-tag text-[12px] text-[#c6c6ce] uppercase">
                Total Calculado del Pedido:
              </span>
              <span className="font-mono-tag font-bold text-[18px] text-[#e9c349]">
                COP ${calculatedTotalCOP.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Section 4: Message / Notes */}
          <div className="space-y-1.5">
            <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block">
              Mensaje o Notas de Solidaridad (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Apoyando desde Cartagena..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none"
            />
          </div>

          {/* Section 5: Status Selection */}
          <div className="space-y-2">
            <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block font-bold">
              4. Estado del Pedido
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                  status === 'pending'
                    ? 'border-amber-500 bg-amber-950/40 text-amber-300 ring-1 ring-amber-500'
                    : 'border-[#46464d] bg-[#1a221a] text-[#c6c6ce]'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="font-mono-tag text-[12px] font-bold">Pendiente</p>
                  <p className="text-[10px] text-[#c6c6ce]">En espera de pago</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('confirmed')}
                className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                  status === 'confirmed'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-[#46464d] bg-[#1a221a] text-[#c6c6ce]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="font-mono-tag text-[12px] font-bold">Confirmado</p>
                  <p className="text-[10px] text-[#c6c6ce]">Publica en feed y meta</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatus('rejected')}
                className={`p-3 border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                  status === 'rejected'
                    ? 'border-red-500 bg-red-950/40 text-red-300 ring-1 ring-red-500'
                    : 'border-[#46464d] bg-[#1a221a] text-[#c6c6ce]'
                }`}
              >
                <XCircle className="w-4 h-4 text-red-400" />
                <div>
                  <p className="font-mono-tag text-[12px] font-bold">Rechazado</p>
                  <p className="text-[10px] text-[#c6c6ce]">Cancelado</p>
                </div>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#46464d]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-3 px-5 border border-[#46464d] text-[#c6c6ce] hover:text-[#dce5d9] font-mono-tag text-[12px] uppercase tracking-wider cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-3 px-6 bg-[#e9c349] text-[#241a00] font-mono-tag text-[12px] font-bold uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando en Firestore...' : isEditing ? 'Actualizar Pedido' : 'Crear Pedido'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
