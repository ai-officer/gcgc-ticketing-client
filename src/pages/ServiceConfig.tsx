import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import { Pagination } from '../components/Pagination';

const ServiceConfig = () => {
  const { 
    categories, addCategory, updateCategory, deleteCategory,
    requestTemplates, addRequestTemplate, updateRequestTemplate, deleteRequestTemplate,
    incidentTypes, addIncidentType, updateIncidentType, deleteIncidentType,
    properties, addProperty, updateProperty, deleteProperty,
    locations, addLocation, updateLocation, deleteLocation
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'service' | 'properties'>('service');

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Property Modal
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [propName, setPropName] = useState('');
  const [propDesc, setPropDesc] = useState('');

  // Location Modal
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [locName, setLocName] = useState('');
  const [locPropId, setLocPropId] = useState('');
  const [locAddress, setLocAddress] = useState('');

  // Template Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');
  const [tplCat, setTplCat] = useState(categories[0]?.name || '');
  const [tplPriority, setTplPriority] = useState('medium');

  // SLA Modal
  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [editingSla, setEditingSla] = useState<any>(null);
  const [slaName, setSlaName] = useState('');
  const [slaDesc, setSlaDesc] = useState('');
  const [slaResponseHours, setSlaResponseHours] = useState(2);
  const [slaResolutionHours, setSlaResolutionHours] = useState(24);
  const [slaBusinessHours, setSlaBusinessHours] = useState(false);
  const [slaEscalation, setSlaEscalation] = useState(1);

  // Pagination states
  const [catPage, setCatPage] = useState(1);
  const [tplPage, setTplPage] = useState(1);
  const [slaPage, setSlaPage] = useState(1);
  const [propPage, setPropPage] = useState(1);
  const [locPage, setLocPage] = useState(1);
  const itemsPerPage = 5;

  const handleOpenCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatDesc(cat.description || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name: catName, description: catDesc });
    } else {
      addCategory({ name: catName, description: catDesc });
    }
    setIsCategoryModalOpen(false);
  };

  const handleOpenPropertyModal = (prop?: any) => {
    if (prop) {
      setEditingProperty(prop);
      setPropName(prop.name);
      setPropDesc(prop.description || '');
    } else {
      setEditingProperty(null);
      setPropName('');
      setPropDesc('');
    }
    setIsPropertyModalOpen(true);
  };

  const handleSaveProperty = () => {
    if (editingProperty) {
      updateProperty(editingProperty.id, { name: propName, description: propDesc });
    } else {
      addProperty({ name: propName, description: propDesc });
    }
    setIsPropertyModalOpen(false);
  };

  const handleOpenLocationModal = (loc?: any) => {
    if (loc) {
      setEditingLocation(loc);
      setLocName(loc.name);
      setLocPropId(loc.propertyId);
      setLocAddress(loc.address || '');
    } else {
      setEditingLocation(null);
      setLocName('');
      setLocPropId(properties[0]?.id || '');
      setLocAddress('');
    }
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = () => {
    if (editingLocation) {
      updateLocation(editingLocation.id, { name: locName, propertyId: locPropId, address: locAddress });
    } else {
      addLocation({ name: locName, propertyId: locPropId, address: locAddress });
    }
    setIsLocationModalOpen(false);
  };

  const handleOpenTemplateModal = (tpl?: any) => {
    if (tpl) {
      setEditingTemplate(tpl);
      setTplName(tpl.name);
      setTplDesc(tpl.description);
      setTplCat(tpl.category);
      setTplPriority(tpl.priority);
    } else {
      setEditingTemplate(null);
      setTplName('');
      setTplDesc('');
      setTplCat(categories[0]?.name || '');
      setTplPriority('medium');
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      updateRequestTemplate(editingTemplate.id, { name: tplName, description: tplDesc, category: tplCat, priority: tplPriority as any });
    } else {
      addRequestTemplate({ name: tplName, description: tplDesc, category: tplCat, priority: tplPriority as any });
    }
    setIsTemplateModalOpen(false);
  };

  const handleOpenSlaModal = (sla?: any) => {
    if (sla) {
      setEditingSla(sla);
      setSlaName(sla.name);
      setSlaDesc(sla.description);
      setSlaResponseHours(sla.responseSlaHours || 2);
      setSlaResolutionHours(sla.resolutionSlaHours || sla.slaHours || 24);
      setSlaBusinessHours(sla.businessHoursOnly || false);
      setSlaEscalation(sla.escalationLevel || 1);
    } else {
      setEditingSla(null);
      setSlaName('');
      setSlaDesc('');
      setSlaResponseHours(2);
      setSlaResolutionHours(24);
      setSlaBusinessHours(false);
      setSlaEscalation(1);
    }
    setIsSlaModalOpen(true);
  };

  const handleSaveSla = () => {
    const slaData = { 
      name: slaName, 
      description: slaDesc, 
      responseSlaHours: slaResponseHours,
      resolutionSlaHours: slaResolutionHours,
      slaHours: slaResolutionHours, // Fallback for older code
      businessHoursOnly: slaBusinessHours, 
      escalationLevel: slaEscalation 
    };

    if (editingSla) {
      updateIncidentType(editingSla.id, slaData);
    } else {
      addIncidentType(slaData);
    }
    setIsSlaModalOpen(false);
  };

  const totalCatPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice((catPage - 1) * itemsPerPage, catPage * itemsPerPage);

  const totalTplPages = Math.ceil(requestTemplates.length / itemsPerPage);
  const paginatedTemplates = requestTemplates.slice((tplPage - 1) * itemsPerPage, tplPage * itemsPerPage);

  const totalSlaPages = Math.ceil(incidentTypes.length / itemsPerPage);
  const paginatedSlas = incidentTypes.slice((slaPage - 1) * itemsPerPage, slaPage * itemsPerPage);

  const totalPropPages = Math.ceil(properties.length / itemsPerPage);
  const paginatedProperties = properties.slice((propPage - 1) * itemsPerPage, propPage * itemsPerPage);

  const totalLocPages = Math.ceil(locations.length / itemsPerPage);
  const paginatedLocations = locations.slice((locPage - 1) * itemsPerPage, locPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-text-main">System <span className="font-bold">Configuration</span></h1>
          <p className="text-sm font-mono text-text-faint uppercase tracking-widest mt-1">Dynamic Data Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-faint">
        <button
          onClick={() => setActiveTab('service')}
          className={`px-6 py-3 text-sm font-mono uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === 'service' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-text-faint hover:text-text-muted'
          }`}
        >
          Service Parameters
        </button>
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-3 text-sm font-mono uppercase tracking-widest transition-colors border-b-2 ${
            activeTab === 'properties' 
              ? 'border-indigo-500 text-indigo-400' 
              : 'border-transparent text-text-faint hover:text-text-muted'
          }`}
        >
          Properties & Locations
        </button>
      </div>

      {activeTab === 'service' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories */}
            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative flex flex-col">
              <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Service Categories</h3>
                </div>
                <button onClick={() => handleOpenCategoryModal()} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Category
                </button>
              </div>
              
              <div className="overflow-x-auto relative z-10 flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-faint bg-bg-base">
                      <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-secondary">{cat.name}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleOpenCategoryModal(cat)} className="text-text-faint hover:text-indigo-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteCategory(cat.id)} className="text-text-faint hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={catPage} totalPages={totalCatPages} onPageChange={setCatPage} />
            </div>

            {/* Templates */}
            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative flex flex-col">
              <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Request Templates</h3>
                </div>
                <button onClick={() => handleOpenTemplateModal()} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Template
                </button>
              </div>
              
              <div className="overflow-x-auto relative z-10 flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-faint bg-bg-base">
                      <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Template Name</th>
                      <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paginatedTemplates.map((tpl) => (
                      <tr key={tpl.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-secondary">{tpl.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-emerald-400">{tpl.category}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleOpenTemplateModal(tpl)} className="text-text-faint hover:text-indigo-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteRequestTemplate(tpl.id)} className="text-text-faint hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={tplPage} totalPages={totalTplPages} onPageChange={setTplPage} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SLAs */}
            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative flex flex-col">
              <div className="px-6 py-5 border-b border-border-faint flex justify-between items-center">
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">SLA Definitions</h3>
                <button onClick={() => handleOpenSlaModal()} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add SLA
                </button>
              </div>
              <div className="p-6 space-y-4 flex-1">
                {paginatedSlas.map((sla) => (
                  <div key={sla.id} className="flex items-center justify-between p-4 rounded-lg bg-bg-base border border-border-faint group">
                    <div>
                      <span className="text-sm font-medium text-text-tertiary">{sla.name}</span>
                      <p className="text-xs text-text-faint mt-1">{sla.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-text-faint uppercase tracking-tighter">Response</span>
                        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{sla.responseSlaHours || 2}h</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-text-faint uppercase tracking-tighter">Resolution</span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{sla.resolutionSlaHours || sla.slaHours || 24}h</span>
                      </div>
                      <div className="hidden group-hover:flex items-center gap-2">
                        <button onClick={() => handleOpenSlaModal(sla)} className="text-text-faint hover:text-indigo-400 transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteIncidentType(sla.id)} className="text-text-faint hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Pagination currentPage={slaPage} totalPages={totalSlaPages} onPageChange={setSlaPage} />
            </div>

            {/* System Variables */}
            <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative">
              <div className="px-6 py-5 border-b border-border-faint">
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">System Variables</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-bg-base border border-border-faint">
                  <div>
                    <p className="text-sm font-medium text-text-tertiary">Auto-Assignment</p>
                    <p className="text-xs text-text-faint mt-1">Route tickets based on load</p>
                  </div>
                  <div className="w-10 h-5 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-bg-base border border-border-faint">
                  <div>
                    <p className="text-sm font-medium text-text-tertiary">Email Notifications</p>
                    <p className="text-xs text-text-faint mt-1">Alerts on status change</p>
                  </div>
                  <div className="w-10 h-5 bg-indigo-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Properties */}
          <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative flex flex-col">
            <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-indigo-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Properties / Brands</h3>
              </div>
              <button onClick={() => handleOpenPropertyModal()} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Property
              </button>
            </div>
            
            <div className="overflow-x-auto relative z-10 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Property Name</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-bg-hover transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-text-secondary">{prop.name}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => handleOpenPropertyModal(prop)} className="text-text-faint hover:text-indigo-400 transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteProperty(prop.id)} className="text-text-faint hover:text-red-400 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={propPage} totalPages={totalPropPages} onPageChange={setPropPage} />
          </div>

          {/* Locations */}
          <div className="bg-bg-panel rounded-xl border border-border-subtle overflow-hidden relative flex flex-col">
            <div className="px-6 py-5 border-b border-border-faint flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-mono text-text-muted uppercase tracking-widest">Branch Locations</h3>
              </div>
              <button onClick={() => handleOpenLocationModal()} className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add Location
              </button>
            </div>
            
            <div className="overflow-x-auto relative z-10 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-faint bg-bg-base">
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider">Property</th>
                    <th className="px-6 py-4 text-xs font-mono text-text-faint uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLocations.map((loc) => {
                    const prop = properties.find(p => p.id === loc.propertyId);
                    return (
                      <tr key={loc.id} className="hover:bg-bg-hover transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-text-secondary">{loc.name}</td>
                        <td className="px-6 py-4 text-xs font-mono text-emerald-400">{prop?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleOpenLocationModal(loc)} className="text-text-faint hover:text-indigo-400 transition-colors">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => deleteLocation(loc.id)} className="text-text-faint hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={locPage} totalPages={totalLocPages} onPageChange={setLocPage} />
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Category Name</label>
                <input 
                  type="text" 
                  value={catName} 
                  onChange={e => setCatName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={catDesc} 
                  onChange={e => setCatDesc(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
              <button onClick={handleSaveCategory} disabled={!catName} className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50">Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Property Modal */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingProperty ? 'Edit Property' : 'New Property'}</h3>
              <button onClick={() => setIsPropertyModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Property Name</label>
                <input 
                  type="text" 
                  value={propName} 
                  onChange={e => setPropName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={propDesc} 
                  onChange={e => setPropDesc(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button onClick={() => setIsPropertyModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
              <button onClick={handleSaveProperty} disabled={!propName} className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50">Save Property</button>
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingLocation ? 'Edit Location' : 'New Location'}</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Location Name</label>
                <input 
                  type="text" 
                  value={locName} 
                  onChange={e => setLocName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Property</label>
                <select 
                  value={locPropId} 
                  onChange={e => setLocPropId(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Address</label>
                <textarea 
                  value={locAddress} 
                  onChange={e => setLocAddress(e.target.value)}
                  rows={2}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button onClick={() => setIsLocationModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
              <button onClick={handleSaveLocation} disabled={!locName || !locPropId} className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50">Save Location</button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingTemplate ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Template Name</label>
                <input 
                  type="text" 
                  value={tplName} 
                  onChange={e => setTplName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Category</label>
                <select 
                  value={tplCat} 
                  onChange={e => setTplCat(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Priority</label>
                <select 
                  value={tplPriority} 
                  onChange={e => setTplPriority(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={tplDesc} 
                  onChange={e => setTplDesc(e.target.value)}
                  rows={3}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button onClick={() => setIsTemplateModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
              <button onClick={handleSaveTemplate} disabled={!tplName} className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50">Save Template</button>
            </div>
          </div>
        </div>
      )}

      {/* SLA Modal */}
      {isSlaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-panel border border-border-subtle rounded-xl w-full max-w-md overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="px-6 py-4 border-b border-border-faint flex justify-between items-center">
              <h3 className="text-lg font-medium text-text-main">{editingSla ? 'Edit SLA' : 'New SLA'}</h3>
              <button onClick={() => setIsSlaModalOpen(false)} className="text-text-faint hover:text-text-main">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">SLA Name</label>
                <input 
                  type="text" 
                  value={slaName} 
                  onChange={e => setSlaName(e.target.value)}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Response SLA (h)</label>
                  <input 
                    type="number" 
                    value={slaResponseHours} 
                    onChange={e => setSlaResponseHours(Number(e.target.value))}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Resolution SLA (h)</label>
                  <input 
                    type="number" 
                    value={slaResolutionHours} 
                    onChange={e => setSlaResolutionHours(Number(e.target.value))}
                    className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-text-faint uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={slaDesc} 
                  onChange={e => setSlaDesc(e.target.value)}
                  rows={2}
                  className="block w-full rounded-lg bg-bg-base border border-border-subtle py-2.5 px-3 text-sm text-text-secondary focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border-faint flex justify-end gap-3 bg-bg-base">
              <button onClick={() => setIsSlaModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-subtle transition-colors">Cancel</button>
              <button onClick={handleSaveSla} disabled={!slaName} className="px-4 py-2 bg-indigo-600 text-text-main rounded-lg hover:bg-indigo-500 transition-all text-sm font-medium disabled:opacity-50">Save SLA</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceConfig;
