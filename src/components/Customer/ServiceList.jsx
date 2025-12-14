import { useEffect, useState } from 'react';
import api from '../../utils/api';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/service');
      setServices(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch services');
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Available Services
      </h3>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Card Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-4 flex flex-col items-center text-center"
          >
            {service.image ? (
              <img
                src={service.image}
                alt={service.serviceName}
                className="w-32 h-32 object-cover rounded-lg mb-3"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg mb-3 flex items-center justify-center text-gray-500 text-sm">
                No Image
              </div>
            )}

            <h4 className="font-semibold text-lg text-gray-800">{service.serviceName}</h4>

            {service.priceRange && (
              <p className="text-gray-600 text-sm mt-1">
                💰 <strong>{service.priceRange}</strong>
              </p>
            )}

            <button
              onClick={() => setSelectedService(service)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Full-Screen Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[70%] lg:w-[60%] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative p-6">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              {selectedService.image && (
                <img
                  src={selectedService.image}
                  alt={selectedService.serviceName}
                  className="w-48 h-48 object-cover rounded-xl shadow-md mb-4"
                />
              )}

              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {selectedService.serviceName}
              </h3>

              {selectedService.explanation && (
                <p className="text-gray-700 mb-3">{selectedService.explanation}</p>
              )}

              {selectedService.priceRange && (
                <p className="text-gray-700 mb-3">
                  <strong>Price Range:</strong> {selectedService.priceRange}
                </p>
              )}

              <div className="w-full mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Required Documents:</h4>
                <ul className="list-disc text-left ml-6 space-y-2 text-gray-700">
                  {selectedService.requiredDocs?.map((doc, index) => (
                    <li key={index}>
                      {doc.name}
                      {doc.sampleUrl && (
                        <a
                          href={doc.sampleUrl}
                          className="text-blue-600 ml-2 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          (Sample)
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceList;
