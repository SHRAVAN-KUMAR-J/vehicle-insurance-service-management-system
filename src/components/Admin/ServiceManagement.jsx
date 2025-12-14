import { useEffect, useState } from 'react';
import api from '../../utils/api';

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: '',
    explanation: '',
    image: '',
    priceRange: '',
    isActive: true,
    requiredDocs: [{ name: '', sampleUrl: '' }],
  });
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/service?activeOnly=false');
      setServices(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingService) {
        res = await api.put(`/service/${editingService}`, formData);
        setServices(services.map((s) => (s._id === editingService ? res.data.data : s)));
        setEditingService(null);
      } else {
        res = await api.post('/service', formData);
        setServices([...services, res.data.data]);
      }
      setFormData({
        serviceName: '',
        explanation: '',
        image: '',
        priceRange: '',
        isActive: true,
        requiredDocs: [{ name: '', sampleUrl: '' }],
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || (editingService ? 'Failed to update service' : 'Failed to create service'));
    }
  };

  const handleChange = (e, index) => {
    if (index !== undefined) {
      const newDocs = [...formData.requiredDocs];
      newDocs[index][e.target.name] = e.target.value;
      setFormData({ ...formData, requiredDocs: newDocs });
    } else {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData({ ...formData, [e.target.name]: value });
    }
  };

  const handleEdit = (service) => {
    setFormData({
      serviceName: service.serviceName,
      explanation: service.explanation || '',
      image: service.image || '',
      priceRange: service.priceRange || '',
      isActive: service.isActive,
      requiredDocs: service.requiredDocs.length > 0 ? service.requiredDocs : [{ name: '', sampleUrl: '' }],
    });
    setEditingService(service._id);
    setError('');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/service/${id}`);
        setServices(services.filter((s) => s._id !== id));
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service');
      }
    }
  };

  const addDocField = () => {
    setFormData({
      ...formData,
      requiredDocs: [...formData.requiredDocs, { name: '', sampleUrl: '' }],
    });
  };

  const removeDocField = (index) => {
    if (formData.requiredDocs.length > 1) {
      const newDocs = formData.requiredDocs.filter((_, i) => i !== index);
      setFormData({ ...formData, requiredDocs: newDocs });
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    setFormData({
      serviceName: '',
      explanation: '',
      image: '',
      priceRange: '',
      isActive: true,
      requiredDocs: [{ name: '', sampleUrl: '' }],
    });
    setError('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Management</h2>

      {/* Create/Edit Service Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editingService ? 'Edit Service' : 'Create New Service'}
        </h3>
        {error && <p className="text-red-500 mb-4 p-2 bg-red-50 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service type"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (optional)</label>
            <textarea
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter service explanation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (e.g., 100-500, optional)</label>
            <input
              type="text"
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter price range"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
            {formData.requiredDocs.map((doc, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Document name"
                  value={doc.name}
                  onChange={(e) => handleChange(e, index)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  name="sampleUrl"
                  placeholder="Sample URL (optional)"
                  value={doc.sampleUrl}
                  onChange={(e) => handleChange(e, index)}
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.requiredDocs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDocField(index)}
                    className="px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDocField}
              className="mt-2 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              + Add Document Field
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
            {editingService && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Services List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Existing Services</h3>
        {services.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No services created yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{service.serviceName}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {service.explanation && <p className="text-sm text-gray-600 mb-2">{service.explanation}</p>}
                {service.image && (
                  <img src={service.image} alt={service.serviceName} className="w-full h-32 object-cover rounded mb-2" />
                )}
                {service.priceRange && <p className="text-sm text-gray-600 mb-2"><strong>Price Range:</strong> {service.priceRange}</p>}
                <p className="text-sm text-gray-600 mb-2">Required Documents:</p>
                <ul className="space-y-1 mb-4">
                  {service.requiredDocs.map((doc, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {doc.name}
                      {doc.sampleUrl && (
                        <a
                          href={doc.sampleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                        >
                          (View Sample)
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceManagement;