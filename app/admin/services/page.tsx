'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Save, X, ChevronRight, Folder, FileText } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  iconUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  shortDescription: string;
  iconUrl: string;
  parentId: string;
  isActive: boolean;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [parentServices, setParentServices] = useState<Service[]>([]);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    shortDescription: '',
    iconUrl: '',
    parentId: '',
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/services?active=false');
      const data = await response.json();
      
      if (data.success) {
        const allServices = data.data.sort((a: Service, b: Service) => a.order - b.order);
        setServices(allServices);
        
        // Separate parent services
        const parents = allServices.filter((s: Service) => !s.parentId);
        setParentServices(parents);
      } else {
        toast.error('Error al cargar servicios');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const getChildServices = (parentId: string): Service[] => {
    return services.filter(s => s.parentId === parentId).sort((a, b) => a.order - b.order);
  };

  const toggleExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = editingService ? 'PUT' : 'POST';
      const url = editingService ? `/api/services/${editingService.id}` : '/api/services';
      
      const payload = {
        ...formData,
        parentId: formData.parentId || null,
        order: editingService ? editingService.order : services.length
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingService ? 'Servicio actualizado' : 'Servicio creado');
        fetchServices();
        closeModal();
      } else {
        toast.error(data.error || 'Error al guardar servicio');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Error al guardar servicio');
    }
  };

  const handleDelete = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    const hasChildren = services.some(s => s.parentId === serviceId);
    
    if (hasChildren) {
      toast.error('No se puede eliminar un servicio que tiene sub-servicios');
      return;
    }
    
    if (!confirm(`¿Estás seguro de que quieres eliminar el servicio "${service?.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Servicio eliminado');
        fetchServices();
      } else {
        toast.error(data.error || 'Error al eliminar servicio');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar servicio');
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !service.isActive
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(service.isActive ? 'Servicio desactivado' : 'Servicio activado');
        fetchServices();
      } else {
        toast.error(data.error || 'Error al cambiar estado');
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Error al cambiar estado');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const sourceId = result.draggableId;
    const service = services.find(s => s.id === sourceId);
    if (!service) return;

    // Get siblings (services with same parent)
    const siblings = services.filter(s => s.parentId === service.parentId);
    const reorderedSiblings = Array.from(siblings);
    
    const sourceIndex = reorderedSiblings.findIndex(s => s.id === sourceId);
    const [removed] = reorderedSiblings.splice(sourceIndex, 1);
    reorderedSiblings.splice(result.destination.index, 0, removed);

    // Update order for siblings only
    const updates = reorderedSiblings.map((s, index) => ({
      id: s.id,
      order: index
    }));

    try {
      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: updates })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Orden actualizado');
        fetchServices();
      } else {
        toast.error('Error al actualizar orden');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar orden');
    }
  };

  const openModal = (service?: Service, parentId?: string) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        iconUrl: service.iconUrl || '',
        parentId: service.parentId || '',
        isActive: service.isActive
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        shortDescription: '',
        iconUrl: '',
        parentId: parentId || '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      iconUrl: '',
      parentId: '',
      isActive: true
    });
  };

  const ServiceItem = ({ service, index, isDragging }: { service: Service; index: number; isDragging?: boolean }) => {
    const hasChildren = services.some(s => s.parentId === service.id);
    const isExpanded = expandedServices.has(service.id);
    const isParent = !service.parentId;
    const parentService = service.parentId ? services.find(s => s.id === service.parentId) : null;

    return (
      <div className={`${!isParent ? 'ml-4 sm:ml-8 relative' : ''}`}>
        {/* Connection line for sub-services - Hidden on mobile */}
        {!isParent && (
          <div className="hidden sm:flex absolute left-0 top-0 bottom-0 w-8 items-start justify-center pt-6">
            <div className="w-px bg-gray-300 h-full"></div>
            <div className="absolute top-6 left-0 w-4 h-px bg-gray-300"></div>
          </div>
        )}
        
        <div
          className={`bg-white border rounded-lg p-3 sm:p-4 shadow-sm transition-all duration-200 ${
            isDragging ? 'shadow-lg opacity-90' : ''
          } ${
            isParent 
              ? 'border-blue-200 bg-blue-50/30' 
              : 'border-gray-200 bg-gray-50/30 sm:ml-2'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="hidden sm:block text-gray-400 hover:text-gray-600 cursor-grab">
              <GripVertical className="w-5 h-5" />
            </div>

            {isParent && hasChildren && (
              <button
                onClick={() => toggleExpanded(service.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ChevronRight 
                  className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              </button>
            )}

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {isParent ? (
                      <Folder className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <h3 className={`font-semibold text-sm sm:text-base ${isParent ? 'text-blue-900' : 'text-gray-900'} truncate`}>
                      {service.name}
                    </h3>
                    {!isParent && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
                        <span className="hidden sm:inline">Sub-servicio</span>
                        <span className="sm:hidden">Sub</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{service.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mt-2">
                    <p className="text-xs text-gray-500">
                      {isParent ? (
                        <span className="flex items-center gap-1">
                          <Folder className="w-3 h-3 inline" />
                          <span>Principal</span>
                        </span>
                      ) : (
                        <span className="flex flex-wrap items-center gap-1">
                          <FileText className="w-3 h-3 inline flex-shrink-0" />
                          <span className="truncate">Sub de: <strong className="truncate">{parentService?.name}</strong></span>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">Orden: {service.order + 1}</p>
                  </div>
                </div>
                
                <div className="flex flex-row items-center gap-1 sm:gap-2">
                  {isParent && (
                    <button
                      onClick={() => openModal(undefined, service.id)}
                      className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      title="Agregar sub-servicio"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => toggleServiceStatus(service)}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors duration-200 ${
                      service.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                    title={service.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {service.isActive ? <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                  
                  <button
                    onClick={() => openModal(service)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Editar"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
                  service.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.isActive ? 'Activo' : 'Inactivo'}
                </span>
                
                {service.iconUrl && (
                  <img
                    src={service.iconUrl}
                    alt={service.name}
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain flex-shrink-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Administra los servicios y sub-servicios del sitio web</p>
          
          {/* Hierarchy Summary - Responsive Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mt-3 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-blue-50 p-2 rounded-lg">
              <Folder className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700 text-center sm:text-left">
                <strong>{parentServices.length}</strong>
                <span className="hidden sm:inline"> Principales</span>
                <span className="sm:hidden block">Princ.</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-gray-50 p-2 rounded-lg">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 text-center sm:text-left">
                <strong>{services.filter(s => s.parentId).length}</strong>
                <span className="hidden sm:inline"> Sub-servicios</span>
                <span className="sm:hidden block">Subs</span>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-green-50 p-2 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
              <span className="text-gray-700 text-center sm:text-left">
                <strong>{services.filter(s => s.isActive).length}</strong>
                <span className="hidden sm:inline"> Activos</span>
                <span className="sm:hidden block">Act.</span>
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full lg:w-auto bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Nuevo Servicio Principal</span>
          <span className="sm:hidden">+ Servicio</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-56 lg:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {parentServices.map((parentService, parentIndex) => {
            const childServices = getChildServices(parentService.id);
            const isExpanded = expandedServices.has(parentService.id);
            
            return (
              <div key={parentService.id} className="relative">
                {/* Parent Service Section Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Folder className="w-4 sm:w-5 h-4 sm:h-5 text-blue-500 flex-shrink-0" />
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-blue-900">{parentService.name}</h3>
                    {childServices.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        {childServices.length} sub{childServices.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => openModal(undefined, parentService.id)}
                    className="w-full sm:w-auto text-xs sm:text-sm bg-green-50 text-green-700 px-2 sm:px-3 py-1 rounded-lg hover:bg-green-100 transition-colors duration-200 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3 flex-shrink-0" />
                    <span className="hidden sm:inline">Agregar Sub-servicio</span>
                    <span className="sm:hidden">+ Sub</span>
                  </button>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId={`parent-${parentService.id}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Draggable draggableId={parentService.id} index={parentIndex}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ServiceItem 
                                service={parentService} 
                                index={parentIndex}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                {isExpanded && childServices.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`children-${parentService.id}`}>
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef}
                          className="mt-1 sm:mt-2 space-y-1 sm:space-y-2"
                        >
                          {childServices.map((childService, childIndex) => (
                            <Draggable 
                              key={childService.id} 
                              draggableId={childService.id} 
                              index={childIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ServiceItem 
                                    service={childService} 
                                    index={childIndex}
                                    isDragging={snapshot.isDragging}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-lg lg:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold pr-4">
                {editingService ? 'Editar Servicio' : formData.parentId ? 'Nuevo Sub-servicio' : 'Nuevo Servicio Principal'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Service Type Indicator */}
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border">
                <p className="text-xs sm:text-sm text-gray-700">
                  <strong>Tipo:</strong> {
                    formData.parentId 
                      ? `Sub-servicio de "${parentServices.find(p => p.id === formData.parentId)?.name || 'Servicio seleccionado'}"`
                      : 'Servicio Principal'
                  }
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.parentId ? "Ej: Divorcio consensual" : "Ej: Derecho Familiar"}
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Servicio Principal
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({...formData, parentId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ninguno (Servicio Principal)</option>
                  {parentServices.filter(parent => parent.id !== editingService?.id).map(parent => (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Selecciona un servicio principal para crear un sub-servicio
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Descripción Corta
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Descripción Completa
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  URL del Ícono
                </label>
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData({...formData, iconUrl: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/assets/svg/icono.svg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ej: /assets/svg/derecho_civil.svg
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-xs sm:text-sm font-medium text-gray-700">
                  Servicio activo
                </label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 flex-shrink-0" />
                  {editingService ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}